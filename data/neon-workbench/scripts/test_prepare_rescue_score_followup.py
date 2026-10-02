#!/usr/bin/env python3
"""Hermetic tests for deterministic deferred-score follow-up packets."""
import hashlib
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).with_name("prepare_rescue_score_followup.py")
SPEC = importlib.util.spec_from_file_location("prepare_rescue_score_followup", SCRIPT)
builder = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(builder)


class RescueScoreFollowupTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="score-followup-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.finish = self.root / "finish"
        self.finish.mkdir()
        self.originals = self.finish / "original"
        self.originals.mkdir()
        self.score_file = self.finish / "scores.jsonl"
        self.held_file = self.finish / "held.jsonl"
        self.merged_file = self.root / "descriptions.jsonl"
        self.report_file = self.root / "web-report.json"
        self.proposals_file = self.root / "web-proposals.jsonl"
        self.rubric_file = self.root / "RUBRIC.md"
        self.rubric_file.write_text("rubric fixture\n")
        score_rows, desc_rows, held = [], [], []
        for i in range(677):
            rid, number = f"entry-{i+1}", i + 1
            score_rows.append({"record_id": rid, "entry_number": number,
                               "version": "impact-v2", "status": "deferred",
                               "dimensions": None, "reason": "unsupported"})
            desc_rows.append({"record_id": rid, "entry_number": number, "status": "complete",
                              "title": f"title {number}", "description_short": f"short {number}",
                              "description_medium": f"medium facts {number}",
                              "description_long": f"long facts {number}", "source_urls": []})
            packet = {"record_id": rid, "entry_number": number, "title": f"original {number}",
                      "context": {"synopsis": f"supplied synopsis {number}"}}
            owner = number % 12 + 1
            with (self.originals / f"worker-{owner:02d}-score-input.jsonl").open("a") as out:
                out.write(json.dumps(packet) + "\n")
        score_rows.extend([{"record_id": "entry-9000", "entry_number": 9000,
                            "version": "impact-v2", "status": "scored",
                            "dimensions": {"harm": 1}}])
        desc_rows.append({"record_id": "entry-9000", "entry_number": 9000, "status": "complete"})
        held.append({"record_id": "entry-9001", "entry_number": 9001,
                     "version": "impact-v2", "status": "deferred", "dimensions": None})
        self.score_file.write_text("".join(json.dumps(row) + "\n" for row in score_rows))
        self.held_file.write_text("".join(json.dumps(row) + "\n" for row in held))
        self.merged_file.write_text("".join(json.dumps(row) + "\n" for row in desc_rows))
        proposals = []
        for i in range(1, 355):
            proposals.append({"record_id": f"entry-{i}", "entry_number": i,
                              "status": "repaired", "patch": {"description_long": f"verified patch {i}"},
                              "proposal_source": "validated", "source_ref": "ref", "source_commit": "commit"})
        proposal_bytes = b"".join((json.dumps(row, sort_keys=True, ensure_ascii=False) + "\n").encode()
                                   for row in proposals)
        self.proposals_file.write_bytes(proposal_bytes)
        canonical = "\n".join(json.dumps(row, sort_keys=True, ensure_ascii=False) for row in proposals).encode()
        self.report_file.write_text(json.dumps({
            "counts": {"integration_ready_repairs": 354},
            "proposal_sha256": hashlib.sha256(canonical).hexdigest(),
            "integration_ready_ids": [row["record_id"] for row in proposals],
            "inputs": {"current_merged_sha256": hashlib.sha256(self.merged_file.read_bytes()).hexdigest()},
        }))

    def build(self):
        return builder.build_packets(self.score_file, self.held_file, self.originals,
                                     self.merged_file, self.report_file, self.proposals_file)

    def test_builds_only_current_deferred_with_modulo_12_ownership_and_repair_overlap(self):
        packets, report = self.build()
        self.assertEqual(len(packets), 677)
        self.assertEqual(sum(packet["validated_web_repair"] is not None for packet in packets), 354)
        self.assertNotIn("entry-9000", {row["record_id"] for row in packets})
        self.assertNotIn("entry-9001", {row["record_id"] for row in packets})
        artifacts, manifest = builder.make_artifacts(
            packets, report, self.score_file, self.merged_file, self.held_file,
            self.rubric_file, self.report_file, self.proposals_file, self.originals)
        self.assertEqual([entry["record_count"] for entry in manifest["owners"]],
                         [57] * 5 + [56] * 7)
        expected = [packet["record_id"] for packet in packets]
        for index in range(12):
            rows = [json.loads(line) for line in artifacts[f"worker-{index+1:02d}-score-input.jsonl"].splitlines()]
            self.assertEqual([row["record_id"] for row in rows], expected[index::12])

    def test_packet_and_manifest_bytes_are_deterministic(self):
        packets_a, report_a = self.build()
        packets_b, report_b = self.build()
        a, ma = builder.make_artifacts(packets_a, report_a, self.score_file, self.merged_file,
                                        self.held_file, self.rubric_file, self.report_file,
                                        self.proposals_file, self.originals)
        b, mb = builder.make_artifacts(packets_b, report_b, self.score_file, self.merged_file,
                                        self.held_file, self.rubric_file, self.report_file,
                                        self.proposals_file, self.originals)
        self.assertEqual(a, b)
        self.assertEqual(ma, mb)

    def test_records_validation_snapshot_drift_and_uses_current_facts(self):
        self.merged_file.write_text(self.merged_file.read_text() + " ")
        packets, report = self.build()
        self.assertFalse(report["validated_against_current_merged_snapshot"])
        self.assertEqual(report["packet_current_merged_sha256"],
                         hashlib.sha256(self.merged_file.read_bytes()).hexdigest())
        self.assertEqual(packets[0]["current_descriptive_facts"]["title"], "title 1")


if __name__ == "__main__":
    unittest.main(verbosity=2)
