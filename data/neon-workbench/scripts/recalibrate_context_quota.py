"""Reassign confirmed account-credit-blocked context jobs to spare owner slots.

This module is intentionally pure: the controller owns persistence and dispatch.
"""

from __future__ import annotations

from copy import deepcopy


SPARE_ACCOUNT = 6
SPARE_LANE = "full-insights"
CONFIRMED_TERMINAL = {"idle", "failed", "stopped", "terminated", "error"}
ACTIVE = {"running", "active", "busy", "working", "in_progress", "streaming", "starting", "queued"}


def _state(value):
    return str(value or "").strip().lower()


def _owner_snapshot(job):
    """Keep original ownership plus the credit failure reason in history."""
    return {
        "job_id": job.get("id"),
        "account": job.get("account"),
        "worker": job.get("worker"),
        "owner": deepcopy(job.get("owner")),
        "session_id": job.get("session_id"),
        "task_id": job.get("task_id"),
        "branch": job.get("branch"),
        "packet_branch": job.get("packet_branch"),
        "packet_commit": job.get("packet_commit"),
        "provenance": deepcopy(job.get("provenance") or job.get("owner_provenance")),
        "reason": job.get("current_error") or job.get("error"),
        "blocker": job.get("blocker"),
        "preceding_live_status": job.get("preceding_live_status"),
    }


def _status_index(queue):
    status = queue.get("live_status") or queue.get("status") or {}
    workers = status.get("workers", []) if isinstance(status, dict) else []
    return {w.get("id"): w for w in workers if isinstance(w, dict) and w.get("id")}


def _old_owner_is_active(job, jobs, live_by_id):
    if _state(job.get('live_status')) in ACTIVE:
        return True
    old_session, old_task = job.get("session_id"), job.get("task_id")
    for other in jobs:
        # Completed workers are historical owners. Their session status may
        # remain "running" even after this context job has been confirmed idle.
        if other is job or other.get("state") == "complete":
            continue
        other_live = live_by_id.get(other.get("id"), {})
        live_state = _state(other.get("live_status") or other_live.get("live_status"))
        if live_state not in ACTIVE:
            continue
        if old_session and other.get("session_id") == old_session:
            return True
        if old_task and other.get("task_id") == old_task:
            return True
    return False


def recalibrate(queue):
    """Return a copied queue with eligible context99 credit failures reassigned.

    Reassignments consume at most one completed account-6 full-insights owner
    slot each. Slots with task IDs held by any unfinished account-6 job are
    unavailable, preventing duplicate ownership.
    """
    result = deepcopy(queue)
    jobs = result.get("jobs")
    if not isinstance(jobs, list):
        return result

    if any(j.get("account") == SPARE_ACCOUNT and j.get("blocker") == "account credits" for j in jobs):
        return result

    unfinished_spare = [j for j in jobs if j.get("account") == SPARE_ACCOUNT and j.get("state") != "complete"]
    occupied_tasks = {j.get("task_id") for j in unfinished_spare if j.get("task_id")}
    live_by_id = _status_index(result)

    slots = []
    seen_tasks = set()
    for owner in jobs:
        if owner.get("lane") != SPARE_LANE or owner.get("account") != SPARE_ACCOUNT or owner.get("state") != "complete":
            continue
        task_id = owner.get("task_id")
        if not task_id or task_id in occupied_tasks or task_id in seen_tasks:
            continue
        if not all(owner.get(k) for k in ("session_id", "branch")):
            continue
        seen_tasks.add(task_id)
        slots.append(owner)

    for job in jobs:
        if len(slots) == 0:
            break
        if job.get("lane") not in {"context99", "web39-takeover", "web39-recovery", "final-primary45", "offline-gap653", "offline-gap653-qa"} or job.get("state") != "blocked" or job.get("blocker") != "account credits":
            continue
        if _state(job.get("preceding_live_status")) not in CONFIRMED_TERMINAL:
            continue
        if _old_owner_is_active(job, jobs, live_by_id):
            continue

        owner = slots.pop(0)
        history = deepcopy(job.get("fallback_history", []))
        if not isinstance(history, list):
            history = [history]
        history.append(_owner_snapshot(job))
        job["fallback_history"] = history
        job.update({
            "account": SPARE_ACCOUNT,
            "session_id": owner["session_id"],
            "task_id": owner["task_id"],
            "branch": owner["branch"],
            "attempts": 0,
            "state": "queued",
            "last_sent": 0,
            "live_status": None,
            "preceding_live_status": None,
        })
        for key in ("current_error", "error", "blocker"):
            job.pop(key, None)

    return result
