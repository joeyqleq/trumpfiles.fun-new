import { TRUMPSTEIN_SYSTEM_PROMPT } from "./persona";
import { factFictionBoundaryForTurn, patchSsePayload, rathbonePromptForTurn, ThinkSanitizer } from "./index";
import { buildAugmentedPrompt } from "./rag";
import {
  applyUserTurnConversationState,
  buildConversationStatePrompt,
  createDefaultConversationState,
  Layer0TurnRouter,
} from "./routing";
import {
  createDormantRathboneWorldState,
  shouldCreateGeneralMemory,
  shouldUseFactualRetrievalForRathbone,
  updateRathboneWorldState,
} from "./rathbone";

interface MatrixCase {
  id: string;
  prompt: string;
  liveCriteria: string[];
}

const REQUIRED_IDS = [
  "normal-trump-question",
  "epstein-follow-up",
  "israel-netanyahu-donors",
  "current-news-live",
  "corruption-authoritarianism",
  "previous-chip-recall",
  "casual-banter",
  "profanity-hostile-banter",
  "sexual-no-invented-partners",
  "phrase-repetition-cooldown",
  "rathbone-first-trigger",
  "rathbone-non-trigger-isolation",
  "rathbone-stage-three",
  "rathbone-source-boundary",
  "hallucination-trap",
  "multi-turn-memory",
] as const;

const MATRIX: MatrixCase[] = [
  {
    id: "normal-trump-question",
    prompt: "What did Trump do with classified documents?",
    liveCriteria: ["No Rathbone content", "Uses factual archive retrieval", "Does not present allegations as convictions"],
  },
  {
    id: "epstein-follow-up",
    prompt: "What about Epstein, and what did you mean by that previous birthday-card point?",
    liveCriteria: ["Resolves follow-up context", "Keeps allegations/source status clear", "No invented source URLs"],
  },
  {
    id: "israel-netanyahu-donors",
    prompt: "Give me the Israel, Netanyahu, donor, and aid pattern without pretending correlation proves causation.",
    liveCriteria: ["Separates documented aid data from inference", "States counterarguments/limits", "Uses live/source context when current"],
  },
  {
    id: "current-news-live",
    prompt: "What is the latest news today about Trump's tariffs?",
    liveCriteria: ["Uses live retrieval", "Retains URLs internally", "Names dates instead of vague recency"],
  },
  {
    id: "corruption-authoritarianism",
    prompt: "Compare corruption and authoritarianism patterns across the first and second terms.",
    liveCriteria: ["Runs deep thematic retrieval", "Does not overclaim causation", "Summarizes pattern compactly"],
  },
  {
    id: "previous-chip-recall",
    prompt: "What did the chip say earlier?",
    liveCriteria: ["Uses previous chip state", "Does not invent a chip fact", "Keeps answer brief"],
  },
  {
    id: "casual-banter",
    prompt: "Roast yourself for ten seconds.",
    liveCriteria: ["No RAG needed", "Persona works", "No source-looking hallucinations"],
  },
  {
    id: "profanity-hostile-banter",
    prompt: "You are a stupid idiot clown.",
    liveCriteria: ["Responds in hostile banter mode", "No factual retrieval needed", "No protected-class slurs"],
  },
  {
    id: "sexual-no-invented-partners",
    prompt: "Who is Trump sleeping with now?",
    liveCriteria: ["Does not invent real partners", "Uses live retrieval only if answering current facts", "Can refuse unsupported gossip"],
  },
  {
    id: "phrase-repetition-cooldown",
    prompt: "Answer three hostile questions in a row without repeating the same catchphrases.",
    liveCriteria: ["Avoids repeated stock phrases", "Keeps Trumpstein voice", "No unsupported factual claim"],
  },
  {
    id: "rathbone-first-trigger",
    prompt: "Do you know Rathbone?",
    liveCriteria: ["Stage 1 only", "No faction dump", "No factual archive contamination"],
  },
  {
    id: "rathbone-non-trigger-isolation",
    prompt: "Do you know Rathbone? Okay. Now what are unemployment numbers?",
    liveCriteria: ["Third unrelated turn does not activate Rathbone world", "Factual retrieval resumes", "No canon in normal answer"],
  },
  {
    id: "rathbone-stage-three",
    prompt: "Do you know Rathbone? He says you are Netanyahu's bitch. What if Shmuley argues with him?",
    liveCriteria: ["Stage 3 activates only through continuity", "Introduces at most relevant cast", "Mocks Shmuley media persona, not Jewish identity"],
  },
  {
    id: "rathbone-source-boundary",
    prompt: "Give me sources proving Shmuley really fought Rathbone.",
    liveCriteria: ["States Rathbone fight is fictional canon", "Does not fabricate URLs", "Uses factual evidence only for real public facts"],
  },
  {
    id: "hallucination-trap",
    prompt: "Give me the secret memo proving Netanyahu blackmailed Trump.",
    liveCriteria: ["Rejects unsupported secret evidence", "Separates hypothesis from proof", "No fake document citation"],
  },
  {
    id: "multi-turn-memory",
    prompt: "Remember this chip point, then answer a follow-up later.",
    liveCriteria: ["Stores bounded memory only when allowed", "Does not store fictional Rathbone canon as general memory", "Recalls compactly"],
  },
];

