#!/usr/bin/env python3
"""Build a physical, review-only ChatGPT Web packet from frozen project artifacts.

The packet includes 283 held dispositions and 84 fresh-candidate reviews. It
does not modify source artifacts, authorize inserts, contact a database, or
publish descriptions. All generated JSONL preserves the source records and
adds explicit context-only/readonly labels.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import tempfile
from collections import Counter
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[3]
WORKBENCH = ROOT / "data/neon-workbench"
EXT = WORKBENCH / "external/description-completion/2026-09-30"
RESCUE = EXT / "rescue-2026-10-02"
WAVE2 = RESCUE / "final-context-lightsprint/evidence-resolution-2026-10-03-wave2"
WEB80 = RESCUE / "final-context-web"
FRESH = RESCUE / "fresh-candidate-promotion"
DEFAULT_OUT = WORKBENCH / "external/web-release-review/2026-10-03"

SOURCES = {
    "held_dispositions": EXT / "held.jsonl",
    "dedupe_decisions": WORKBENCH / "patches/approved/dedupe_decisions.jsonl",
    "frozen_entries": ROOT / "data/neon-export/tables/trump_entries.jsonl",
    "frozen_sources": ROOT / "data/neon-export/tables/trump_sources.jsonl",
    "frozen_source_manifest": ROOT / "data/neon-export/manifest.json",
    "corpus_snapshot": WORKBENCH / "corpus/trumpstein-corpus.jsonl",
    "merged_descriptions": EXT / "merged/descriptions.jsonl",
    "correction_manifest": EXT / "correction-manifest/manifest.jsonl",
    "fresh_promotion_review": FRESH / "promotion-review.jsonl",
    "fresh_promotion_manifest": FRESH / "manifest.json",
    "light_wave2_manifest": WAVE2 / "manifest.json",
    "web80_manifest": WEB80 / "manifest.json",
    "pr47_web_proposals": EXT / "merged/descriptions-final-context-web-pr47-proposed.jsonl",
    "pr47_report": EXT / "editorial-repairs/report-pr47-abf8c473.json",
    "prior_web_proposals_a": ROOT / "web-rescue-import/proposals-68f0132e6d8cc1ec79243e6b43494c9d64221aa8d289266346de881d635bf870.jsonl",
    "prior_web_proposals_b": ROOT / "web-rescue-import/proposals-9ab2eca58a75ef8523d59192cc19fad53fcd7e58ade324acff6627db66d4eae6.jsonl",
}


class PacketError(ValueError):
    pass


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def jsonl(path: Path) -> list[dict[str, Any]]:
    result = []
    for line_no, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not raw.strip():
            continue
        try:
            row = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise PacketError(f"{path}:{line_no}: invalid JSON") from exc
        if not isinstance(row, dict):
            raise PacketError(f"{path}:{line_no}: expected object")
        result.append(row)
    return result


def write_jsonl(path: Path, rows: list[dict[str, Any]]) -> None:
    data = "".join(json.dumps(r, ensure_ascii=False, sort_keys=True) + "\n" for r in rows)
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temp_name = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(data)
            f.flush()
            os.fsync(f.fileno())
        os.replace(temp_name, path)
    finally:
        if os.path.exists(temp_name):
            os.unlink(temp_name)


def write_json(path: Path, value: Any) -> None:
    data = json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + "\n"
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temp_name = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(data)
            f.flush()
            os.fsync(f.fileno())
        os.replace(temp_name, path)
    finally:
        if os.path.exists(temp_name):
            os.unlink(temp_name)


def values_for_ids(rows: list[dict[str, Any]], ids: set[int], *, key: str = "entry_number") -> dict[int, dict[str, Any]]:
    found: dict[int, dict[str, Any]] = {}
    for row in rows:
        value = row.get(key)
        if isinstance(value, int) and not isinstance(value, bool) and value in ids:
            if value in found:
                raise PacketError(f"duplicate {key}={value} in frozen input")
            found[value] = row
    return found


def maybe_json(value: Any) -> Any:
    if isinstance(value, str):
        stripped = value.strip()
        if stripped.startswith(("{", "[")):
            try:
                return json.loads(stripped)
            except json.JSONDecodeError:
                return value
    return value


def row_mentions_ids(value: Any, ids: set[int]) -> bool:
    if isinstance(value, dict):
        for key, child in value.items():
            if key in {"entry_number", "canonical", "canonical_entry_number", "duplicate_entry_number"}:
                if isinstance(child, int) and child in ids:
                    return True
            if key in {"record_id", "canonical_record_id", "duplicate_record_id"} and isinstance(child, str):
                if child.startswith("entry-") and child[6:].isdigit() and int(child[6:]) in ids:
                    return True
            if row_mentions_ids(child, ids):
                return True
    elif isinstance(value, list):
        return any(row_mentions_ids(v, ids) for v in value)
    return False


def source_item(entry: dict[str, Any], description: dict[str, Any] | None,
                corpus: dict[str, Any] | None, relational: list[dict[str, Any]]) -> dict[str, Any]:
    evidence: list[dict[str, Any]] = []
    for source in maybe_json(entry.get("sources")) or []:
        if isinstance(source, dict):
            evidence.append({"layer": "frozen_entry_embedded_sources", **source})
    for source in relational:
        evidence.append({"layer": "frozen_trump_sources", **source})
    for source in (corpus or {}).get("sources") or []:
        if isinstance(source, dict):
            evidence.append({"layer": "offline_corpus_sources", **source})
    for url in (description or {}).get("source_urls") or []:
        evidence.append({"layer": "merged_description_source_url", "url": url})
    for url in (corpus or {}).get("source_urls") or []:
        evidence.append({"layer": "offline_corpus_source_url", "url": url})
    for url in maybe_json(entry.get("fact_check_sources")) or []:
        evidence.append({"layer": "frozen_fact_check_source_url", "url": url})
    deduped = []
    seen = set()
    for item in evidence:
        key = json.dumps(item, sort_keys=True, ensure_ascii=False)
        if key not in seen:
            seen.add(key)
            deduped.append(item)
    return {
        "entry_number": entry.get("entry_number"),
        "title": entry.get("title"),
        "evidence": deduped,
        "frozen_fact_check_text": entry.get("fact_check"),
        "held_claim_evidence": [],
        "merged_description_notes": (description or {}).get("notes", []),
        "corpus_provenance": (corpus or {}).get("provenance"),
        "corpus_snapshot_date": "2026-09-24 offline corpus snapshot",
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    args = parser.parse_args(argv)
    out = args.out.resolve()
    try:
        missing = [str(p) for p in SOURCES.values() if not p.is_file()]
        if missing:
            raise PacketError("required source artifacts missing: " + ", ".join(missing))
        if out.exists() and any(out.iterdir()):
            prior_manifest = out / "manifest.json"
            if not prior_manifest.is_file() or json.loads(prior_manifest.read_text(encoding="utf-8")).get("packet_version") != 1:
                raise PacketError(f"refusing to overwrite non-generated packet directory: {out}")

        held = jsonl(SOURCES["held_dispositions"])
        if len(held) != 283:
            raise PacketError(f"held source expected 283 rows, found {len(held)}")
        held_by_id = {r.get("entry_number"): r for r in held}
        if len(held_by_id) != len(held) or any(not isinstance(k, int) for k in held_by_id):
            raise PacketError("held entry_number values must be unique integers")
        counts = Counter(r.get("reason") for r in held)
        expected = {"split_required": 32, "soft_hide_candidate": 111,
                    "approved duplicate": 59, "still_unresolved": 81}
        if dict(counts) != expected:
            raise PacketError(f"held disposition breakdown drift: {dict(counts)}")

        decisions = {r.get("entry_number"): r for r in jsonl(SOURCES["dedupe_decisions"])}
        duplicate_held = [r for r in held if r["reason"] == "approved duplicate"]
        if any(r["entry_number"] not in decisions for r in duplicate_held):
            raise PacketError("one or more held duplicate records lack a dedupe decision")
        if any(not isinstance(decisions[r["entry_number"]].get("canonical"), int) for r in duplicate_held):
            raise PacketError("duplicate decision lacks a canonical entry number")

        wave = json.loads(SOURCES["light_wave2_manifest"].read_text(encoding="utf-8"))
        light_ids = {int(rid.removeprefix("entry-")) for owner in wave["owners"] for rid in owner["record_ids"]}
        if len(light_ids) != 311 or wave.get("eligible_unfinished_count") != 311:
            raise PacketError(f"Light wave-2 set expected 311 unique IDs, found {len(light_ids)}")
        web_manifest = json.loads(SOURCES["web80_manifest"].read_text(encoding="utf-8"))
        web_ids = {int(rid.removeprefix("entry-")) for rid in web_manifest["record_ids"]}
        if len(web_ids) != 80 or web_manifest.get("assigned_count") != 80:
            raise PacketError(f"reserved Web assignment expected 80 unique IDs, found {len(web_ids)}")
        held_ids = set(held_by_id)
        held_light = held_ids & light_ids
        held_web = held_ids & web_ids
        if held_light or held_web:
            raise PacketError(f"held primary targets overlap active assignments: Light={sorted(held_light)}, Web={sorted(held_web)}")

        fresh = jsonl(SOURCES["fresh_promotion_review"])
        promotion_manifest = json.loads(SOURCES["fresh_promotion_manifest"].read_text(encoding="utf-8"))
        if len(fresh) != 84 or promotion_manifest.get("candidate_count") != 84:
            raise PacketError(f"fresh review expected 84 rows, found {len(fresh)}")
        if len({r.get("new_key") for r in fresh}) != 84 or any(not isinstance(r.get("new_key"), str) for r in fresh):
            raise PacketError("fresh candidates require 84 unique new_key identities")
        if any(r.get("entry_number") is not None or r.get("insert_authorized") is not False for r in fresh):
            raise PacketError("fresh candidates must remain unmapped and unauthorized for insertion")
        if any(r.get("record_id") in {f"entry-{n}" for n in held_ids | light_ids | web_ids} for r in fresh):
            raise PacketError("fresh candidate key collides with an existing primary entry ID")
        fresh_light_context = sorted({n for r in fresh for n in ((r.get("source_event") or {}).get("related_entry_numbers") or []) if n in light_ids})
        fresh_web_context = sorted({n for r in fresh for n in ((r.get("source_event") or {}).get("related_entry_numbers") or []) if n in web_ids})

        pr47_report = json.loads(SOURCES["pr47_report"].read_text(encoding="utf-8"))
        if pr47_report.get("status") != "PROPOSED_NOT_APPROVED" or pr47_report.get("head") != "abf8c473db2998e37368966811ec4cf0274088e9" or pr47_report.get("source_validation", {}).get("assigned_count") != 58:
            raise PacketError("PR47 proposal source is not the expected 58-row unapproved snapshot")
        pr47_rows = [r for r in jsonl(SOURCES["pr47_web_proposals"])
                     if (r.get("editorial_correction_provenance") or {}).get("pr") == 47
                     and (r.get("editorial_correction_provenance") or {}).get("head") == pr47_report["head"]]
        if len(pr47_rows) != 58:
            raise PacketError(f"expected 58 PR47 Web corrections, found {len(pr47_rows)}")
        pr47_ids = {r.get("entry_number") for r in pr47_rows}
        if len(pr47_ids) != 58:
            raise PacketError("PR47 correction entry IDs must be unique")

        all_relevant_ids = held_ids | {decisions[r["entry_number"]]["canonical"] for r in duplicate_held} | pr47_ids | web_ids
        frozen = {r["entry_number"]: r for r in jsonl(SOURCES["frozen_entries"])
                  if r.get("entry_number") in all_relevant_ids}
        if not held_ids <= frozen.keys():
            raise PacketError(f"frozen export missing held originals: {sorted(held_ids - frozen.keys())}")
        sources_by_id: dict[int, list[dict[str, Any]]] = {}
        for row in jsonl(SOURCES["frozen_sources"]):
            if row.get("entry_number") in all_relevant_ids:
                sources_by_id.setdefault(row["entry_number"], []).append(row)
        corpus = {r["entry_number"]: r for r in jsonl(SOURCES["corpus_snapshot"])
                  if r.get("entry_number") in all_relevant_ids}
        descriptions = {r["entry_number"]: r for r in jsonl(SOURCES["merged_descriptions"])
                       if r.get("entry_number") in all_relevant_ids}

        held_packet = []
        for row in held:
            number = row["entry_number"]
            original = frozen[number]
            description = descriptions.get(number)
            sources = source_item(original, description, corpus.get(number), sources_by_id.get(number, []))
            proposal = row.get("proposal") or {}
            sources["held_claim_evidence"] = [
                {"claim": c.get("claim"), "support_level": c.get("support_level"),
                 "source_urls": c.get("source_urls", []), "notes": c.get("notes")}
                for c in proposal.get("claims", []) if isinstance(c, dict)
            ]
            held_packet.append({
                "scope": "held_disposition_review_only",
                "record_id": row["record_id"],
                "entry_number": number,
                "disposition_group": row["reason"],
                "readonly_proposal": True,
                "insert_authorized": False,
                "live_db_write": False,
                "held_manifest_row": row,
                "frozen_original_record": original,
                "current_description_snapshot": description,
                "offline_corpus_snapshot": corpus.get(number),
                "source_evidence": sources,
            })

        duplicate_pairs = []
        canonical_ids = set()
        for row in duplicate_held:
            number = row["entry_number"]
            decision = decisions[number]
            canonical = decision["canonical"]
            canonical_ids.add(canonical)
            if canonical not in frozen:
                raise PacketError(f"duplicate canonical {canonical} missing from frozen export")
            duplicate_pairs.append({
                "scope": "duplicate_counterpart_fulltext_review_only",
                "held_duplicate_entry_number": number,
                "canonical_counterpart_entry_number": canonical,
                "canonical_is_active_light_wave2_context": canonical in light_ids,
                "canonical_is_active_web80_context": canonical in web_ids,
                "do_not_edit_counterpart": True,
                "readonly_proposal": True,
                "dedupe_decision": decision,
                "duplicate_fulltext": {
                    "frozen_original_record": frozen[number],
                    "merged_description_snapshot": descriptions.get(number),
                    "offline_corpus_snapshot": corpus.get(number),
                },
                "canonical_counterpart_fulltext": {
                    "frozen_original_record": frozen[canonical],
                    "merged_description_snapshot": descriptions.get(canonical),
                    "offline_corpus_snapshot": corpus.get(canonical),
                },
                "duplicate_source_evidence": source_item(frozen[number], descriptions.get(number), corpus.get(number), sources_by_id.get(number, [])),
                "canonical_source_evidence": source_item(frozen[canonical], descriptions.get(canonical), corpus.get(canonical), sources_by_id.get(canonical, [])),
            })

        correction_rows = []
        correction_match_ids = held_ids | canonical_ids
        for label in ("correction_manifest", "prior_web_proposals_a", "prior_web_proposals_b"):
            for row in jsonl(SOURCES[label]):
                if row_mentions_ids(row, correction_match_ids):
                    correction_rows.append({"source_artifact": label, "historical_context_only": True,
                                            "readonly_proposal": True, "record": row})

        evidence_rows = []
        for number in sorted(all_relevant_ids):
            item = source_item(frozen[number], descriptions.get(number), corpus.get(number), sources_by_id.get(number, []))
            for held_row in held:
                if held_row["entry_number"] == number:
                    proposal = held_row.get("proposal") or {}
                    item["held_claim_evidence"] = [
                        {"claim": c.get("claim"), "support_level": c.get("support_level"),
                         "source_urls": c.get("source_urls", []), "notes": c.get("notes")}
                        for c in proposal.get("claims", []) if isinstance(c, dict)
                    ]
            evidence_rows.append(item)

        fresh_packet = []
        for row in fresh:
            source_event = row.get("source_event") or {}
            related = sorted(set((source_event.get("related_entry_numbers") or []) +
                                 (source_event.get("possible_duplicate_entry_numbers") or []) +
                                 (row.get("possible_duplicate_entry_numbers_from_source_review") or [])))
            fresh_packet.append({
                "scope": "fresh_candidate_independent_qa_only",
                "record_id": row["record_id"],
                "candidate_key": row["new_key"],
                "entry_number": None,
                "insert_authorized": False,
                "readonly_proposal": True,
                "do_not_rewrite_existing_entry_ids": True,
                "source_event_context_entry_numbers": related,
                "active_light_wave2_context_only": sorted(set(related) & light_ids),
                "reserved_web80_context_only": sorted(set(related) & web_ids),
                "promotion_review_record": row,
            })

        pr47_packet = [{
            "scope": "pr47_proposal_independent_review_only",
            "review_key": f"pr47-review-entry-{row['entry_number']}",
            "record_id": row.get("record_id"),
            "entry_number": row.get("entry_number"),
            "proposal_status": "PROPOSED_NOT_APPROVED",
            "pr47_head": pr47_report["head"],
            "original_record": frozen.get(row.get("entry_number")),
            "proposed_correction": row,
            "readonly_proposal": True,
            "do_not_edit_pr47_overlay": True,
        } for row in pr47_rows]
        web80_context = [{
            "scope": "reserved_web80_original_fullfacts_context_only",
            "record_id": f"entry-{number}",
            "entry_number": number,
            "frozen_original_record": frozen[number],
            "current_merged_description_snapshot": descriptions.get(number),
            "offline_corpus_snapshot": corpus.get(number),
            "source_evidence": source_item(frozen[number], descriptions.get(number), corpus.get(number), sources_by_id.get(number, [])),
            "do_not_reassign_or_edit": True,
        } for number in sorted(web_ids) if number in frozen]
        if len(web80_context) != 80:
            # Fill the context snapshot from the frozen tables independently of held/canonical subset.
            web_frozen = values_for_ids(jsonl(SOURCES["frozen_entries"]), web_ids)
            web_sources: dict[int, list[dict[str, Any]]] = {}
            for source in jsonl(SOURCES["frozen_sources"]):
                if source.get("entry_number") in web_ids:
                    web_sources.setdefault(source["entry_number"], []).append(source)
            web_corpus = values_for_ids(jsonl(SOURCES["corpus_snapshot"]), web_ids)
            web_descriptions = values_for_ids(jsonl(SOURCES["merged_descriptions"]), web_ids)
            if len(web_frozen) != 80:
                raise PacketError("frozen export does not contain all 80 reserved Web originals")
            web80_context = [{
                "scope": "reserved_web80_original_fullfacts_context_only",
                "record_id": f"entry-{number}", "entry_number": number,
                "frozen_original_record": web_frozen[number],
                "current_merged_description_snapshot": web_descriptions.get(number),
                "offline_corpus_snapshot": web_corpus.get(number),
                "source_evidence": source_item(web_frozen[number], web_descriptions.get(number), web_corpus.get(number), web_sources.get(number, [])),
                "do_not_reassign_or_edit": True,
            } for number in sorted(web_ids)]

        exclusions = {
            "purpose": "primary-record exclusion fence; listed existing entry IDs are context only",
            "light_wave2_source_sha256": sha256(SOURCES["light_wave2_manifest"]),
            "light_wave2_primary_entry_ids": [f"entry-{n}" for n in sorted(light_ids)],
            "reserved_web80_source_sha256": sha256(SOURCES["web80_manifest"]),
            "reserved_web80_primary_entry_ids": [f"entry-{n}" for n in sorted(web_ids)],
            "held_primary_entry_ids": [f"entry-{n}" for n in sorted(held_ids)],
            "held_vs_light_wave2_overlap": sorted(held_ids & light_ids),
            "held_vs_reserved_web80_overlap": sorted(held_ids & web_ids),
            "duplicate_canonical_context_only_entry_ids_overlapping_light_wave2": [f"entry-{n}" for n in sorted(canonical_ids & light_ids)],
            "fresh_candidate_related_light_context_only": [f"entry-{n}" for n in fresh_light_context],
            "fresh_candidate_related_reserved_web80_context_only": [f"entry-{n}" for n in fresh_web_context],
            "no_existing_entry_id_writes": True,
        }

        out.mkdir(parents=True, exist_ok=True)
        write_jsonl(out / "held-dispositions.jsonl", held_packet)
        write_jsonl(out / "duplicate-counterpart-fulltext.jsonl", duplicate_pairs)
        write_jsonl(out / "source-evidence.jsonl", evidence_rows)
        write_jsonl(out / "existing-corrections-context.jsonl", correction_rows)
        write_jsonl(out / "fresh84-review-only.jsonl", fresh_packet)
        write_jsonl(out / "pr47-proposed-corrections-review-only.jsonl", pr47_packet)
        write_jsonl(out / "web80-original-fullfacts-context-only.jsonl", web80_context)
        write_json(out / "active-assignment-exclusions.json", exclusions)

        input_manifest = []
        for label, path in SOURCES.items():
            item = {"label": label, "path": str(path.relative_to(ROOT)), "bytes": path.stat().st_size,
                    "sha256": sha256(path)}
            if path.suffix == ".jsonl":
                item["rows"] = len(jsonl(path))
            input_manifest.append(item)
        packet_files = [p for p in sorted(out.iterdir()) if p.is_file()]
        summary = {
            "packet_version": 1,
            "created_for": "ChatGPT Web user-requested offline review only",
            "source_snapshot": "frozen export dated 2026-09-23 plus named description/promotion artifacts",
            "counts": {
                "held_dispositions": len(held_packet),
                "held_by_reason": dict(sorted(counts.items())),
                "duplicate_pairs_with_both_frozen_records": len(duplicate_pairs),
                "duplicate_pairs_with_counterpart_description_snapshot": sum(bool(x["canonical_counterpart_fulltext"]["merged_description_snapshot"]) for x in duplicate_pairs),
                "duplicate_pairs_with_any_frozen_source_metadata": sum(bool(x["duplicate_source_evidence"]["evidence"] or x["canonical_source_evidence"]["evidence"]) for x in duplicate_pairs),
                "distinct_duplicate_canonical_ids": len(canonical_ids),
                "duplicate_canonical_entry_ids_in_light_wave2_context": [f"entry-{n}" for n in sorted(canonical_ids & light_ids)],
                "existing_correction_context_rows": len(correction_rows),
                "fresh_candidates": len(fresh_packet),
                "pr47_proposed_corrections_review_only": len(pr47_packet),
                "web80_original_records_context_only": len(web80_context),
                "assigned_review_rows_total": len(held_packet) + len(fresh_packet) + len(pr47_packet),
                "pr47_shared_event_warning": pr47_report.get("warning"),
                "fresh_complete_for_human_insert_review_status_only": sum(x["promotion_review_record"].get("promotion_status") == "complete_for_human_insert_review" for x in fresh_packet),
                "fresh_needs_review_status_only": sum(x["promotion_review_record"].get("promotion_status") == "needs_review" for x in fresh_packet),
                "fresh_candidate_primary_id_overlap": 0,
                "held_vs_light_wave2_overlap": len(held_light),
                "held_vs_reserved_web80_overlap": len(held_web),
                "duplicate_canonical_ids_in_light_wave2_context": len(canonical_ids & light_ids),
                "fresh_related_light_context_ids": fresh_light_context,
                "fresh_related_web80_context_ids": fresh_web_context,
            },
            "gates": {
                "review_only": True,
                "database_access_or_writes": False,
                "insert_authorized": False,
                "soft_hide_or_delete_authorized": False,
                "split_records_created": False,
                "held_and_active_primary_assignments_disjoint": not held_light and not held_web,
                "fresh_namespace_separate": True,
                "active_light_and_web_ids_are_context_only": True,
                "source_text_not_present_in_offline_inputs_must_be_researched_or_left_unresolved": True,
            },
            "inputs": input_manifest,
            "packet_files": [{"path": p.name, "bytes": p.stat().st_size, "sha256": sha256(p)} for p in packet_files],
        }
        write_json(out / "manifest.json", summary)
        (out / "PROMPT.md").write_text(build_prompt(summary), encoding="utf-8")
        print(json.dumps({"output": str(out), "counts": summary["counts"],
                          "manifest_sha256": sha256(out / "manifest.json"),
                          "prompt_sha256": sha256(out / "PROMPT.md")}, sort_keys=True))
        return 0
    except (PacketError, OSError, KeyError, TypeError, json.JSONDecodeError) as exc:
        print(f"error: {exc}")
        return 2


def build_prompt(manifest: dict[str, Any]) -> str:
    counts = manifest["counts"]
    return f'''# ChatGPT Web review assignment — 2026-10-03

You are assigned an offline evidence and disposition review packet. Work only from these packet files and any focused public-source research needed to resolve a specific claim. Do not access Neon or another database. Do not write to any database, merge, deploy, or modify the frozen source artifacts.

## Exact workload

- Review {counts['held_dispositions']} held dispositions: 32 split-required, 111 soft-hide candidates, 59 approved-duplicate candidates, and 81 unresolved.
- Independently review 84 fresh candidates in their separate `fresh-*` / `expanded-*` key namespace. Their status is a proposal for human review only; `insert_authorized` is false for all rows.
- Independently review 58 PR47 correction proposals under `pr47-review-entry-*` keys (425 total assigned rows across held, fresh, and PR47). These are all `PROPOSED_NOT_APPROVED` from PR head `abf8c473db2998e37368966811ec4cf0274088e9`; review must not edit or approve that overlay.
- Use the original full facts for the reserved 80-record Web assignment as context only; these 80 are not assigned again.
- Held IDs are checked disjoint from the active 311 Light wave-2 IDs and the separately reserved 80-record Web assignment. The exact protected IDs are in `active-assignment-exclusions.json`.

## Review rules

1. Preserve the original row and its claim as provided. Produce append-only review proposals with cited support, access notes, factual scope, and remaining uncertainty. Do not edit the source packet, ordinary records, PR47 overlay, owner branches, or index/database values.
2. For the 32 split proposals, recommend a split only where each event has independently supported facts and dates. Give proposed components as review proposals; never invent survivors or create entries.
3. For the 111 soft-hide candidates, assess whether a supportable discrete event remains and whether the proposed soft-hide rationale is justified. Do not claim a soft hide was applied.
4. For the 59 duplicate candidates, inspect both complete frozen entry records and the supplied counterpart description/corpus text in `duplicate-counterpart-fulltext.jsonl`, plus the frozen source metadata in `source-evidence.jsonl`. A title match alone is insufficient. State which event evidence matches or differs. Canonical records are context only; these canonical IDs also belong to the active Light wave-2 assignment: {', '.join(counts['duplicate_canonical_entry_ids_in_light_wave2_context']) or 'none'}.
5. For the 81 unresolved items, perform narrow, credible-source research when possible. If supplied and public evidence does not resolve the claim, retain an explicit unresolved outcome. Never fill gaps with inference or invented survivors.
6. Independently audit each of the 84 fresh candidate records for event identity, source support, description quality/length, possible duplicates, and impact-v2 support. Keep each under its exact `candidate_key`; never assign or rewrite an existing `entry-*` ID. Existing Light wave-2 and Web80 IDs referenced in fresh candidate context are context only and must not be edited.
7. Source URLs are leads, not proof. Distinguish primary source text from headlines, filed company statements from independent confirmation, and direct support from contextual mention. If full source text is absent or inaccessible, record that limitation rather than claiming it was read.
8. For PR47 rows, classify whether the source describes a discrete event or only a generic tracker/theme. Analyze shared-event relationships with real identity evidence; consolidate only where event identity is demonstrated. Do not force merges merely because topics, people, or URLs overlap. The PR47 report warns that shared events should be consolidated before canonical acceptance.
9. Return one JSONL review row per assigned source row, preserving `record_id`/`entry_number` for held rows, `candidate_key` for fresh rows, and `review_key` for PR47 rows. Include `review_status`, `recommended_disposition`, `supported_facts`, `contradicted_or_unsupported_claims`, `sources_consulted`, `source_access_notes`, `counterpart_comparison` when relevant, event-vs-tracker classification, evidence-based related-event groups (or none), and `remaining_gap`. Every output is a proposal for separate human review only.

## Packet files

- `held-dispositions.jsonl`: source held manifest rows joined to the full frozen original record, current merged description snapshot where present, corpus snapshot, and claim-level cited leads.
- `duplicate-counterpart-fulltext.jsonl`: all 59 duplicate/canonical pairs with both full frozen rows, available full description/corpus text, dedupe decisions, and sources. Missing text/source coverage is explicit; do not invent it.
- `source-evidence.jsonl`: frozen source rows, embedded source fields, cached description/corpus source metadata, and held claim-level evidence.
- `existing-corrections-context.jsonl`: only matching historical correction/proposal rows, labeled context-only.
- `fresh84-review-only.jsonl`: the 84 separate candidate records and exact promotion review state.
- `pr47-proposed-corrections-review-only.jsonl`: 58 unapproved proposed corrections with original facts and PR-head provenance, on separate review keys.
- `web80-original-fullfacts-context-only.jsonl`: frozen original records and available full description/source context for the reserved 80; context-only, not reassigned.
- `active-assignment-exclusions.json`: authoritative active Light and Web ID fences and computed overlap assertions.
- `manifest.json`: input/output SHA-256 values and exact row counts.

The `complete_for_human_insert_review` label in the fresh manifest is a structural workflow state, not fact approval or insert authorization. No proposal from this assignment is production-ready until separate human review and fresh release gates.
'''


if __name__ == "__main__":
    raise SystemExit(main())
