#!/usr/bin/env python3
"""Derive a provenance-preserving snapshot from pushed reconciliation branches.

This program is intentionally read-only with respect to every historical branch.
It reads their JSONL blobs through git and writes only this recovery directory.
"""
from __future__ import annotations

import json
import re
import subprocess
from collections import defaultdict
from pathlib import Path

BASE = "19a772e15765348b82f6d708ad63f58927931321"
PACKET = "data/neon-workbench/external/migration-reconcile336-2026-10-06"
OUT = Path(__file__).resolve().parent


def git(*args: str) -> str:
    return subprocess.run(["git", *args], check=True, text=True, capture_output=True).stdout


def show(ref: str, path: str) -> str:
    return git("show", f"{ref}:{path}")


def jsonl(text: str):
    for line_no, line in enumerate(text.splitlines(), 1):
        if not line.strip():
            continue
        try:
            yield line_no, json.loads(line)
        except json.JSONDecodeError as exc:
            yield line_no, {"__malformed__": str(exc), "__raw__": line}


def outcome(wrapper: dict) -> dict | None:
    """Return a full parent wrapper, preserving the source's proposal unchanged."""
    if wrapper.get("status") == "complete" and isinstance(wrapper.get("terminal_record"), dict):
        return wrapper
    # Amendments are allowed to contain the full parent wrapper directly.
    inner = wrapper.get("terminal_record")
    if isinstance(inner, dict) and inner.get("status") == "complete" and isinstance(inner.get("terminal_record"), dict):
        return inner
    if isinstance(inner, dict) and inner.get("record_id") == wrapper.get("record_id"):
        return {
            "record_id": wrapper["record_id"],
            "status": "complete",
            "proposal_only": True,
            "terminal_record": inner,
            "selected_provenance": wrapper.get("selected_provenance", []),
            "amendment_reconciliation": wrapper.get("amendment_reconciliation", {}),
            "checks": wrapper.get("checks", {}),
            "blockers": wrapper.get("blockers", []),
        }
    return None


