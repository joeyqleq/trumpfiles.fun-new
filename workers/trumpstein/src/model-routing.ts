import type { TurnRoute } from "./routing";

export const DEFAULT_CHAT_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

export interface ModelRoutingConfig {
  fastModel?: string | null;
  glmModel?: string | null;
}

export interface SelectedChatModel {
  model: string;
  fallbackModel: string;
  provider: "workers-ai-fast" | "configured-glm";
  reason: string;
}

export interface ChatModelRunResult<T> {
  response: T;
  model: string;
  usedFallback: boolean;
}

export function selectChatModel(
  route: Pick<TurnRoute, "intent" | "sourceRequest" | "shouldUseExa" | "retrievalPlan">,
  config: ModelRoutingConfig = {}
): SelectedChatModel {
  const fastModel = validModelName(config.fastModel) || DEFAULT_CHAT_MODEL;
  const glmModel = validModelName(config.glmModel);
  const wantsDeepModel = route.intent === "deep thematic"
    || (route.intent === "current news" && route.shouldUseExa)
    || (route.sourceRequest && route.shouldUseExa)
    || route.retrievalPlan.mode === "multi";

  if (glmModel && wantsDeepModel) {
    return {
      model: glmModel,
      fallbackModel: fastModel,
      provider: "configured-glm",
      reason: "configured GLM model for deep/current/source-seeking route",
    };
  }

  return {
    model: fastModel,
    fallbackModel: fastModel,
    provider: "workers-ai-fast",
    reason: glmModel ? "fast model route" : "GLM model not configured",
  };
}

function validModelName(value: string | null | undefined): string | null {
  return typeof value === "string" && value.trim().length > 3 ? value.trim() : null;
}

/**
 * Execute the selected model and retry the established fast model exactly once
 * when an optional deep-model route is unavailable. The injected runner keeps
 * provider behaviour testable without making live model calls.
 */
export async function runSelectedChatModel<T>(
  selection: SelectedChatModel,
  run: (model: string) => Promise<T>
): Promise<ChatModelRunResult<T>> {
  try {
    return {
      response: await run(selection.model),
      model: selection.model,
      usedFallback: false,
    };
  } catch (primaryError) {
    if (selection.model === selection.fallbackModel) throw primaryError;
    return {
      response: await run(selection.fallbackModel),
      model: selection.fallbackModel,
      usedFallback: true,
    };
  }
}

/**
 * Prime a streaming response before exposing it to the client. If an optional
 * deep model fails before its first byte, retry the established model without
 * risking duplicated partial output. Failures after output begins propagate;
 * replaying then would corrupt the transcript.
 */
export async function runSelectedStreamingChatModel(
  selection: SelectedChatModel,
  run: (model: string) => Promise<ReadableStream<Uint8Array>>
): Promise<ChatModelRunResult<ReadableStream<Uint8Array>>> {
  const initial = await runSelectedChatModel(selection, run);
  try {
    return { ...initial, response: await primeStream(initial.response) };
  } catch (primaryStreamError) {
    if (initial.usedFallback || initial.model === selection.fallbackModel) throw primaryStreamError;
    const fallback = await run(selection.fallbackModel);
    return {
      response: await primeStream(fallback),
      model: selection.fallbackModel,
      usedFallback: true,
    };
  }
}

async function primeStream(stream: ReadableStream<Uint8Array>): Promise<ReadableStream<Uint8Array>> {
  const reader = stream.getReader();
  let first: ReadableStreamReadResult<Uint8Array>;
  try {
    first = await reader.read();
  } catch (error) {
    await reader.cancel(error).catch(() => {});
    throw error;
  }
  if (first.done) {
    await reader.cancel("empty model stream").catch(() => {});
    throw new Error("empty model stream");
  }

  let firstPending = true;
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (firstPending) {
        firstPending = false;
        controller.enqueue(first.value);
        return;
      }
      try {
        const next = await reader.read();
        if (next.done) controller.close();
        else controller.enqueue(next.value);
      } catch (error) {
        controller.error(error);
      }
    },
    cancel(reason) {
      return reader.cancel(reason);
    },
  });
}
