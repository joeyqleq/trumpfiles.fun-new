#!/usr/bin/env python3
"""Create an append-only editorial review ledger for the recovery proposal.

This intentionally never alters the recovered parent proposal.  It records one
review outcome per assigned parent and re-runs the recovery validator so import
staff can distinguish structurally valid proposal content from publication-ready
content.
"""
from __future__ import annotations

import json
import math
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent
RECOVERY = ROOT.parent / "web-trump-recovery-2026-10-07"
URL = re.compile(r"^https?://[^\s]+$", re.I)
WEIGHTS = {
    "harm": 0.30, "reach": 0.20, "institutions": 0.15,
    "procedural_abuse": 0.15, "self_dealing": 0.10, "persistence": 0.10,
}

# Narrow editorial repairs identified during the six fixed-group review.  These
# are proposals in the review ledger only; they do not rewrite recovered rows or
# canonical records.
AMENDMENTS = {
    "entry-5845": {
        "type": "survivor_merge_patch",
        "survivor_record_id": "entry-665",
        "instruction": "Correct the survivor to three provisional Ivanka Trump China approvals dated 2017-04-06; preserve CNN/AP URLs and do not infer causation from the dinner timing.",
    },
    "entry-6673": {
        "type": "copy_narrowing",
        "instruction": "Remove the unsupported $300 million revenue claim while retaining the sourced branded-Bible promotion account.",
    },
    "entry-6797": {
        "type": "copy_narrowing",
        "instruction": "Remove the unsupported independent-counsel repeal claim; retain the sourced agency-supervision/OIRA order.",
    },
    "entry-6955": {
        "type": "score_completion",
        "instruction": "Add the missing computed weighted_total 2.875 to the existing impact proposal, or explicitly preserve it as an unscored exception. Dimensions already calculate to 2.875.",
    },
}


def words(text):
    return len(re.findall(r"\S+", text or ""))