def main() -> None:
    assignments = json.loads(show(BASE, f"{PACKET}/assignments.json"))
    assigned = {}
    worker_for_id = {}
    for n, packet in enumerate(assignments["assignments"], 1):
        for rid in packet["assigned"]:
            assigned[rid] = packet["id"]
            worker_for_id[rid] = n

    refs = []
    for line in git("for-each-ref", "--format=%(refname:short) %(objectname)", "refs/remotes/origin/ls/*migration-reconciliation*").splitlines():
        ref, commit = line.split(" ", 1)
        files = git("ls-tree", "-r", "--name-only", ref, "--", PACKET).splitlines()
        for path in files:
            match = re.search(r"/worker-(\d+)-terminal\.jsonl$", path)
            if match:
                refs.append({"ref": ref, "commit": commit, "worker": int(match.group(1)), "files": files})

    by_worker = defaultdict(list)
    for item in refs:
        by_worker[item["worker"]].append(item)

    inventory, conflicts, selected = [], [], {}
    for worker, source_list in sorted(by_worker.items()):
        if len(source_list) != 1:
            conflicts.append({"type": "duplicate_worker_branch", "worker": worker, "branches": source_list})
            continue
        source = source_list[0]
        files = [p for p in source["files"] if re.search(fr"/worker-{worker:02d}-(terminal|amendment).*\.jsonl$", p)]
        candidates = defaultdict(list)
        for path in sorted(files):
            relation = "terminal" if path.endswith("-terminal.jsonl") else "amendment"
            for line_no, row in jsonl(show(source["ref"], path)):
                rid = row.get("record_id")
                if "__malformed__" in row:
                    conflicts.append({"type": "malformed_jsonl", "branch": source["ref"], "commit": source["commit"], "file": path, "line": line_no, "error": row["__malformed__"]})
                    continue
                if rid not in assigned:
                    conflicts.append({"type": "outside_assignment", "branch": source["ref"], "commit": source["commit"], "file": path, "line": line_no, "record_id": rid})
                    continue
                value = outcome(row)
                revision = row.get("revision", 0 if relation == "terminal" else None)
                inv = {
                    "record_id": rid, "assignment_packet": assigned[rid], "assigned_worker": worker,
                    "branch": source["ref"], "commit": source["commit"], "file": path, "line": line_no,
                    "relation": relation, "revision": revision,
                    "explicit_supersedes": row.get("supersedes"),
                    "wrapper_valid": value is not None,
                    "outcome_status": (value or {}).get("terminal_record", {}).get("status"),
                }
                inventory.append(inv)
                if value is None:
                    conflicts.append({"type": "malformed_outcome_wrapper", **inv})
                    continue
                candidates[rid].append((relation, revision, row, value, inv))

        expected_ids = [rid for rid, w in worker_for_id.items() if w == worker]
        for rid in expected_ids:
            choices = candidates.get(rid, [])
            terminal = [c for c in choices if c[0] == "terminal"]
            amendments = [c for c in choices if c[0] == "amendment"]
            if len(terminal) > 1:
                conflicts.append({"type": "terminal_count", "record_id": rid, "worker": worker, "count": len(terminal)})
                continue
            chosen = terminal[0] if terminal else None
            # A positive row revision is an explicit revision signal in these packet
            # outputs.  An optional supersedes pointer strengthens provenance but is
            # not required by the historical writer format.  We never infer order
            # from a filename or a JSONL position.
            valid_amendments = [c for c in amendments if isinstance(c[1], int) and c[1] > 0]
            if valid_amendments:
                # Revision is meaningful only with an explicit superseding reference; ties are conflicts.
                top_rev = max(c[1] for c in valid_amendments)
                top = [c for c in valid_amendments if c[1] == top_rev]
                if len(top) != 1:
                    conflicts.append({"type": "ambiguous_amendment_revision", "record_id": rid, "worker": worker, "revision": top_rev, "amendments": [c[4] for c in top]})
                else:
                    chosen = top[0]
            if chosen is None:
                conflicts.append({"type": "no_terminal_or_positive_revision", "record_id": rid, "worker": worker})
                continue
            inv = chosen[4]
            inv["selected_for_recovered_derived"] = True
            result = chosen[3]
            result["recovery_provenance"] = {
                "derived_by": "web-trump-recovery-2026-10-07",
                "source_branch": source["ref"], "source_commit": source["commit"],
                "source_file": inv["file"], "source_line": inv["line"],
                "selection_rule": "terminal baseline; only a positive-revision full amendment may replace it; optional supersedes pointers are retained in inventory",
            }
            selected[rid] = result

    for rid in assigned:
        if worker_for_id[rid] in by_worker and rid not in selected:
            conflicts.append({"type": "recovered_worker_missing_final", "record_id": rid, "worker": worker_for_id[rid]})

    OUT.mkdir(parents=True, exist_ok=True)
    with (OUT / "inventory.jsonl").open("w") as f:
        for row in sorted(inventory, key=lambda x: (int(x["record_id"].split("-")[1]), x["file"], x["line"])):
            f.write(json.dumps(row, separators=(",", ":")) + "\n")
    with (OUT / "recovered-terminal-results.jsonl").open("w") as f:
        for rid in sorted(selected, key=lambda x: int(x.split("-")[1])):
            f.write(json.dumps(selected[rid], separators=(",", ":")) + "\n")
    with (OUT / "recovery-conflicts.jsonl").open("w") as f:
        for row in conflicts:
            f.write(json.dumps(row, separators=(",", ":")) + "\n")
    summary = {
        "base_packet_commit": BASE, "assigned_records": len(assigned), "recovered_workers": sorted(by_worker),
        "recovered_records": len(selected), "missing_worker_outputs": [w for w in range(1, 85) if w not in by_worker],
        "conflicts": len(conflicts), "source_branches": len(refs),
    }
    (OUT / "recovery-summary.json").write_text(json.dumps(summary, indent=2) + "\n")


if __name__ == "__main__":
    main()