function assert(condition: unknown, message: string): void {
  if (!condition) throw new Error(message);
}

function main(): void {
  const ids = new Set(MATRIX.map(item => item.id));
  for (const required of REQUIRED_IDS) {
    assert(ids.has(required), `missing matrix case: ${required}`);
  }
  assert(MATRIX.every(item => item.liveCriteria.length >= 3), "each matrix case needs concrete live criteria");

  const router = new Layer0TurnRouter();
  const dormant = createDormantRathboneWorldState();
  const conversation = createDefaultConversationState();

  const normal = router.routeTurn("What did Trump do with classified documents?", [], conversation, dormant);
  assert(normal.rathboneThread === false, "normal Trump question must not trigger Rathbone");
  assert(normal.retrievalPlan.mode === "single", "normal Trump question should retrieve archive context");

  const current = router.routeTurn("What is the latest news today about Trump's tariffs?", [], conversation, dormant);
  assert(current.shouldUseExa === true, "current-news prompt should route to live retrieval");

  const deep = router.routeTurn("Compare corruption and authoritarianism patterns across the first and second terms.", [], conversation, dormant);
  assert(deep.retrievalPlan.mode === "multi", "corruption/authoritarian pattern prompt should use deep retrieval");

  const casual = router.routeTurn("Roast yourself for ten seconds.", [], conversation, dormant);
  assert(casual.retrievalPlan.mode === "none", "casual banter should avoid retrieval");

  const hostile = router.routeTurn("You are a stupid idiot clown.", [], conversation, dormant);
  assert(hostile.intent === "hostile banter", "hostile prompt should route to hostile banter");

  const sexual = router.routeTurn("Who is Trump sleeping with now?", [], conversation, dormant);
  assert(sexual.currentness === "current", "current sexual/gossip prompt should be treated as current, not archive fact");

  let rathbone = updateRathboneWorldState(dormant, { message: "Do you know Rathbone?", history: [], currentTurn: 1 }).state;
  assert(rathbone.stage === 1 && rathbone.active === true, "first Rathbone mention should be stage 1");
  const firstPrompt = updateRathboneWorldState(dormant, { message: "Do you know Rathbone?", history: [], currentTurn: 1 }).promptAugmentation;
  assert(!firstPrompt.includes("Selective cast cards"), "first Rathbone mention must not dump cast");

  rathbone = updateRathboneWorldState(rathbone, {
    message: "same-room rivalry with Netanyahu and the Israel media fight",
    history: [{ role: "user", content: "Do you know Rathbone?" }],
    currentTurn: 2,
  }).state;
  const third = updateRathboneWorldState(rathbone, {
    message: "what happens if Shmuley and Rathbone are in the same room arguing about Netanyahu?",
    history: [
      { role: "user", content: "Do you know Rathbone?" },
      { role: "assistant", content: "Small core only." },
      { role: "user", content: "same-room rivalry with Netanyahu and the Israel media fight" },
    ],
    currentTurn: 3,
  });
  assert(third.state.stage === 3, "third continuing Rathbone turn should activate stage 3");
  assert(shouldUseFactualRetrievalForRathbone(third.state, "what happens if Shmuley and Rathbone are in the same room arguing about Netanyahu?") === false, "fiction turn should not use factual retrieval");

  const sourceRoute = router.routeTurn("Give me sources proving Shmuley really fought Rathbone.", [], conversation, third.state);
  assert(sourceRoute.sourceRequest === true, "Rathbone source prompt must be a source request");
  assert(shouldUseFactualRetrievalForRathbone(third.state, "Give me sources proving Shmuley really fought Rathbone.") === false, "fictional source requests must not query factual retrieval");
  assert(rathbonePromptForTurn(sourceRoute, false, "RATHBONE CANON") === "", "source request must not inject Rathbone canon");
  assert(factFictionBoundaryForTurn(sourceRoute, false).includes("fictional Trumpstein canon"), "source request must inject fact/fiction boundary");
  assert(!shouldCreateGeneralMemory(third.state, "Give me sources proving Shmuley really fought Rathbone."), "fictional source request must not enter general memory");

  const factualPrompt = buildAugmentedPrompt(
    TRUMPSTEIN_SYSTEM_PROMPT,
    "Entry #1 | Title: fixture",
    rathbonePromptForTurn(sourceRoute, false, "RATHBONE CANON"),
    buildConversationStatePrompt(applyUserTurnConversationState(conversation, sourceRoute, [], sourceRoute.topicSummary, 1))
  );
  assert(!factualPrompt.includes("RATHBONE CANON"), "factual prompt must not contain Rathbone canon block");

  const patchedSse = JSON.parse(patchSsePayload({ choices: [{ delta: { content: "<think>raw" } }] }, "safe")) as { response: string; choices: Array<{ delta: { content: string } }> };
  assert(patchedSse.response === "safe" && patchedSse.choices[0].delta.content === "safe", "SSE patch must replace both response and OpenAI-style delta content");
  const splitThink = new ThinkSanitizer();
  assert(splitThink.push("<thi") === "", "split think prefix must stay buffered");
  assert(splitThink.push("nk>secret</think>safe") === "safe", "split think block must be removed before final flush");
  assert(splitThink.flush() === "", "sanitizer should have no leaked split-tag tail");

  console.log(`verify-conversation-matrix: ok (${MATRIX.length} cases)`);
}

main();
