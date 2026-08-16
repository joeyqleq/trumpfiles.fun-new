import type { Ai, Vectorize } from "@cloudflare/workers-types";

export interface RagResult {
  context: string;
  entryNumbers: number[];
}

export async function ragQuery(
  query: string,
  ai: Ai,
  vectorize: Vectorize,
  topK = 5
): Promise<RagResult> {
  // Embed the user query
  const embedResult = await ai.run("@cf/baai/bge-small-en-v1.5", {
    text: [query],
  });

  const queryVector = (embedResult as { data: number[][] }).data[0];

  // Search Vectorize for nearest neighbors
  const matches = await vectorize.query(queryVector, {
    topK,
    returnMetadata: "all",
  });

  if (!matches.matches || matches.matches.length === 0) {
    return { context: "", entryNumbers: [] };
  }

  const entryNumbers: number[] = [];
  const contextChunks: string[] = [];

  for (const match of matches.matches) {
    if (match.score < 0.45) continue;

    const meta = match.metadata as Record<string, unknown> | undefined;
    if (!meta) continue;

    const entryNumber = meta.entry_number as number | undefined;
    const title = meta.title as string | undefined;
    const synopsis = meta.synopsis as string | undefined;
    const category = meta.category as string | undefined;
    const dangerScore = meta.danger as number | undefined;

    if (entryNumber) entryNumbers.push(entryNumber);

    const chunk = [
      entryNumber ? `Entry #${entryNumber}` : null,
      title ? `Title: ${title}` : null,
      category ? `Category: ${category}` : null,
      dangerScore != null ? `Danger Score: ${dangerScore}/10` : null,
      synopsis ? `Synopsis: ${synopsis}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    if (chunk) contextChunks.push(chunk);
  }

  return {
    context: contextChunks.join("\n\n"),
    entryNumbers,
  };
}

export function buildAugmentedPrompt(
  systemPrompt: string,
  ragContext: string
): string {
  if (!ragContext) return systemPrompt;

  return `${systemPrompt}

PRIVATE EVIDENCE (internal only — you know this, but you do NOT list it):
${ragContext}

RAG RULE: The above entries inform what you know. You may use at most ONE as a [CHIP OVERRIDE] glitch if it is directly relevant and genuinely funny/useful. Do not enumerate these entries. Do not summarize them. Do not mention entry numbers unless the user explicitly asks for sources.`;
}
