import { createDefaultConversationState, normalizeConversationState, type ConversationState } from "./routing";
import {
  createDormantRathboneWorldState,
  parseRathboneWorldState,
  type RathboneWorldState,
} from "./rathbone";

export interface SessionStateEnvelope {
  version: 1;
  rathbone: RathboneWorldState;
  conversation: ConversationState;
}

export function createDefaultSessionState(): SessionStateEnvelope {
  return {
    version: 1,
    rathbone: createDormantRathboneWorldState(),
    conversation: createDefaultConversationState(),
  };
}

export function loadSessionState(raw: string | null | undefined): SessionStateEnvelope {
  if (!raw) return createDefaultSessionState();

  try {
    const parsed = JSON.parse(raw) as Partial<SessionStateEnvelope> & { conversation?: unknown; rathbone?: unknown };
    if (parsed && typeof parsed === "object" && "rathbone" in parsed) {
      return {
        version: 1,
        rathbone: parseRathboneWorldState(JSON.stringify(parsed.rathbone ?? createDormantRathboneWorldState())),
        conversation: normalizeConversationState(parsed.conversation),
      };
    }
  } catch {
    // Fall through to the legacy raw Rathbone JSON shape.
  }

  return {
    version: 1,
    rathbone: parseRathboneWorldState(raw),
    conversation: createDefaultConversationState(),
  };
}

export const parseSessionState = loadSessionState;

export function serializeSessionState(state: Pick<SessionStateEnvelope, "rathbone" | "conversation"> & Partial<Pick<SessionStateEnvelope, "version">>): string {
  return JSON.stringify({
    version: 1,
    rathbone: state.rathbone,
    conversation: state.conversation,
  });
}
