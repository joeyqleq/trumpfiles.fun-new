# Worker 08 — independent citation QA (citation190 cross-QA)

Packet: `codex/citation190-crossqa-2026-10-03` at `9ea34e84716e0599d8c63e0bb0714f64f545df25`.
Input: `data/neon-workbench/external/citation190-crossqa-2026-10-03/worker-08-input.jsonl`; SHA256 `42400b29493c02465990e69c739c9d06f08e508ea7bbbd7c13180f9ab4d8aab9`.
Exact assigned keys (16): `entry-211`, `entry-293`, `entry-651`, `entry-788`, `entry-878`, `entry-996`, `entry-1782`, `entry-2401`, `entry-2557`, `entry-2930`, `entry-3722`, `entry-4054`, `entry-4692`, `entry-5565`, `entry-6155`, `entry-6340`.

## Method and limits

Independently reviewed the exact account1 proposal URLs against the mapped facts and proposal wording, including date/figure precision, attribution and scope. Exact URL access observations are recorded per row alongside the packet’s URL-specific mapping/access notes. HTTP success alone was not treated as evidence: the cited text had to support the claim. Where a source was inaccessible, indexed-only, or mismatched to the event, that limitation is stated.

Offline citation QA only. No canonical files or source-author/other-worker outputs were edited; no Neon/database calls, DDL, DML, or production import occurred. This review is not editorial approval or production-import authorization.

## Per-key decisions

| Key | Classification | Exact reason |
|---|---|---|
| `entry-211` | **narrower_revision_required** | NPR supports Levitsky’s quoted expert assessment and the interview date, but the short and claim wording “had crossed into” states the transition more categorically than his interview phrasing, which presents his judgment/likely outcome. Keep the claim explicitly attributed and preserve his qualification; the text itself correctly rejects formal constitutional termination and total collapse. |
| `entry-293` | **supported_proposal** | CNN’s July 2015 account supports Trump Plaza’s use of S&A Concrete and cites federal records identifying Salerno and Castellano as controllers; WaPo supports the separate attributed account of early business dealings. Proposal limits the language to reported associations and scrutiny, not Trump’s criminal liability. |
| `entry-651` | **supported_proposal** | Official EPA order supports the March 2017 denial of PANNA/NRDC petition to revoke food tolerances and cancel registrations; later EPA release supports the August 2021 tolerance revocation and February 2022 action. The proposal distinguishes the 2017 denial from subsequent regulatory status. |
| `entry-788` | **supported_proposal** | DOJ’s clemency table supports Kilpatrick’s commutation and sentence/offense details; contemporaneous AP reporting supports the Jan. 20, 2021 date, release, and more than seven years served. No motive is attributed and the text correctly distinguishes commutation from pardon. |
| `entry-878` | **supported_proposal** | DOJ’s clemency table supports Behrens’s pardon date, offense/count details, and prior sentence. Evidence supports the narrow pardon record only; it does not establish an explanation, scheme narrative, or Trump-specific rationale. |
| `entry-996` | **supported_proposal** | DOJ’s clemency table and the exact warrant support the commutation to time served and the documented sentence context. The proposal does not infer a reason for selection. |
| `entry-1782` | **supported_proposal** | AP’s contemporaneous reporting directly states that at least 16 files disappeared from the public webpage. This supports a count of files no longer displayed, not destruction of original records, concealment by a named actor, or a shortened legal oversight window. |
| `entry-2401` | **intentional_exclusion** | The mapped sources concern Mordechai Vanunu/Maxwell history, not a Trump event or action. They cannot support the Trump claim; a long-text reference to a 2006 Independent retrospective also lacks its URL in the proposal. |
| `entry-2557` | **intentional_exclusion** | House testimony supports Caputo’s account of his 2007 work for Bloc Lytvyn and related consulting, but does not support Putin direction or a Trump action. This is not a sourced Trump event. |
| `entry-2930` | **narrower_revision_required** | The mapped House release supports that a complaint alleged politicized intelligence assessments. More detailed named actors/timing in the proposal require the linked complaint PDF or docket, not the press release alone. Present all disputed conduct as allegations, not findings. |
| `entry-3722` | **supported_proposal** | NOTUS reports July 2025 reductions-in-force timing and affected energy staff/functions. It does not establish that DOGE executed the reductions or that a later outcome was caused by the cuts. |
| `entry-4054` | **supported_proposal** | CBS and Reuters support that administration officials prepared/considered the reported option and that no final decision had been made as of those reports. Possible target details remain tentative and must not be stated as selected targets. |
| `entry-4692` | **supported_proposal** | DOJ clemency record supports Zhao’s Oct. 21, 2025 pardon; Reuters/CNN reporting supports the Oct. 23 public announcement and reported Binance/World Liberty ties and conflict questions. The evidence does not establish quid pro quo or payment for clemency. |
| `entry-5565` | **supported_proposal** | House Clerk roll call supports passage of H.R. 1 on May 22, 2025, by 215–214. CBO’s June 4 letter supports a projection of 10.9 million more uninsured in 2034 relative to baseline for the House-passed version. This is a projection, not observed coverage loss. |
| `entry-6155` | **supported_proposal** | White House/Federal Register support EO 14290’s May 1, 2025 date and funding directive; the March 31, 2026 court opinion supports the permanent injunction against key provisions on First Amendment grounds. It does not establish money actually withheld or later appeal status. |
| `entry-6340` | **supported_proposal** | CNBC supports an estimated $148 million in global purchases for the May 2025 dinner contest. That estimate is contest token purchases/holdings, not a direct payment to Trump; wallet geography is not attendee citizenship. January launch, SEC, and foreign-wallet claims are not supported by these May sources. |

## Staged-copy and URL reconciliation

Each JSONL row preserves the account1 proposal text and its exact source-to-fact mappings, the independently reviewed URL/access finding, and a comparison against the staged title/source list. Notable mismatches are recorded for entries 293, 651, 996, 4054, 4692, 5565, and 6155; entries 211, 2930, and 6340 require the stated scope/attribution bounds. Entries 2401 and 2557 are intentional exclusions because the mapped record does not establish a Trump event/action.

## Exact-set QA

- Reviewed rows: 16; classifications: intentional_exclusion=2, narrower_revision_required=2, supported_proposal=12.
- Output keys and order match the packet assignment exactly; no duplicate or unassigned key.
- Packet input SHA256 verified: `42400b29493c02465990e69c739c9d06f08e508ea7bbbd7c13180f9ab4d8aab9`; immutable packet commit verified: `9ea34e84716e0599d8c63e0bb0714f64f545df25`.
- Checkpoints were written after records 8 and 16 (each falls within the required 5–10 row interval).
- All conclusions are limited to cited URL text and account1 wording. Inaccessible source text is not treated as support; inaccessible/indexed-only observations are explicitly noted.
- No tests or UI captures apply: only offline QA data artifacts were added, with no application code or user-facing flow change.
