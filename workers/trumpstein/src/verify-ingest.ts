import { buildVectorMetadata, planVectorBatch, prepareVectorDocument } from "./ingest";

function assert(condition: unknown, message: string): void {
  if (!condition) throw new Error(message);
}

function main(): void {
  const metadata = buildVectorMetadata({
    entry_number: 12,
    title: "A sourced archive record",
    synopsis: "A factual archive synopsis, not a fictional canon payload.",
    category: "Government Corruption",
    danger: 8,
    source_urls: ["notaurl", "https://", "https://example.org/primary"],
    sources: [{ url: "https://example.org/primary" }, { url: "https://example.org/secondary" }],
  });

  assert(metadata.source_url === "https://example.org/primary", "primary source URL should be retained");
  assert(metadata.source_urls.length === 2, "source URLs should dedupe and filter invalid values");
  assert(metadata.evidence_scope === "factual_archive", "metadata should label evidence scope");
  assert(metadata.fictional_canon === false, "metadata must not mark factual vectors as fictional canon");
  assert(metadata.claim_boundary === "archive_context_not_legal_finding", "metadata should preserve claim boundary");
  assert(!JSON.stringify(metadata).toLowerCase().includes("rathbone"), "metadata must not carry Rathbone canon");

  const sourceless = buildVectorMetadata({
    entry_number: 13,
    title: "A sourceless archive record",
    synopsis: "A record with no source URLs available in the ingest payload.",
    category: "Foreign Policy",
  });
  assert(sourceless.source_url === "", "sourceless metadata should be explicit");
  assert(sourceless.source_count === 0, "sourceless metadata should count zero sources");

  const prepared = prepareVectorDocument({
    entry_number: 14,
    title: "A richly summarized sourced archive record",
    synopsis: "Short summary.",
    medium_summary: "Medium summary with more context.",
    long_summary: "Long summary with the most complete context available for retrieval.",
    category: "Government Corruption",
    source_urls: ["https://example.org/source"],
    evidence_claims: [
      { claim: "Supported claim", source_url: "https://example.org/source" },
      { claim: "Unsupported claim", source_url: "https://invented.example/source" },
    ],
  });
  assert(prepared?.text.includes("Long summary"), "the richest summary layer should feed retrieval");
  assert(prepared?.text.includes("Supported claim"), "claims tied to supplied source URLs may feed retrieval");
  assert(!prepared?.text.includes("Unsupported claim"), "claims without supplied provenance must be excluded");
  assert(prepared?.metadata.summary_level === "long", "metadata should expose summary completeness");
  assert(prepared?.metadata.evidence_claim_count === 1, "metadata should count only source-backed claims");

  const fictional = prepareVectorDocument({
    entry_number: 15,
    title: "A fictional session-canon event",
    synopsis: "This must never enter factual retrieval.",
    category: "Satire",
    fictional_canon: true,
  });
  assert(fictional === null, "fictional canon must be rejected before Vectorize upsert");

  const rejected = prepareVectorDocument({
    entry_number: 16,
    title: "A rejected enrichment payload",
    synopsis: "This failed the enrichment quality gate.",
    category: "Government Corruption",
    quality_status: "rejected",
  });
  assert(rejected === null, "quality-gate rejects must be skipped before Vectorize upsert");

  const planned = planVectorBatch([
    { entry_number: 14, title: "Keep this factual vector", synopsis: "Factual.", category: "Foreign Policy" },
    { entry_number: 15, title: "Remove prior fictional vector", synopsis: "Fictional.", category: "Satire", fictional_canon: true },
    { entry_number: 16, title: "Remove prior rejected vector", synopsis: "Rejected.", category: "Government Corruption", quality_status: "rejected" },
  ]);
  assert(planned.documents.length === 1, "accepted documents should remain in the upsert plan");
  assert(planned.deleteIds.join(",") === "entry-15,entry-16", "rejected and fictional IDs must be scheduled for stale-vector deletion");

  console.log("verify-ingest: ok");
}

main();