def walk(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk(child)


def content_checks(terminal):
    """Return detailed read-only checks against a proposed terminal record."""
    errors, card_count, source_count, score_count, computed_totals = [], 0, 0, 0, []
    for item in walk(terminal):
        fields = ("title", "description_short", "description_medium", "description_long")
        if all(isinstance(item.get(k), str) for k in fields):
            card_count += 1
            if len(item["title"]) > 180:
                errors.append("title exceeds 180 characters")
            if len(item["description_short"]) > 180:
                errors.append("short description exceeds 180 characters")
            if not 45 <= words(item["description_medium"]) <= 90:
                errors.append("medium description outside 45-90 words")
            if not 140 <= words(item["description_long"]) <= 300:
                errors.append("long description outside 140-300 words")
        for url in item.get("source_urls", []) if isinstance(item.get("source_urls"), list) else []:
            source_count += 1
            if not isinstance(url, str) or not URL.match(url):
                errors.append("invalid source URL")
        for fact in item.get("source_fact_map", []) if isinstance(item.get("source_fact_map"), list) else []:
            if isinstance(fact, dict) and isinstance(fact.get("quote"), str) and isinstance(fact.get("source_excerpt"), str):
                if fact["quote"] not in fact["source_excerpt"]:
                    errors.append("quoted source fact is not literal in its excerpt")
        score = item.get("impact_proposal")
        if isinstance(score, dict) and score.get("status") == "scored":
            score_count += 1
            dims = score.get("dimensions")
            if not isinstance(dims, dict) or set(dims) != set(WEIGHTS):
                errors.append("impact dimensions missing or incomplete")
            else:
                expected = sum(dims[k] * WEIGHTS[k] for k in WEIGHTS)
                computed_totals.append(round(expected, 3))
                stored = score.get("weighted_total")
                # The recovered schema permits an omitted stored total; in that
                # case the review records the independently recomputed value.
                if isinstance(stored, (int, float)) and not math.isclose(stored, expected, abs_tol=.011):
                    errors.append("impact weighted total does not match dimensions")
    return {"card_count": card_count, "source_url_count": source_count,
            "scored_impact_count": score_count, "computed_weighted_totals": computed_totals,
            "errors": sorted(set(errors))}


def review_outcome(terminal):
    status = terminal["status"]
    checks = content_checks(terminal)
    outcome = {
        "review_status": "retain_proposal",
        "publication_action": "not_applicable",
        "reason": "Existing proposal passed the independent structural/content recheck; no unsupported expansion was made.",
    }
    if status == "pass":
        outcome.update(publication_action="eligible_for_editorial_import_review")
    elif status == "draft_as_supplied":
        outcome.update(review_status="retain_unverified_draft", publication_action="do_not_import_or_publish",
                       reason="Supplied draft remains explicitly unverified and publication-ineligible; no focused evidence safely repairs it.")
    elif status == "hold":
        outcome.update(review_status="retain_hold", publication_action="do_not_import_or_publish",
                       reason="The saved evidence still has a material event, attribution, date, or source blocker.",
                       exact_blockers=terminal.get("blockers") or terminal.get("held_copy", {}).get("reason"))
    elif status == "exclusion_candidate":
        outcome.update(review_status="retain_exclusion_candidate", publication_action="exclude_pending_editorial_confirmation",
                       reason="Saved evidence contradicts or cannot identify the proposed event; no substitute was invented.",
                       exact_blockers=terminal.get("blockers"))
    elif status == "split_ready":
        outcome.update(review_status="retain_split_ready", publication_action="import_children_only_after_editorial_review",
                       reason="The parent is not a card; retained linked child proposals describe discrete events.",
                       child_record_ids=[c.get("record_id") for c in terminal.get("children", [])])
    elif status == "duplicate_resolved":
        outcome.update(review_status="retain_duplicate_mapping", publication_action="merge_only_after_counterpart_editorial_review",
                       reason="Mapping is preserved as a proposal. The canonical counterpart dataset is not present in this checkout, so no survivor wording was asserted as freshly verified.",
                       survivor_record_id=terminal.get("survivor_record_id"))
    outcome["content_recheck"] = checks
    if status == "split_ready":
        children = terminal.get("children")
        if not isinstance(children, list) or len(children) < 2:
            outcome["content_recheck"]["errors"].append("split has fewer than two children")
        else:
            bad_links = [c.get("record_id") for c in children if not isinstance(c, dict) or c.get("parent_record_id") != terminal["record_id"]]
            if bad_links:
                outcome["content_recheck"]["errors"].append("split child parent link mismatch: " + ", ".join(str(x) for x in bad_links))
    if status == "duplicate_resolved" and not terminal.get("survivor_record_id"):
        outcome["content_recheck"]["errors"].append("duplicate mapping lacks survivor ID")
    if terminal["record_id"] in AMENDMENTS:
        outcome["proposed_amendment"] = AMENDMENTS[terminal["record_id"]]
    return outcome


def main():
    assignments = json.loads((ROOT / "assignments.json").read_text())
    assigned = [rid for group in assignments["groups"] for rid in group["record_ids"]]
    rows = [json.loads(line) for line in (RECOVERY / "final-terminal-results.jsonl").read_text().splitlines() if line.strip()]
    by_id = {row["record_id"]: row for row in rows}
    errors = []
    if len(assigned) != 336 or len(set(assigned)) != 336:
        errors.append("assignment file does not contain 336 unique IDs")
    if set(assigned) != set(by_id):
        errors.append("review universe does not exactly match recovery universe")
    outcomes = []
    for index, rid in enumerate(assigned):
        wrapper = by_id.get(rid)
        if not wrapper:
            continue
        terminal = wrapper["terminal_record"]
        outcome = {"record_id": rid, "assignment_index": index,
                   "assigned_group": index // 56 + 1,
                   "source_recovery_path": str(RECOVERY.relative_to(ROOT.parent) / "final-terminal-results.jsonl"),
                   "source_terminal_status": terminal.get("status"),
                   "proposal_only": wrapper.get("proposal_only"),
                   "review": review_outcome(terminal)}
        outcomes.append(outcome)
        errors.extend({"record_id": rid, "error": err} for err in outcome["review"]["content_recheck"]["errors"])
    (ROOT / "review-terminal-results.jsonl").write_text("".join(json.dumps(row, separators=(",", ":")) + "\n" for row in outcomes))
    counts = Counter(row["source_terminal_status"] for row in outcomes)
    review_counts = Counter(row["review"]["review_status"] for row in outcomes)
    validation = {"reviewed_records": len(outcomes), "assigned_records": len(assigned),
                  "missing_ids": sorted(set(assigned) - {x["record_id"] for x in outcomes}),
                  "duplicate_ids": len(outcomes) - len({x["record_id"] for x in outcomes}),
                  "source_status_counts": dict(sorted(counts.items())),
                  "review_status_counts": dict(sorted(review_counts.items())),
                  "content_recheck_errors": errors,
                  "proposed_amendments": AMENDMENTS,
                  "checks": ["exact review universe", "one outcome per parent", "copy lengths", "source URL format", "literal quote excerpts", "impact arithmetic", "split child links retained", "duplicate mappings explicitly non-canonical"],
                  "counterpart_limit": "This checkout contains mapping evidence but not canonical survivor records; duplicate outcomes remain merge proposals pending canonical editorial review."}
    (ROOT / "review-validation.json").write_text(json.dumps(validation, indent=2) + "\n")
    summary = "# Trump Files recovery review — 2026-10-07\n\n"
    summary += "This append-only ledger independently rechecks every recovered parent without altering the recovery proposal, frozen export, canonical data, or Neon.\n\n"
    summary += f"- Parents reviewed: {len(outcomes)}/336\n"
    summary += f"- Source terminal statuses: `{dict(sorted(counts.items()))}`\n"
    summary += f"- Review outcomes: `{dict(sorted(review_counts.items()))}`\n"
    summary += f"- Content recheck errors: {len(errors)}\n"
    summary += "- Duplicate mappings remain merge-only because actual canonical survivor records are not present in this review checkout.\n"
    (ROOT / "REVIEW-SUMMARY.md").write_text(summary)
    print(json.dumps(validation, indent=2))


if __name__ == "__main__":
    main()
