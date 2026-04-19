#!/usr/bin/env python3
import argparse
import math
import os
import subprocess
import sys
import time
from datetime import datetime, UTC


def now():
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


def chunks(items, size):
    for i in range(0, len(items), size):
        yield items[i : i + size]


def run():
    p = argparse.ArgumentParser()
    p.add_argument("--chunk-file", required=True)
    p.add_argument("--mode", default="apply")
    p.add_argument("--chunk-size", type=int, default=10)
    p.add_argument("--concurrency", type=int, default=8)
    p.add_argument("--min-relevance", type=float, default=0.14)
    p.add_argument("--search-min-relevance", type=float, default=0.10)
    p.add_argument("--search-per-entry", type=int, default=2)
    p.add_argument("--timeout-ms", type=int, default=6000)
    p.add_argument("--db-timeout-ms", type=int, default=120000)
    p.add_argument("--timeout-seconds", type=int, default=170)
    p.add_argument("--heartbeat-seconds", type=int, default=10)
    p.add_argument("--coverage-mode", action="store_true")
    p.add_argument("--log-file", default=f"logs/runner_live_stream_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log")
    args = p.parse_args()

    os.makedirs("logs", exist_ok=True)
    with open(args.chunk_file, "r", encoding="utf-8") as f:
        entries = [line.strip() for line in f if line.strip()]
    entries = [int(x) for x in entries]
    grouped = list(chunks(entries, args.chunk_size))

    with open(args.log_file, "a", encoding="utf-8") as log:
        log.write(f"runner_started_at={now()}\n")
        log.write(f"chunks={len(grouped)} entries={len(entries)}\n")
        log.flush()
        for idx, group in enumerate(grouped, start=1):
            entry_numbers = ",".join(str(x) for x in group)
            report = f"logs/repair_{datetime.now().strftime('%Y%m%dT%H%M%SZ')}_chunk{idx}.json"
            cmd = [
                "node",
                "scripts/repair-sources.mjs",
                "--mode",
                args.mode,
                "--entries",
                entry_numbers,
                "--concurrency",
                str(args.concurrency),
                "--min_relevance",
                str(args.min_relevance),
                "--search_min_relevance",
                str(args.search_min_relevance),
                "--timeout_ms",
                str(args.timeout_ms),
                "--db_timeout_ms",
                str(args.db_timeout_ms),
                "--search_per_entry",
                str(args.search_per_entry),
                "--report",
                report,
            ]
            if args.coverage_mode:
                cmd.extend(["--coverage_mode"])
            log.write(f"=== chunk={idx} ===\n")
            log.write(f"entry_numbers={entry_numbers}\n")
            log.write(f"cmd={' '.join(cmd)}\n")
            log.flush()

            start = time.time()
            proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
            last_heartbeat = 0
            while True:
                if proc.poll() is not None:
                    break
                line = proc.stdout.readline() if proc.stdout else ""
                if line:
                    log.write(line)
                    log.flush()
                elapsed = int(time.time() - start)
                if elapsed - last_heartbeat >= args.heartbeat_seconds:
                    log.write(f"heartbeat chunk={idx} status=running elapsed_s={elapsed}\n")
                    log.flush()
                    last_heartbeat = elapsed
                if elapsed >= args.timeout_seconds:
                    proc.kill()
                    log.write(f"timeout chunk={idx} elapsed_s={elapsed}\n")
                    log.flush()
                    break
            if proc.stdout:
                remainder = proc.stdout.read()
                if remainder:
                    log.write(remainder)
            code = proc.wait() if proc.poll() is None else proc.returncode
            log.write(f"status={'ok' if code == 0 else 'fail'} chunk={idx} exit={code}\n")
            log.flush()
        log.write(f"runner_finished_at={now()}\n")
        log.flush()

    print(args.log_file)


if __name__ == "__main__":
    run()
