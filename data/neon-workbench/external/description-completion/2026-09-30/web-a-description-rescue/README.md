# Account A description rescue proposals

These are review proposals, not canonical changes. Inputs are frozen at `0089ae722b39edb5180b2496b1f35e2f8fe1ca92`. Filtering `merged/descriptions.jsonl` for `status == "needs_context"`, sorting `record_id` lexicographically, and numbering from zero produces 1,463 records. Account A owns the 732 even positions. `assignment.json` records that exact assignment; `reassignments/` records later transfers of unattempted tails.

`inputs/` preserves each assigned packet and available original lane metadata. Reference rows do not create additional assignments. `outputs/` contains one terminal proposal per assigned ID. `repaired` means a complete supported description; `supported_partial` includes useful supported text and an exact evidence gap; `unresolved` records a specific blocker. Corrections to overstated claims appear separately in `corrected_wording` and evidence notes.

Preserve every historical output. Apply field-level patches from `editorial-review/` to their `target_record_id`; the final review manifest records the authoritative patch order. Patches do not create additional assigned records. Descriptions are proposals only; no canonical description, score, database, existing history, or frontend file is changed.

Checkpoints record pushed progress and exact remaining IDs. The final validation and proposal index will document effective counts, ownership, missing and duplicate IDs, title lengths, description word counts, source URL syntax, and change scope. Partial text may be shorter than requested when the evidence cannot support a full description without invention.
