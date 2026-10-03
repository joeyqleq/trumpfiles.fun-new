# Web PR49 QA — worker 15 final checkpoint

This validation covers only the 33 assignment keys in the frozen worker-15 packet at `f492cfb98aa1e98072527d1a0af50ae6f2122f86`. The append-only proposal history remains in `data/neon-workbench/external/web-release-review/2026-10-03/results/lightsprint-rescue-worker15-batch-UNIQUE.jsonl` and was not rewritten. This is QA metadata only: no canonical records, scores, databases, or other worker branches were changed.

## Validation

- Frozen packet and results: 33 rows each, exact ordered key-set match, no duplicate keys.
- Proposal artifact SHA256: `e3c529713da1cc140dac5b94da0db4dc46a37d71fe7ea2ce34e3ff8916363370`.
- Checked 57 source URL references; every listed URL is HTTPS. Exclusion and unresolved proposals may have no URL.
- Checked 46 populated descriptions: short at most 180 characters, medium 45–90 words, long 140–300 words. Empty long fields are preserved where available evidence cannot support expansion without padding.
- Verified the latest PR49 baseline status and revision against the cited frozen source line for 27 baseline-linked records. Candidate-only and PR47 proposal records retain their stated source limitations.
- All 33 records are proposal-only and have exact remaining-gap statements. All five PR47 rows preserve `original_claim_substantiated=false`.

## Latest proposed status counts

- `partially_source_verified_access_limits_explicit`: 6
- `reviewed_candidate_supported_with_attribution`: 1
- `reviewed_claim_not_supported_as_written`: 1
- `reviewed_exclude`: 5
- `reviewed_narrower_supported_event`: 3
- `reviewed_pr47_correction_as_proposal_only`: 5
- `reviewed_split_partial_draft`: 2
- `reviewed_split_with_complete_child_drafts`: 1
- `reviewed_unresolved`: 8
- `source_text_independently_read_with_limits`: 1

## Exact remaining evidence gaps

