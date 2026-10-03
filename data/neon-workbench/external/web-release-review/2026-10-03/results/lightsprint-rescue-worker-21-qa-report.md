# Worker 21 PR49 rescue QA — final validation

- Branch: `ls/9-trump-final-corrections-account2-worker2-xNvR`
- HEAD at validation: `7bc8198b19c7c139fa61a1625e7209d9e347f4a1`
- Source packet SHA256: `6c44e297f22796e6007d0254c89c578195826be719bfc5c9a6b8f04aac4dff65` (matches manifest)
- Exact assignment: 32 keys; 32 latest proposal rows. Append-only history has 33 rows because `entry-6939` has one superseding QA row after the original batch.
- PR49 baseline: all held rows and six fresh rows with baseline results point to the maximum published revision/status. The Murray/Murphy candidate has no PR49 result row. PR47 rows retain independent `review_key` and `original_claim_substantiated=false`.
- Draft QA: all populated short/medium/long fields meet <=180 chars / 45-90 words / 140-300 words. 3 source-limited child long fields remain null; no filler was added.
- URL QA: every cited URL is HTTPS and has access status/notes. Seven held entries have no consulted source URL in the published baseline; those gaps are explicitly retained.

## Exact remaining URL/evidence gaps

- `entry-5478` — no source URL was supplied or directly consulted in the published baseline. Gap: No primary docket or reliable contemporaneous source was supplied or located for a 2013 Mar-a-Lago settlement of a suit alleging exclusion of Black and Jewish residents. Exact gap: case name/docket, settlement date and terms.
- `entry-6398` — no source URL was supplied or directly consulted in the published baseline. Gap: No authenticated statement or recording supplied for Trump saying he would reject 2028 results if he lost. Exact date, venue and complete quote needed.
- `entry-6598` — no source URL was supplied or directly consulted in the published baseline. Gap: No DOJ filing or official announcement supplied for an investigation of Jan. 6 committee members for prosecutorial misconduct. Need target list, authority and opening date.
- `entry-6751` — no source URL was supplied or directly consulted in the published baseline. Gap: No Feb. 15 post or threat located. Later executive actions/administration pressure on universities cannot substantiate the specific February statement. Need original post or contemporaneous transcript.
- `entry-6798` — no source URL was supplied or directly consulted in the published baseline. Gap: No credible source supports the stored mass-firing claim.
- `entry-6822` — no source URL was supplied or directly consulted in the published baseline. Gap: No matching primary or reputable source located.
- `entry-6922` — no source URL was supplied or directly consulted in the published baseline. Gap: No sufficiently reliable source located for the claim as written.

## Exact remaining evidence gaps

