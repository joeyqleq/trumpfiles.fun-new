# Finish existing entry descriptions

Repository: `/home/jq/Desktop/trumpfiles.fun-new`.
Read only your assigned lane's `input.jsonl` and this file. Do not restart old dispatchers.

## Writing rules

- Keep each existing title unless it is missing or a supplied correction replaces it.
- Preserve every populated `existing` description exactly. Write only fields listed in `needs`.
- `description_short`: a useful card teaser, at most 180 characters.
- `description_medium`: 45–90 words explaining the event and immediate context.
- `description_long`: 140–300 words giving context, what happened, and supported consequences or uncertainty.
- Reuse supplied facts, existing text, recovered drafts, correction proposals, and linked source notes. Preserve dates, figures, attribution, and exact URLs.
- Existing linked sources are sufficient to begin. Do not repeat the week's exhaustive source research. If supplied facts are too thin for useful long text, read one relevant linked page; if still thin, record `needs_context`. Never invent facts or pad the text with repetitive filler.
- Keep an existing canonical category. If missing or invalid, select one of: Authoritarianism; Government Corruption; Human Rights Violations; Grift / Financial Exploitation; National Security Violations; Foreign Policy; Election Interference; Press Freedom; Environmental Destruction; Conspiracy Theories / Disinformation.
- Preserve existing tags; add a few specific topic/person/organization tags where missing and supported by the text. Do not turn a routine business update into a finding of corruption because of its category.
- Score generation is outside this writing assignment.

## Output and resume

One JSON object per assigned record, written to a NEW file under your lane's `outputs/` directory. Never overwrite history or another worker's output.

Required keys: `record_id`, `entry_number` (null for new candidates), `status` (`complete` or `needs_context`), `title`, `description_short`, `description_medium`, `description_long`, `category`, `subcategory`, `topic_tags`, `people_tags`, `organization_tags`, `source_urls`, `preserved_fields`, `notes`.

For `complete`, all three descriptions must meet their limits; include preserved values too. For `needs_context`, keep all existing values and any newly written useful text; explain the specific missing context. No fake completion.

Process small batches of 10–20. Before writing, collect finished `record_id` values from your lane's existing outputs and skip them. Check every JSON line, IDs, length limits, preserved text, and URLs locally. Save after each batch. Update your lane's checkpoint using assigned IDs only, with completed/needs_context/remaining counts. Only your lane coordinator updates its checkpoint; native workers have individual checkpoints.

Work only on the assigned IDs. Frozen export and original historical outputs remain source material. Final database application is handled by the root coordinator.

Native workers own `worker-N-input.jsonl`, `outputs/worker-N-*.jsonl`, and `worker-N-checkpoint.json` only. They must not edit another worker's files or the shared lane checkpoint.
