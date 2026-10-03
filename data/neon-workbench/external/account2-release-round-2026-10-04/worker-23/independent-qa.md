# Worker 23 independent account2 release-gate QA

Reviewed the immutable account6 source-correction packet at `codex/account6-source-corrections-2026-10-03` commit `eb09172323e4928892548aac8a65a23aa35ba20e`, its manifest and all 12 exact assigned input files, each latest `origin/ls` worker branch, and the rotated one-step cross-QA files. Results are release-gate proposals only: every input source-triage classification remains `needs_correction`; none is marked accepted or verified.

Coverage: 118 assigned keys, 118 unique; exactly one effective result per key. The release file retains each packet input row, worker output row, cross-QA row, source branch head, file paths, and SHA-256 values. All source URLs from the packet rows are retained; added URLs are mapped. Every effective URL has a non-empty URL-to-fact mapping, and all short/medium/long copy lengths pass: short ≤180 characters, medium 45–90 words, long 140–300 words.

## Release gate

- 104 effective results retain the latest reviewer disposition with its stated access/scope caveats.
- 13 effective results carry a corrected overlay that resolves a review finding and are ready for editorial review as proposals.
- 1 result remains held: **entry-6783**. The available DOJ URL documents Trump’s Jan. 20 Jan. 6 clemency proclamation, not the distinct alleged Jan. 21 Bondi instruction to dismiss unrelated cases. A safe supporting record would require a dated DOJ instruction or case-specific motions/docket entries plus reliable contemporaneous reporting. No unrelated event is substituted as a correction.
- “Ready” here means the draft meets this release-gate QA after scope/evidence corrections; it does not mean the source-triage row was accepted or independently verified.

## Cross-QA findings integrated

- `entry-6800` — Add indictment/dismissal chronology and December grand-jury refusals with AP links; keep motive/retaliation unproved.
- `entry-6916` — Reframe as the FEC 2022 review, using year-only event dating; the sources do not establish a single exact date for the vote sequence.
- `entry-4386` — Correct “66% fewer” to VPM/NPR’s “about half as many”; restore the staged KPBS syndicated mirror URL and map it as a duplicate, not corroboration.
- `entry-4399` — Remove unsupported Oklahoma 15% decline and call the measured outcome plan selections; retain Ohio 20%. Do not repeat Reuters’ exact national exit count because article body was inaccessible in cross-QA.
- `entry-5742` — Limit “reason unclear” to Kruse; the review does not say reasons for all three removals were unclear.
- `entry-6753` — EO 14151 directs specified terminations within 60 days; paid leave is attributed only to Education Department’s Jan. 23 implementation.
- `entry-6746` — Limit copy to March 31 review announcement; later demands/freeze are excluded absent their own URLs.
- `entry-5273` — Narrow holding to people with mental disabilities, as the OLC opinion states; keep effects on particular states/people unresolved.
- `entry-6669` — Use July 6, 2020 initial publication (8:35 p.m. EDT) and identify July 7 as update.
- `entry-6458` — Add AP chronology source for later June 21 U.S. strikes; leave first barrage count/interceptions attributed to Israeli military.
- `entry-6966` — Remove supported Aug. 10, 2026 date from evidence-gap list; treat downstream date-field update separately.
- `entry-6459` — Remove “emergent operational requirement” because it was not mapped to the Reuters URL.
- `entry-6708` — Add Axios’s dated Aug. 28, 2018 report to support precise death-toll adoption date.
- `entry-6783` — Replace unrelated clemency-event substitution with an exclusion draft; no source establishes alleged Jan. 21 Bondi directive or unrelated-case dismissals. Keep HOLD.

## Six missing-final-QA followups

The dedicated `six-missing-final-qa-followups.jsonl` contains exactly: entry-6800 (later indictment, Nov. 24 procedural dismissal and Dec. grand-jury refusals added with AP links); entry-6916 (2022 FEC date precision); entry-6458 (AP link for later U.S. strike chronology); entry-6966 (supported date gap reclassified as downstream field correction); entry-6708 (Axios date-source added); and entry-6783 (unresolved exclusion proposal retained on hold).

## Remaining evidence limits and access notes

The effective-results file retains each key’s exact unresolved gap and peer access note. Notable limitations remain explicit: some Reuters pages returned HTTP 401 and some Investing.com/AP/Forbes pages returned 403 or timed out; AP/Reuters mirror copies are identified as such, and mirror copies are not counted as independent corroboration. For `entry-4399`, the inaccessible Reuters body is not used for a precise count. For `entry-6916`, a year-level date is used rather than inventing an exact vote date. `entry-6800` describes procedural dismissal and later grand-jury refusals, not a merits determination or proof of retaliatory motive. Other unsupported claims and causal allegations remain excluded in per-key evidence gaps.

## Exact rotated input commits

The checkpoint records the full SHA of each of the 12 latest worker branch heads, the immutable packet commit, packet input SHA-256, worker output SHA-256, and rotated-review SHA-256/path. The cross-QA cycle is 12→1, 1→2, 2→3, 3→4, 4→5, 5→6, 6→7, 7→8, 8→9, 9→10, 10→11, 11→12.

## Scope integrity

Only worker-23 release-gate files are created under this directory. No other worker branch, canonical record, database, Neon resource, score, or merge was touched. The original worker output and cross-QA history are embedded unchanged; corrections exist only as this release round’s effective overlays.
