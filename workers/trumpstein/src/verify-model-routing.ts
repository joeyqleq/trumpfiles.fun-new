import { DEFAULT_CHAT_MODEL, runSelectedChatModel, runSelectedStreamingChatModel, selectChatModel } from "./model-routing";
import type { TurnRoute } from "./routing";

function assert(condition: unknown, message: string): void {
  if (!condition) throw new Error(message);
}

async function readAll(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let output = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) return output;
    output += decoder.decode(value, { stream: true });
  }
}

function route(overrides: Partial<TurnRoute> = {}): TurnRoute {
  const retrievalPlan = {
    mode: "single" as const,
    topK: 5,
    query: "query",
    subqueries: [],
    useExa: false,
    querySeed: "",
    rationale: "fixture",
  };
  return {
    intent: "corpus factual",
    secondaryIntents: [],
    entities: [],
    themes: [],
    timeSignals: [],
    currentness: "unspecified",
    referencesPreviousAnswer: false,
    referencesChip: false,
    rathboneThread: false,
    hostileTone: false,
    sourceRequest: false,
    questionLike: true,
    topicSummary: "",
    shouldUseExa: false,
    retrievalPlan,
    ...overrides,
  };
}

async function main(): Promise<void> {
  const fallback = selectChatModel(route({
    intent: "deep thematic",
    retrievalPlan: { ...route().retrievalPlan, mode: "multi", subqueries: ["a", "b"] },
  }));
  assert(fallback.model === DEFAULT_CHAT_MODEL, "unconfigured GLM must fall back to the existing model");
  assert(fallback.reason === "GLM model not configured", "fallback should state the blocker");

  const deep = selectChatModel(route({
    intent: "deep thematic",
    retrievalPlan: { ...route().retrievalPlan, mode: "multi", subqueries: ["a", "b"] },
  }), { glmModel: "@cf/zai-org/glm-5.2" });
  assert(deep.model === "@cf/zai-org/glm-5.2", "configured deep route should select GLM");
  assert(deep.fallbackModel === DEFAULT_CHAT_MODEL, "configured GLM keeps Llama fallback");

  const casual = selectChatModel(route({
    intent: "casual/persona",
    retrievalPlan: { ...route().retrievalPlan, mode: "none", topK: 0 },
  }), { glmModel: "@cf/zai-org/glm-5.2" });
  assert(casual.model === DEFAULT_CHAT_MODEL, "casual route should stay on fast model");

  const calls: string[] = [];
  const recovered = await runSelectedChatModel(deep, async (model) => {
    calls.push(model);
    if (model === deep.model) throw new Error("configured provider unavailable");
    return "fallback response";
  });
  assert(recovered.response === "fallback response", "runtime fallback should preserve the response");
  assert(recovered.model === DEFAULT_CHAT_MODEL, "runtime fallback should report the model actually used");
  assert(recovered.usedFallback, "runtime fallback should be observable");
  assert(calls.join(",") === `@cf/zai-org/glm-5.2,${DEFAULT_CHAT_MODEL}`, "runtime fallback should retry exactly once in order");

  const fastCalls: string[] = [];
  let fastFailurePreserved = false;
  try {
    await runSelectedChatModel(casual, async (model) => {
      fastCalls.push(model);
      throw new Error("fast model unavailable");
    });
  } catch (error) {
    fastFailurePreserved = error instanceof Error && error.message === "fast model unavailable";
  }
  assert(fastFailurePreserved, "the established model error should propagate without a retry loop");
  assert(fastCalls.length === 1, "the established model must not retry itself");

  const encoder = new TextEncoder();
  const streamCalls: string[] = [];
  const streamed = await runSelectedStreamingChatModel(deep, async (model) => {
    streamCalls.push(model);
    if (model === deep.model) {
      return new ReadableStream<Uint8Array>({ start(controller) { controller.error(new Error("failed before first byte")); } });
    }
    return new ReadableStream<Uint8Array>({ start(controller) { controller.enqueue(encoder.encode("fallback ")); controller.enqueue(encoder.encode("stream")); controller.close(); } });
  });
  const streamedText = await readAll(streamed.response);
  assert(streamedText === "fallback stream", "a pre-byte stream failure should recover through the established model");
  assert(streamed.usedFallback, "pre-byte stream fallback should be observable");
  assert(streamCalls.length === 2, "pre-byte stream failure should retry exactly once");

  const emptyCalls: string[] = [];
  const emptyRecovered = await runSelectedStreamingChatModel(deep, async (model) => {
    emptyCalls.push(model);
    if (model === deep.model) return new ReadableStream<Uint8Array>({ start(controller) { controller.close(); } });
    return new ReadableStream<Uint8Array>({ start(controller) { controller.enqueue(encoder.encode("fallback after empty")); controller.close(); } });
  });
  assert(await readAll(emptyRecovered.response) === "fallback after empty", "empty primary stream should fall back before exposing output");
  assert(emptyCalls.length === 2, "empty primary stream should retry exactly once");

  const midstreamCalls: string[] = [];
  const midstream = await runSelectedStreamingChatModel(deep, async (model) => {
    midstreamCalls.push(model);
    let sent = false;
    return new ReadableStream<Uint8Array>({
      pull(controller) {
        if (!sent) {
          sent = true;
          controller.enqueue(encoder.encode("partial"));
        } else {
          controller.error(new Error("failed after first byte"));
        }
      },
    });
  });
  let midstreamFailed = false;
  try {
    await readAll(midstream.response);
  } catch (error) {
    midstreamFailed = error instanceof Error && error.message === "failed after first byte";
  }
  assert(midstreamFailed, "midstream failure must propagate after output begins");
  assert(midstreamCalls.length === 1, "midstream failure must not replay through the fallback model");

  console.log("verify-model-routing: ok");
}

main();
