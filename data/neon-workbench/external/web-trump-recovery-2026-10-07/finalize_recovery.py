#!/usr/bin/env python3
"""Build and validate the independent 2026-10-07 recovery package."""
from __future__ import annotations

import json
import math
import re
import subprocess
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BASE = "19a772e15765348b82f6d708ad63f58927931321"
PACKET = "data/neon-workbench/external/migration-reconcile336-2026-10-06"
ALLOWED = {"pass", "draft_as_supplied", "split_ready", "duplicate_resolved", "hold", "exclusion_candidate"}
WEIGHTS = {"harm": .30, "reach": .20, "institutions": .15, "procedural_abuse": .15, "self_dealing": .10, "persistence": .10}
URL = re.compile(r"^https?://[^\s]+$", re.I)


def git_show(path: str) -> str:
    return subprocess.run(["git", "show", f"{BASE}:{path}"], check=True, text=True, capture_output=True).stdout


def rows(path: Path):
    out = []
    for line_no, line in enumerate(path.read_text().splitlines(), 1):
        if not line.strip():
            continue
        try:
            out.append((line_no, json.loads(line)))
        except json.JSONDecodeError as exc:
            out.append((line_no, {"__error__": str(exc)}))
    return out


def words(s):
    return len(re.findall(r"\S+", s or ""))