- `entry-4538` — No additional source-backed resolution is present in the published packet.
- `entry-5190` — Three independently dated components are supported (July memo, July lawsuit, November DOJ request); retain the split and reject the conspiracy “boomerang” frame. The lawsuit child lacks a source-supported 140-word long field; keep it null.
- `entry-5478` — No primary docket or reliable contemporaneous source was supplied or located for a 2013 Mar-a-Lago settlement of a suit alleging exclusion of Black and Jewish residents. Exact gap: case name/docket, settlement date and terms.
- `entry-5754` — February work halt, March partial resumption, and April attempted mass layoffs are separate episodes. CFPB was not legally disbanded and the reviewed sources do not establish that all enforcement cases were dropped. Two children intentionally lack long fields because the opened reports do not support 140 words without padding.
- `entry-5840` — No sufficiently supported discrete event survives the proposed soft-hide rationale. Reconsider only if direct evidence establishes a dated occurrence matching the entry.
- `entry-6398` — No authenticated statement or recording supplied for Trump saying he would reject 2028 results if he lost. Exact date, venue and complete quote needed.
- `entry-6430` — No executive order matching indefinite detention of immigrants was located in the packet. Exact order number, date and statutory authority needed.
- `entry-6463` — The chronology is inconsistent. The entry is dated June 15, 2025 but says Khamenei's statement followed destruction of Iranian nuclear facilities by U.S. forces; the U.S. strikes on Iranian nuclear sites occurred about a week later, on June 21-22, 2025. I also did not verify the quoted 'gates of hell' and 'severe and unrelenting' language as a June 15 Khamenei address.
- `entry-6521` — The official transcript citation is reported as saying “big league,” contradicting the stored “bigly” claim, but this QA pass did not independently open the transcript. Retain exclusion pending direct verification; do not substitute the quote as a new correction.
- `entry-6598` — No DOJ filing or official announcement supplied for an investigation of Jan. 6 committee members for prosecutorial misconduct. Need target list, authority and opening date.
- `entry-6615` — No credible report or official record located establishing Patel created a dedicated FBI unit to investigate journalists.
- `entry-6672` — Reuters syndication says Trump denied selling his shares; it does not establish that Trump or other named insiders sold at market peak while retail investors bought. Need SEC transaction filings and precise dates.
- `entry-6751` — No Feb. 15 post or threat located. Later executive actions/administration pressure on universities cannot substantiate the specific February statement. Need original post or contemporaneous transcript.
- `entry-6784` — No credible source located.
- `entry-6798` — No credible source supports the stored mass-firing claim.
- `entry-6822` — No matching primary or reputable source located.
- `entry-6839` — GAO reports FY2019-2025 EAJA awards and explains the statute's continuing operation.
- `entry-6922` — No sufficiently reliable source located for the claim as written.
- `entry-6939` — NPR reports a VA spokesperson denied DOGE access to Veterans’ or VA beneficiaries’ data. This is a denial statement, not proof that no access occurred; preserve attribution and avoid implying a breach.
- `entry-6958` — Useful boundary source showing documented actions without validating the specific raid claim.
- `expanded-20260827-usps-new-tro` — Reuters reports a federal judge temporarily blocked the USPS ballot-mail rule on August 28. It is a TRO against implementation of an earlier directive, not a new Trump order; no final ruling or election outcome is established.
- `expanded-20260909-census-exclusion-proposal` — Reuters reports a proposed census change limited to citizens and permanent residents and removal of race/ethnicity questions, open for comment. It was a proposal, not a final rule; downstream apportionment or funding effects are not established.
- `expanded-20260915-ice-locator-exclusion` — AP reports, citing three current/former officials, that ICE removed locator entries for detainees with final removal orders. ICE did not confirm the change; do not imply every record was removed or that removal/deportation occurred.
- `expanded-20260922-doj-media-security-defense` — CBS reports DOJ filed a defense of White House press restrictions, invoking professionalism and national security. This filing is the event; the outlets’ due-process objections and any eventual court ruling must remain attributed/unresolved.
- `expanded-20260925-save-sc-stay` — Existing source log says CBS body was unavailable and Votebeat was not independently read. Official order, scope, dissent, and practical effect remain unverified; keep the candidate unresolved and do not repeat those details as fact.
- `expanded-20260929-murray-murphy-ad-letter` — The supplied proposal describes a senators’ oversight letter and its requests. The alleged DHS advertising payment is not established; the primary letter URL and underlying apportionment/accounting documents need direct inspection before a publication-ready draft.
- `fresh-20260916-eric-dominari-13g` — The SEC XML was not readable in the prior source pass. Secondary summary attributes 1,398,414 shares and 5.77% to a Schedule 13G, but primary filing verification, share base, as-of date and warrant context remain gaps.
- `pr47-review-entry-1213` — AP tracker snapshot retrieved October 2 declares last modified December 3, 2025 and lists 25 selected pledges: 5 kept, 9 in progress, 11 complicated. This does not support “behind” as a general score or a later dated event; distinct from PolitiFact’s tracker at entry 1595.
- `pr47-review-entry-1300` — AP’s March 2 reporting describes communications and press-access choices during the first days of the Iran war. It does not document a personal loyalty test. This is a communications episode, distinct from the February 27 decision chronology at entry 1471.
- `pr47-review-entry-1471` — AP chronology supports Trump’s remarks about negotiations at 12:25 p.m. February 27 and strike order at 3:38 p.m. It does not establish deliberate ambiguity or motive. This is a distinct decision-timeline event from entry 1300’s press communications.
- `pr47-review-entry-1537` — Keep only the documented February 4 Minnesota “softer touch” remark and personnel drawdown. Remove the separate January Greenland/Iceland exchange from both descriptions to avoid event conflation. Neither event supports measurable institutional strain.
- `pr47-review-entry-1595` — PolitiFact’s February 23 fact-check assesses Trump’s January Detroit promise claim against its own 75-promise MAGA-Meter. This is not AP’s separate 25-item tracker (entry 1213), and neither source supports a continuing messaging trend.

Full per-key latest-status, revision, source URL, draft-length and gap audit is in [`lightsprint-rescue-worker-21-checkpoint-final.json`](lightsprint-rescue-worker-21-checkpoint-final.json).