- `entry-4240`: The original card’s additional claims about reduced royalty rates, congressional criticism, and simultaneous EPA climate deregulation are not part of either sourced event draft and need separate evidence or omission.
- `entry-4753`: The agency announcement supports the March 11 review process; Hall’s reporting supports his April retirement and attributed censorship concern. The supplied articles do not provide enough additional event-specific context for the omitted long fields without repeating review notes. The two child long descriptions remain null because the published source read did not supply enough additional event detail to reach 140 words without padding; keep these short/medium drafts only until fuller sourced detail is available.
- `entry-5237`: The bounded proposal is retained; these additional claims remain unsupported: A single Washington Post investigation published August 2025 documented the cumulative removal of CIA Russia experts, NSA leaders, the Cyber Command head, the DIA director, and dozens of China/AI/nuclear specialists replaced by social-media-activism loyalists.; The entry collapses at least four distinct personnel actions spanning February-August 2025 (Ellis appointment Feb 3, NIC firings May, probationary CIA firings March, clearance revocations and Russia-expert removal August) under a single February 3, 2025 event date.; The claim that specialists were replaced by loyalists handpicked through social media activism rather than operational merit, and that a single Washington Post investigation documented the cumulative effect across NSA, Cyber Command, DIA, and dozens of specialists, is not established by the located factual reporting, which covers discrete actions individually.
- `entry-5735`: A contemporaneous official operation record or credible reporting that identifies the July 21 operation, cities, verified arrest totals, and evidence for the alleged wrongful detentions and force.
- `entry-5809`: The bounded proposal is retained; these additional claims remain unsupported: Trump Executive Order Targets Covington & Burling Law Firm; Trump did target Covington & Burling by directing suspension of clearances for lawyers involved with Jack Smith and review or termination of government engagements, but the White House action was a February 25, 2025 presidential memorandum, not a March 14 executive order. The stored date and instrument are materially wrong.
- `entry-5899`: The loan date is known only by year. Do not aggregate it with separate loans or repeat the unsupported foreign-intelligence leverage and undisclosed-subpoena claims.
- `entry-6417`: The bounded proposal is retained; these additional claims remain unsupported: No credible source located for the categorical March 2025 statement described in the card.; On February 11, 2025, while litigating a federal-funding freeze, Trump publicly said he would 'always abide by the courts.' Later disputes and attacks on judges do not by themselves verify the stored quotation or categorical legal claim.; The claimed March statement that Trump could disregard federal court orders is not supported; the directly read contemporaneous report records the opposite assurance in a related funding dispute.
- `entry-6440`: No executive order matching surveillance of U.S. citizens without FISA warrants was identified. Exact order and surveillance authority needed.
- `entry-6498`: No recording or transcript supplied for the alleged claim Trump beat Obama in 2016. Exact date/venue needed; a quote search did not locate it.
- `entry-6582`: No sufficiently supported discrete event survives the proposed soft-hide rationale. Reconsider only if direct evidence establishes a dated occurrence matching the entry.
- `entry-6606`: No evidence supplied that Hegseth fired officers because they testified against Trump in impeachments. Need named officers, testimony, personnel action and causal evidence.
- `entry-6637`: No evidence supplied establishing DOGE obtained unauthorized access to SSA data of approximately 70 million people. Need access logs, court findings or agency records and precise data scope.
- `entry-6736`: No April 2025 post or statement supplied tying Kennedy’s raw-milk promotion to the specified active Salmonella outbreaks. Need original post and outbreak date/source.
- `entry-6776`: Prior and current searches did not verify this personnel-retaliation claim.
- `entry-6789`: A reliable source naming judges removed or appointed in March 2025 and documenting the alleged surveillance applications or congressional-access denial.
- `entry-6804`: The search surfaced White House/administration assertions about the Alien Enemies Act and court jurisdiction during March 2025 deportation litigation, but no source substantiating the claimed March 18 Trump declaration that no court could stop deportations generally. The exact statement, date, and scope remain unverified.
- `entry-6829`: SSA’s March 27 release says no local field office had been permanently closed or announced for closure since Jan. 1; lease list mostly concerned unstaffed hearing rooms. The 50% claim is contradicted. Exact blocker: a reliable contemporaneous source establishing the stated date, actor, action and affected group was not found in the supplied evidence.
- `entry-6866`: No credible source located for the quoted event.
- `entry-6930`: State Department materials document longstanding biometric collection and verification for visa and border processes, not the claimed social-media photo dragnet or political-dissenter targeting.
- `entry-6946`: Useful for identifying a likely conflation; does not establish a DHS watchlist.
- `expanded-20260820-bessent-regime-collapse`: A stated aim/prediction is not evidence that Iran’s government collapsed or that the policy achieved the result.
- `expanded-20260831-ballroom-sc-stay`: Interim stay is not final authorization or merits ruling; dissent is not majority holding.
- `expanded-20260910-rnc-kennedy-falsehoods`: Fact-check conclusions are limited to claims discussed; preserve attribution/context.
- `expanded-20260917-trump-axios-annihilate`: Threat/consideration is not an attack order or military action.
- `expanded-20260924-media-ban-tro`: Temporary relief expires/awaits further proceedings; security rationale is judicially questioned at preliminary stage only.
- `expanded-20260928-garces-criminal-complaint`: The criminal allegations remain unadjudicated; exact event outcome and complaint text are not in this QA packet. Candidate is not authorized for insertion.
- `fresh-20260826-raskin-1789`: Letter allegations and questions do not establish improper awards, favoritism, or any specific benefit.
- `fresh-20260928-draganfly-financing`: Announcement does not prove closing or special rights; issuer’s forward-looking statements underscore that contingency.
- `pr47-review-entry-1295`: The dataset is a present retrieval of a file whose declared last-modified timestamp is December 3, 2025, not an independently archived snapshot captured on that date. The six rows support a dated category description but do not by themselves prove disproportionate clustering compared with all other categories or substantiate an interpretation about structural execution drag.
- `pr47-review-entry-1443`: Not a complete account of all administration policies or all campaign promises. The available data timestamp is Dec. 3, 2025; it does not establish February/March 2026 status. Tracker labels do not establish a selective public messaging pattern or total policy impact.
- `pr47-review-entry-1491`: No source located establishes who ordered removal of all 16 files or a lasting effect on credibility claims. The DOJ explanation applies to restoration of the photo, not necessarily all missing files.
- `pr47-review-entry-1584`: The allegation is unsubstantiated; the source does not establish it as fact. No evidence in these sources shows Trump ordered the records withheld or directed disclosure decisions.
- `pr47-review-entry-1640`: The packet does not provide a file-by-file list or establish whether all 16 files were restored. “Auditable” is not supported as a characterization of an official audit.