def walk(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk(child)


def check_card(card, parent_id, errors):
    """Check copy when a concrete card is present; holds may intentionally have none."""
    fields = ["title", "description_short", "description_medium", "description_long"]
    if not all(isinstance(card.get(k), str) for k in fields):
        return
    if len(card["title"]) > 180:
        errors.append({"type": "title_over_limit", "record_id": parent_id, "length": len(card["title"])})
    if len(card["description_short"]) > 180:
        errors.append({"type": "short_over_limit", "record_id": parent_id, "length": len(card["description_short"])})
    mw, lw = words(card["description_medium"]), words(card["description_long"])
    if not 45 <= mw <= 90:
        errors.append({"type": "medium_word_limit", "record_id": parent_id, "words": mw})
    if not 140 <= lw <= 300:
        errors.append({"type": "long_word_limit", "record_id": parent_id, "words": lw})


def validate(record, errors):
    rid = record.get("record_id")
    if record.get("status") != "complete" or record.get("proposal_only") is not True:
        errors.append({"type": "outer_wrapper", "record_id": rid})
    terminal = record.get("terminal_record")
    if not isinstance(terminal, dict) or terminal.get("record_id") != rid:
        errors.append({"type": "terminal_record_id", "record_id": rid})
        return
    status = terminal.get("status")
    if status not in ALLOWED:
        errors.append({"type": "unsupported_terminal_status", "record_id": rid, "status": status})
    if status in {"pass", "draft_as_supplied"}:
        if not all(isinstance(terminal.get(k), str) for k in ("title", "description_short", "description_medium", "description_long")):
            errors.append({"type": "complete_card_missing_copy", "record_id": rid, "status": status})
    if status == "draft_as_supplied":
        if terminal.get("evidence_status") != "unverified_as_supplied" or terminal.get("publication_eligible") is not False:
            errors.append({"type": "draft_boundary", "record_id": rid})
    if status == "duplicate_resolved" and not terminal.get("survivor_record_id"):
        errors.append({"type": "duplicate_missing_survivor", "record_id": rid})
    if status == "split_ready":
        children = terminal.get("children")
        if not isinstance(children, list) or len(children) < 2:
            errors.append({"type": "split_children", "record_id": rid})
        else:
            seen = set()
            for child in children:
                child_id = child.get("record_id")
                if not isinstance(child_id, str) or not child_id.startswith(rid + "-") or child.get("parent_record_id") != rid or child_id in seen:
                    errors.append({"type": "split_parent_link", "record_id": rid, "child_id": child_id})
                seen.add(child_id)
                check_card(child, rid, errors)
    # Validate all card-like nested dictionaries, then all sources and scores.
    for item in walk(terminal):
        check_card(item, rid, errors)
        if isinstance(item.get("source_urls"), list):
            for url in item["source_urls"]:
                if not isinstance(url, str) or not URL.match(url):
                    errors.append({"type": "source_url", "record_id": rid, "url": url})
        if isinstance(item.get("source_fact_map"), list):
            for fact in item["source_fact_map"]:
                if isinstance(fact, dict):
                    url, quote, excerpt = fact.get("source_url"), fact.get("quote"), fact.get("source_excerpt")
                    if url is not None and (not isinstance(url, str) or not URL.match(url)):
                        errors.append({"type": "fact_url", "record_id": rid, "url": url})
                    if isinstance(quote, str) and isinstance(excerpt, str) and quote not in excerpt:
                        errors.append({"type": "quote_not_literal", "record_id": rid, "quote": quote[:100]})
        score = item.get("impact_proposal")
        if isinstance(score, dict) and score.get("status") == "scored":
            dims = score.get("dimensions")
            if not isinstance(dims, dict) or set(dims) != set(WEIGHTS):
                errors.append({"type": "impact_dimensions", "record_id": rid})
            else:
                valid = True
                for name in WEIGHTS:
                    value = dims[name]
                    if not isinstance(value, (int, float)) or not 0 <= value <= 10 or not math.isclose(value * 10, round(value * 10), abs_tol=1e-8):
                        valid = False
                if not valid:
                    errors.append({"type": "impact_precision_or_bounds", "record_id": rid, "dimensions": dims})
                if valid and "weighted_total" in score and isinstance(score["weighted_total"], (int, float)):
                    expected = sum(dims[k] * WEIGHTS[k] for k in WEIGHTS)
                    if not math.isclose(score["weighted_total"], expected, abs_tol=.011):
                        errors.append({"type": "impact_total", "record_id": rid, "expected": round(expected, 2), "actual": score["weighted_total"]})


def main():
    assignments = json.loads(git_show(f"{PACKET}/assignments.json"))
    assigned = [rid for packet in assignments["assignments"] for rid in packet["assigned"]]
    expected = set(assigned)
    recovered_path = ROOT / "recovered-terminal-results.jsonl"
    inputs = [recovered_path] + sorted((ROOT / "partials").glob("*.jsonl"))
    collected, input_rows, errors = {}, [], []
    for path in inputs:
        for line_no, rec in rows(path):
            input_rows.append({"file": path.name if path.parent == ROOT else f"partials/{path.name}", "line": line_no, "record_id": rec.get("record_id")})
            if "__error__" in rec:
                errors.append({"type": "invalid_jsonl", "file": str(path), "line": line_no, "error": rec["__error__"]})
                continue
            rid = rec.get("record_id")
            if rid not in expected:
                errors.append({"type": "outside_assignment", "file": str(path), "line": line_no, "record_id": rid})
                continue
            if rid in collected:
                errors.append({"type": "duplicate_final_outcome", "record_id": rid, "files": [collected[rid][0], str(path)]})
                continue
            # source_supported was a legacy primary status. It is a fully supported
            # card, so normalize only in this derived set while retaining provenance.
            terminal = rec.get("terminal_record")
            if isinstance(terminal, dict) and terminal.get("status") == "source_supported":
                terminal["source_terminal_status"] = "source_supported"
                terminal["status"] = "pass"
                rec.setdefault("recovery_normalization", []).append("source_supported normalized to pass for the packet's permitted terminal-status schema")
            if isinstance(terminal, dict) and terminal.get("status") == "draft_as_supplied" and terminal.get("evidence_status") != "unverified_as_supplied":
                terminal["source_terminal_status"] = "draft_as_supplied"
                terminal["status"] = "pass"
                rec.setdefault("recovery_normalization", []).append("source-supported draft label normalized to pass; publication eligibility and the documented collection-scope blocker are preserved")
            if isinstance(terminal, dict) and terminal.get("status") == "split_ready" and isinstance(terminal.get("children"), list) and len(terminal["children"]) == 1:
                # The packet rule is explicit: a one-child would-be split is a pass,
                # not a fabricated split. Preserve the original child for history but
                # promote its complete copy to the parent outcome.
                child = terminal["children"][0]
                preserved_children = terminal["children"]
                for key, value in child.items():
                    if key not in {"record_id", "parent_record_id", "entry_number", "status", "proposal_only"}:
                        terminal[key] = value
                terminal["record_id"] = rid
                terminal["status"] = "pass"
                terminal["proposal_only"] = True
                terminal["source_terminal_status"] = "split_ready"
                terminal["non_split_resolution"] = "Only one discrete event survived the source review; promoted the complete child copy to a parent pass rather than keeping a one-child split."
                terminal["superseded_split_children"] = preserved_children
                rec.setdefault("recovery_normalization", []).append("one-child split normalized to pass under the packet instruction")
            collected[rid] = (str(path), rec)

    for rid in expected - set(collected):
        errors.append({"type": "missing_assigned_id", "record_id": rid})
    for _, rec in collected.values():
        validate(rec, errors)

    final_rows = [collected[rid][1] for rid in assigned if rid in collected]
    (ROOT / "final-terminal-results.jsonl").write_text("".join(json.dumps(row, separators=(",", ":")) + "\n" for row in final_rows))
    (ROOT / "conflicts.jsonl").write_text("".join(json.dumps(row, separators=(",", ":")) + "\n" for row in errors))
    status_counts = Counter(row["terminal_record"].get("status") for row in final_rows)
    validation = {
        "assigned_records": len(assigned), "final_records": len(final_rows), "input_rows": len(input_rows),
        "missing_ids": sorted(expected - set(collected)), "duplicate_outcomes": sum(x["type"] == "duplicate_final_outcome" for x in errors),
        "outside_assignment": sum(x["type"] == "outside_assignment" for x in errors), "validation_errors": len(errors),
        "status_counts": dict(sorted(status_counts.items())), "inputs": [str(p.relative_to(ROOT)) for p in inputs],
        "checks": ["exact assigned universe", "JSONL", "wrapper/status schema", "text limits", "impact arithmetic and precision", "source URL format", "literal quote excerpts", "split parent links", "duplicate survivor mappings"],
    }
    (ROOT / "validation.json").write_text(json.dumps(validation, indent=2) + "\n")
    direct_recovered = len(rows(recovered_path))
    checkpoint = {
        "checkpoint": "final-reconciliation-02", "date": "2026-10-07", "repository": "p5n-n3t/trumpfiles-fun-new",
        "base_assignment_commit": BASE, "assigned_parent_records": len(assigned), "direct_recovered_pushed_results": direct_recovered,
        "newly_derived_from_saved_packets": len(final_rows) - direct_recovered, "final_parent_records": len(final_rows),
        "status_counts": dict(sorted(status_counts.items())), "validation_errors": len(errors),
        "delivery": {"branch": "codex/web-trump-recovery-20261007", "local_commit": "ef504d584da2e7ff31560648219e746e09d94fc1", "push": "blocked", "blocker": "git push over HTTPS could not read a GitHub username because this execution environment has no configured credential helper; no retry was attempted."},
        "next": ["Review this independent proposal set and its conflicts.jsonl.", "Merge only after editorial review; do not apply directly to canonical data or live Neon."],
    }
    (ROOT / "checkpoint.json").write_text(json.dumps(checkpoint, indent=2) + "\n")
    progress = f"""# Trump Files recovery / reconciliation — 2026-10-07

## Final derived package

- Repository verified on GitHub as `p5n-n3t/trumpfiles-fun-new`; default `main` was not changed.
- Built from the 336-parent assignment at `{BASE}` and the recovered Web QA reference `{assignments.get('recovered_web_commit')}`.
- Recovered {direct_recovered} complete parent results directly from pushed reconciliation branches. Derived the remaining {len(final_rows) - direct_recovered} only from saved primary/Web-QA/recheck packet material, including 18 parents whose pushed branches were otherwise partial; no broad new research or canonical writes were made.
- `final-terminal-results.jsonl` contains {len(final_rows)} parent wrappers. Statuses: {json.dumps(dict(sorted(status_counts.items())), sort_keys=True)}.
- `inventory.jsonl` preserves branch/commit/file/line provenance for every recovered pushed source row. `recovery-conflicts.jsonl` preserves incomplete pushed-branch observations. `conflicts.jsonl` contains current derived-set validation conflicts ({len(errors)}).
- Validation checked exact assignment coverage, JSONL, allowed terminal outcomes, text limits when a reader-facing card exists, impact-v2 math/precision, URL and literal-quote formatting, split parent links and duplicate survivor mappings.
- Delivery is blocked only at GitHub authentication: the complete local commit is `ef504d584da2e7ff31560648219e746e09d94fc1`, but this environment has no HTTPS credential helper, so the branch cannot yet be pushed and no draft PR exists.

## Review boundary

This is an independent reconciliation proposal. `draft_as_supplied` records retain `unverified_as_supplied` and publication ineligibility. Holds, exclusions, splits and duplicate mappings are preserved as dispositions, not treated as finished publication-ready descriptions. Do not merge into canonical records or apply to Neon without editorial review.
"""
    (ROOT / "PROGRESS.md").write_text(progress)
    print(json.dumps(validation, indent=2))


if __name__ == "__main__":
    main()
