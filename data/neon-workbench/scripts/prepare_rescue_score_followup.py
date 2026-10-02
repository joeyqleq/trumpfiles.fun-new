#!/usr/bin/env python3
"""Prepare deterministic, offline score follow-up packets for deferred IDs only."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
BATCH = ROOT / "data/neon-workbench/external/description-completion/2026-09-30"
FINISH = BATCH / "finish-2026-10-01"
OUTPUT = BATCH / "rescue-2026-10-02/score-followup"
SCORES = FINISH / "merged-impact/scores.jsonl"
MERGED = BATCH / "merged/descriptions.jsonl"
WEB_REPORT = ROOT / "web-rescue-import/report-68f0132e6d8cc1ec79243e6b43494c9d64221aa8d289266346de881d635bf870.json"
WEB_PROPOSALS = ROOT / "web-rescue-import/proposals-68f0132e6d8cc1ec79243e6b43494c9d64221aa8d289266346de881d635bf870.jsonl"
RUBRIC = FINISH / "RUBRIC.md"
DIMENSIONS = ("harm", "reach", "institutions", "procedural_abuse", "self_dealing", "persistence")
OWNERS = 12
LANE = "rescue-2026-10-02/score-followup"


class PacketError(Exception):
    pass


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def read_jsonl(path: Path):
    rows = []
    for line_no, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            value = json.loads(line)
        except json.JSONDecodeError as exc:
            raise PacketError(f"{path}:{line_no}: invalid JSON") from exc
        if not isinstance(value, dict):
            raise PacketError(f"{path}:{line_no}: expected object")
        rows.append(value)
    return rows


def load_deferred(scores_path: Path, held_path: Path):
    scores = read_jsonl(scores_path)
    if len({r.get("record_id") for r in scores}) != len(scores):
        raise PacketError("current impact scores contain duplicate IDs")
    held = {r.get("record_id") for r in read_jsonl(held_path)}
    deferred = {}
    for row in scores:
        if row.get("version") != "impact-v2":
            continue
        if row.get("status") == "scored":
            continue
        if row.get("status") != "deferred" or row.get("dimensions") is not None:
            raise PacketError(f"unexpected current score state for {row.get('record_id')!r}")
        rid = row.get("record_id")
        if rid in held:
            raise PacketError(f"held ID is also in current deferred score set: {rid}")
        deferred[rid] = row
    return deferred


def load_original_packets(root: Path):
    packets = {}
    for worker in range(1, OWNERS + 1):
        path = root / f"worker-{worker:02d}-score-input.jsonl"
        for row in read_jsonl(path):
            rid = row.get("record_id")
            if not isinstance(rid, str) or rid in packets:
                raise PacketError(f"missing or duplicate original score packet ID: {rid!r}")
            packets[rid] = (worker, row)
    return packets


def load_validated_repairs(report_path: Path, proposals_path: Path, merged_path: Path):
    report = json.loads(report_path.read_text(encoding="utf-8"))
    if report.get("counts", {}).get("integration_ready_repairs") != 354:
        raise PacketError("validated web repair report is not the expected 354-row snapshot")
    # The validated repair batch may predate metadata-only overlay changes. Keep
    # that provenance explicit and attach current descriptive facts separately.
    rows = read_jsonl(proposals_path)
    if len(rows) != 354 or len({r.get("record_id") for r in rows}) != len(rows):
        raise PacketError("validated web repair proposal set must have 354 unique rows")
    canonical = "\n".join(json.dumps(r, sort_keys=True, ensure_ascii=False) for r in rows).encode()
    if digest(canonical) != report.get("proposal_sha256"):
        raise PacketError("validated web repair proposal hash mismatch")
    if set(report.get("integration_ready_ids", [])) != {r["record_id"] for r in rows}:
        raise PacketError("validated web repair IDs disagree with report")
    for row in rows:
        if row.get("status") != "repaired" or not isinstance(row.get("patch"), dict):
            raise PacketError(f"web repair row is not a validated repair: {row.get('record_id')}")
    report = dict(report)
    report["packet_current_merged_sha256"] = digest(merged_path.read_bytes())
    report["validated_against_current_merged_snapshot"] = (
        report.get("inputs", {}).get("current_merged_sha256") == report["packet_current_merged_sha256"]
    )
    return {row["record_id"]: row for row in rows}, report


def descriptive_facts(row):
    fields = ("title", "description_short", "description_medium", "description_long",
              "category", "subcategory", "topic_tags", "people_tags", "organization_tags",
              "source_urls", "notes")
    return {field: row.get(field) for field in fields if field in row}


def build_packets(scores_path=SCORES, held_path=FINISH / "held-score-dispositions.jsonl",
                  original_root=FINISH, merged_path=MERGED, report_path=WEB_REPORT,
                  proposals_path=WEB_PROPOSALS):
    deferred = load_deferred(scores_path, held_path)
    originals = load_original_packets(original_root)
    current_rows = read_jsonl(merged_path)
    current = {row.get("record_id"): row for row in current_rows}
    if len(current) != len(current_rows):
        raise PacketError("merged current descriptions contain duplicate IDs")
    repairs, report = load_validated_repairs(report_path, proposals_path, merged_path)
    if not set(deferred) <= set(originals):
        raise PacketError("one or more deferred IDs lack an original score packet")
    packets = []
    for rid in sorted(deferred):
        score = deferred[rid]
        owner, original = originals[rid]
        number = score.get("entry_number")
        if number != original.get("entry_number"):
            raise PacketError(f"{rid}: score identity differs from original packet")
        description = current.get(rid)
        if description is None or description.get("entry_number") != number:
            raise PacketError(f"{rid}: current descriptive facts missing or mismatched")
        packet = {
            "record_id": rid,
            "entry_number": number,
            "version": "impact-v2",
            "original_owner": owner,
            "prior_status": "deferred",
            "deferred_reason": score.get("reason"),
            "deferred_notes": score.get("notes"),
            "original_packet": original,
            "current_descriptive_facts": descriptive_facts(description),
            "validated_web_repair": None,
        }
        if rid in repairs:
            proposal = repairs[rid]
            if proposal.get("entry_number") != number:
                raise PacketError(f"{rid}: validated web repair identity mismatch")
            packet["validated_web_repair"] = {
                "patch": proposal["patch"],
                "source_urls_before": proposal.get("source_urls_before"),
                "source_urls_after": proposal.get("source_urls_after"),
                "source_urls_preserved": proposal.get("source_urls_preserved"),
                "proposal_sha256": report["proposal_sha256"],
                "proposal_source": proposal.get("proposal_source"),
                "source_ref": proposal.get("source_ref"),
                "source_commit": proposal.get("source_commit"),
            }
        packets.append(packet)
    if len(packets) != 677:
        raise PacketError(f"expected 677 deferred packets, found {len(packets)}")
    return packets, report


def canonical_line(row):
    return (json.dumps(row, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n").encode()


def make_artifacts(packets, report, scores_path=SCORES, merged_path=MERGED,
                   held_path=FINISH / "held-score-dispositions.jsonl",
                   rubric_path=RUBRIC, report_path=WEB_REPORT,
                   proposals_path=WEB_PROPOSALS, original_root=FINISH):
    groups = {i: packets[i::OWNERS] for i in range(OWNERS)}
    expected_sizes = [57] * (len(packets) % OWNERS) + [len(packets) // OWNERS] * (OWNERS - len(packets) % OWNERS)
    if [len(groups[i]) for i in range(OWNERS)] != expected_sizes:
        raise PacketError("round-robin owner groups have unexpected sizes")
    artifacts = {}
    for i, rows in groups.items():
        artifacts[f"worker-{i+1:02d}-score-input.jsonl"] = b"".join(canonical_line(row) for row in rows)
        original_input = original_root / f"worker-{i+1:02d}-score-input.jsonl"
        artifacts[f"original-score-inputs/worker-{i+1:02d}-score-input.jsonl"] = original_input.read_bytes()
    rubric_bytes = rubric_path.read_bytes()
    artifacts["RUBRIC.md"] = rubric_bytes
    prompt = (
        "Score exactly the deferred records in this packet using RUBRIC.md. This is model scoring only: "
        "use only original_packet, current_descriptive_facts, and any validated_web_repair included in that row. "
        "Do not use web, search, tools, or external evidence. The web repair is a validated supplied proposal, "
        "not permission to infer facts beyond its text. Do not manufacture event facts or treat proposed/threatened "
        "actions as completed. Do not rescore existing scored or held IDs. For every row emit exactly the rubric "
        "schema: record_id, entry_number, version=impact-v2, status, dimensions, event_state, confidence, "
        "confidence_reason, rationale, basis, notes. Scored rows require exactly six dimensions: harm, reach, "
        "institutions, procedural_abuse, self_dealing, persistence (0-10, 0.1 steps). If evidence remains "
        "insufficient or contradictory, leave status=deferred and dimensions=null with a precise reason. "
        "No composite score. Preserve the assigned IDs and entry numbers.\n"
    ).encode()
    artifacts["PROMPT.md"] = prompt
    manifest_owners = []
    for i, rows in groups.items():
        name = f"worker-{i+1:02d}-score-input.jsonl"
        manifest_owners.append({"worker": i+1, "packet_file": name,
                                "record_ids": [row["record_id"] for row in rows],
                                "record_count": len(rows), "packet_sha256": digest(artifacts[name])})
    manifest = {
        "lane": LANE,
        "version": "impact-v2",
        "mode": "deterministic_deferred_score_followup",
        "total_deferred_ids": len(packets),
        "explicit_record_ids": [row["record_id"] for row in packets],
        "existing_scored_ids_rescored": 0,
        "held_ids_included": 0,
        "validated_web_repair_source": report["proposal_sha256"],
        "validated_web_repair_rows": 354,
        "web_repairs_validated_against_current_description_snapshot": report["validated_against_current_merged_snapshot"],
        "web_repair_validation_snapshot_sha256": report["inputs"]["current_merged_sha256"],
        "current_description_snapshot_sha256": report["packet_current_merged_sha256"],
        "deferred_ids_with_web_repair": sum(row["validated_web_repair"] is not None for row in packets),
        "input_hashes": {
            "current_scores_sha256": digest(scores_path.read_bytes()),
            "current_descriptions_sha256": digest(merged_path.read_bytes()),
            "held_dispositions_sha256": digest(held_path.read_bytes()),
            "rubric_sha256": digest(rubric_bytes),
            "web_report_sha256": digest(report_path.read_bytes()),
            "web_proposals_sha256": digest(proposals_path.read_bytes()),
            "original_score_inputs_sha256": {
                f"worker-{i:02d}": digest((original_root / f"worker-{i:02d}-score-input.jsonl").read_bytes())
                for i in range(1, OWNERS + 1)
            },
        },
        "ownership_rule": "sort deferred record_id ascending; owner=(zero_based_index mod 12)+1",
        "owners": manifest_owners,
        "constraints": ["model scoring only; no web research", "unsupported records may remain deferred",
                        "only current deferred IDs assigned", "no held or already scored IDs",
                        "no worker launches performed"],
    }
    artifacts["assignment-manifest.json"] = (json.dumps(manifest, ensure_ascii=False, indent=2) + "\n").encode()
    return artifacts, manifest


def write_once(directory: Path, artifacts: dict[str, bytes]):
    directory.mkdir(parents=True, exist_ok=True)
    for name, content in artifacts.items():
        path = directory / name
        path.parent.mkdir(parents=True, exist_ok=True)
        if path.exists():
            if path.read_bytes() != content:
                raise PacketError(f"refusing to overwrite different frozen packet artifact: {path}")
            continue
        fd, temp_name = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent)
        try:
            with os.fdopen(fd, "wb") as stream:
                stream.write(content)
                stream.flush()
                os.fsync(stream.fileno())
            try:
                os.link(temp_name, path)
            except FileExistsError:
                if path.read_bytes() != content:
                    raise PacketError(f"conflicting packet artifact appeared: {path}")
        finally:
            if os.path.exists(temp_name):
                os.unlink(temp_name)


def run(output=OUTPUT):
    packets, report = build_packets()
    artifacts, manifest = make_artifacts(packets, report)
    write_once(output, artifacts)
    return manifest


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=OUTPUT)
    args = parser.parse_args(argv)
    try:
        manifest = run(args.output)
        print(json.dumps({"lane": manifest["lane"], "deferred": manifest["total_deferred_ids"],
                          "repair_overlap": manifest["deferred_ids_with_web_repair"],
                          "owners": [{"worker": row["worker"], "count": row["record_count"],
                                      "sha256": row["packet_sha256"]} for row in manifest["owners"]]}, indent=2))
        return 0
    except (OSError, PacketError, ValueError) as exc:
        parser.exit(2, f"error: {exc}\n")


if __name__ == "__main__":
    raise SystemExit(main())
