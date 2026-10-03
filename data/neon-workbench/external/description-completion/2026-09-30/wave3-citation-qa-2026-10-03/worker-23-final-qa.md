# Wave3 citation QA worker 23 — final checkpoint

- Frozen source branch: `codex/wave3-citation-qa-2026-10-03` at `c3cd646a23fb2e2f70e62d460064f71a3fd36c02`.
- Input file SHA256: `609357b5bd2d253defe1b89ddaf092b82a70fba23f25532e033caa07306a2a44` (matches manifest).
- Scope: exactly 17 assigned IDs; output rows 17, unique IDs 17, missing 0, extra 0, duplicate 0.
- Proposal status counts: {'corrected_claim_proposal': 8, 'citation_repaired_proposal': 5, 'scope_exclusion_proposal': 3, 'unresolved_hold': 1}.
- Every row preserves its prior input hash, staged/original/proposal context, changed fields, and proposal-only/no-canonical-or-database-change guard.
- All corrected drafts have URL-specific maps and meet short <=180 chars, medium 45–90 words, long 140–300 words. Scope exclusions and the unresolved hold retain explicit uncertainties.
- Exact remaining evidence gaps are copied per record in `worker-23-checkpoint-final.json`; no unresolved hold was upgraded.

## Outstanding limitation

`entry-2340` remains `unresolved_hold`: the linked Senate interview PDF was not readable and the packet has no authoritative FHA order or committee record to establish the alleged blacklist. Other per-record uncertainties are recorded verbatim in the checkpoint.

Machine-readable checkpoint: `worker-23-checkpoint-final.json`.
