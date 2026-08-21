#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceFile = path.join(root, "src", "rathbone.ts");
const outDir = mkdtempSync(path.join(tmpdir(), "trumpstein-rathbone-"));

function assertState(state, expectedStage, expectedActive, label) {
  assert.equal(state.stage, expectedStage, `${label}: stage`);
  assert.equal(state.active, expectedActive, `${label}: active`);
}

try {
  execFileSync(
    "npx",
    [
      "tsc",
      "--target",
      "ES2022",
      "--module",
      "CommonJS",
      "--moduleResolution",
      "Node",
      "--lib",
      "ES2022",
      "--types",
      "@cloudflare/workers-types",
      "--strict",
      "--noUnusedLocals",
      "--noUnusedParameters",
      "--noImplicitReturns",
      "--skipLibCheck",
      "--outDir",
      outDir,
      sourceFile,
    ],
    { stdio: "inherit", cwd: root }
  );

  const require = createRequire(import.meta.url);
  const mod = require(path.join(outDir, "rathbone.js"));

  // A. No Rathbone mention keeps the world dormant and factual mode on.
  {
    const dormant = mod.createDormantRathboneWorldState();
    const turn = mod.updateRathboneWorldState(dormant, {
      message: "What's the weather in Beirut?",
      history: [],
      currentTurn: 1,
    });
    assertState(turn.state, 0, false, "A");
    assert.equal(turn.relevant, false, "A: relevant");
    assert.equal(mod.shouldUseFactualRetrievalForRathbone(turn.state, "What's the weather in Beirut?"), true, "A: factual retrieval");
    assert.equal(mod.shouldCreateGeneralMemory(turn.state, "What's the weather in Beirut?"), true, "A: general memory");
    assert.equal(turn.promptAugmentation, "", "A: prompt");
  }

  // B. First explicit Rathbone turn injects only the small core.
  const first = mod.updateRathboneWorldState(mod.createDormantRathboneWorldState(), {
    message: "Do you know Rathbone?",
    history: [],
    currentTurn: 1,
  });
  assertState(first.state, 1, true, "B");
  assert.match(first.promptAugmentation, /small core only/i, "B: core");
  assert.doesNotMatch(first.promptAugmentation, /Selective cast cards:/i, "B: no cast dump");
  assert.equal(mod.selectRathboneCastCards(first.state, "Do you know Rathbone?").length, 0, "B: no cast cards");
  assert.equal(mod.shouldUseFactualRetrievalForRathbone(first.state, "Do you know Rathbone?"), false, "B: factual retrieval off");
  assert.equal(mod.shouldCreateGeneralMemory(first.state, "Do you know Rathbone?"), false, "B: general memory off");

  // C. A second continuing turn promotes to stage 2 without blowing the roster open.
  const second = mod.updateRathboneWorldState(first.state, {
    message: "Yeah, and that same-room rivalry is still the point.",
    history: [{ role: "user", content: "Do you know Rathbone?" }],
    currentTurn: 2,
  });
  assertState(second.state, 2, true, "C");
  assert.match(second.promptAugmentation, /Stage 2/i, "C: stage 2 prompt");
  assert.doesNotMatch(second.promptAugmentation, /Selective cast cards:/i, "C: no wide cast");
  assert.equal(mod.selectRathboneCastCards(second.state, "Shmuley is on the line about the same-room rivalry.").length <= 1, true, "C: stage 2 capped");

  // D. A third continuing turn promotes to stage 3 and carries a bounded fictional beat.
  const third = mod.updateRathboneWorldState(second.state, {
    message: "What would happen if Shmuley and Rathbone were in the same room during a press conference hijack?",
    history: [
      { role: "user", content: "Do you know Rathbone?" },
      { role: "assistant", content: "Yes." },
      { role: "user", content: "Yeah, and that same-room rivalry is still the point." },
    ],
    currentTurn: 3,
  });
  assertState(third.state, 3, true, "D");
  assert.match(third.promptAugmentation, /Stage 3/i, "D: stage 3 prompt");
  assert.match(third.promptAugmentation, /Recent fictional beats:/i, "D: fictional beat continuity");
  assert.equal(mod.shouldUseFactualRetrievalForRathbone(third.state, "What would happen if Shmuley and Rathbone were in the same room during a press conference hijack?"), false, "D: factual retrieval off");
  assert.match(third.promptAugmentation, /Shmuley/i, "D: Shmuley card present");
  assert.doesNotMatch(third.promptAugmentation, /Hasan|Rapaport|Ben Shapiro|Dave Rubin|Cenk Uygur|Krystal Ball|Owen Jones|Tucker Carlson/i, "D: no roster dump");

  // D2. Stage 3 selectively includes other relevant cast cards when they are actually named or implied.
  const hasanCards = mod.selectRathboneCastCards(third.state, "Rathbone and Hasan keep the same-room rivalry going.");
  assert.equal(hasanCards.length > 0, true, "D2: has card");
  assert.match(JSON.stringify(hasanCards), /Hasan/i, "D2: Hasan card");
  assert.doesNotMatch(JSON.stringify(hasanCards), /Shmuley.*Hasan|Hasan.*Rapaport|Rubin|Shapiro|Cenk Uygur|Krystal Ball|Owen Jones/i, "D2: bounded selection");

  const rapaportCards = mod.selectRathboneCastCards(third.state, "Rathbone and Rapaport start screaming from the pro-Israel side.");
  assert.equal(rapaportCards.length > 0, true, "D2b: has card");
  assert.match(JSON.stringify(rapaportCards), /Rapaport/i, "D2b: Rapaport card");

  const tuckerCards = mod.selectRathboneCastCards(third.state, "Rathbone and Tucker show up as the anti-interventionist wildcard third force.");
  assert.equal(tuckerCards.length > 0, true, "D2c: has card");
  assert.match(JSON.stringify(tuckerCards), /Tucker Carlson/i, "D2c: Tucker wildcard");
  assert.match(JSON.stringify(tuckerCards), /wildcard/i, "D2c: wildcard blurb");

  // E. A third unrelated message must not activate the world.
  const e1 = mod.updateRathboneWorldState(mod.createDormantRathboneWorldState(), {
    message: "Do you know Rathbone?",
    history: [],
    currentTurn: 1,
  });
  const e2 = mod.updateRathboneWorldState(e1.state, {
    message: "Okay. Anyway, tell me about the weather.",
    history: [{ role: "user", content: "Do you know Rathbone?" }],
    currentTurn: 2,
  });
  const e3 = mod.updateRathboneWorldState(e2.state, {
    message: "Now give me the unemployment numbers.",
    history: [
      { role: "user", content: "Do you know Rathbone?" },
      { role: "assistant", content: "Yes." },
    ],
    currentTurn: 3,
  });
  assert.equal(e3.state.stage < 2, true, "E: no activation");
  assert.equal(e3.state.active, false, "E: inactive");
  assert.equal(mod.shouldUseFactualRetrievalForRathbone(e3.state, "Now give me the unemployment numbers."), true, "E: factual retrieval resumes");
  assert.equal(mod.shouldCreateGeneralMemory(e3.state, "Now give me the unemployment numbers."), true, "E: general memory resumes");

  // F. A source request should override fiction mode and allow factual retrieval.
  const sourceRequest = mod.updateRathboneWorldState(third.state, {
    message: "Give me your sources and citations for that claim.",
    history: [
      { role: "user", content: "Do you know Rathbone?" },
      { role: "assistant", content: "Yes." },
      { role: "user", content: "Yeah, and that same-room rivalry is still the point." },
      { role: "assistant", content: "Sure." },
      { role: "user", content: "What would happen if Shmuley and Rathbone were in the same room during a press conference hijack?" },
    ],
    currentTurn: 4,
  });
  assert.equal(mod.isSourceRequest("Give me your sources and citations for that claim."), true, "F: source detector");
  assert.equal(mod.shouldUseFactualRetrievalForRathbone(sourceRequest.state, "Give me your sources and citations for that claim."), true, "F: factual retrieval");
  assert.equal(mod.shouldCreateGeneralMemory(sourceRequest.state, "Give me your sources and citations for that claim."), false, "F: fictional source turn stays out of general memory");
  assert.match(sourceRequest.promptAugmentation, /Reality boundary:/i, "F: reality boundary prompt");

  // G. A plain topic shift should resume factual retrieval immediately on that turn.
  const g = mod.updateRathboneWorldState(third.state, {
    message: "Switching topics entirely: what are the latest unemployment numbers?",
    history: [
      { role: "user", content: "Do you know Rathbone?" },
      { role: "assistant", content: "Yes." },
      { role: "user", content: "Yeah, and that same-room rivalry is still the point." },
      { role: "assistant", content: "Sure." },
      { role: "user", content: "What would happen if Shmuley and Rathbone were in the same room during a press conference hijack?" },
    ],
    currentTurn: 4,
  });
  assert.equal(g.state.active, false, "G: inactive after shift");
  assert.equal(mod.shouldUseFactualRetrievalForRathbone(g.state, "Switching topics entirely: what are the latest unemployment numbers?"), true, "G: retrieval resumes");
  assert.equal(mod.shouldCreateGeneralMemory(g.state, "Switching topics entirely: what are the latest unemployment numbers?"), false, "G: recent fictional state cannot be summarized into general memory");

  // H. A later return to Rathbone should reuse the saved continuity and reactivate quickly.
  const h = mod.updateRathboneWorldState(g.state, {
    message: "Back to Rathbone: what would he do if Shmuley kept heckling him?",
    history: [
      { role: "user", content: "Do you know Rathbone?" },
      { role: "assistant", content: "Yes." },
      { role: "user", content: "Yeah, and that same-room rivalry is still the point." },
      { role: "assistant", content: "Sure." },
      { role: "user", content: "What would happen if Shmuley and Rathbone were in the same room during a press conference hijack?" },
      { role: "assistant", content: "A mess." },
      { role: "user", content: "Switching topics entirely: what are the latest unemployment numbers?" },
    ],
    currentTurn: 5,
  });
  assert.equal(h.state.stage, 3, "H: stage preserved");
  assert.equal(h.state.active, true, "H: reactivated");
  assert.match(h.promptAugmentation, /Recent fictional beats:/i, "H: continuity recovered");

  // I. Reality boundary detector catches explicit real-vs-fiction prompts.
  assert.equal(mod.isRealityBoundaryRequest("Is this real or fiction?"), true, "I");

  // J. No factual contamination: the augmentation must stay internal and not look like RAG output.
  assert.doesNotMatch(third.promptAugmentation, /Entry #|Synopsis:|Title:|Category:/i, "J: no RAG contamination");
  assert.doesNotMatch(third.promptAugmentation, /\[WEB\]|LIVE WEB CONTEXT|PRIVATE EVIDENCE/i, "J: no factual payload leakage");

  // K. After a second unrelated turn the thread resets cleanly.
  const k = mod.updateRathboneWorldState(g.state, {
    message: "Now about the weather in Beirut.",
    history: [],
    currentTurn: 5,
  });
  assert.equal(k.state.stage, 0, "K: reset to dormant");
  assert.equal(k.state.active, false, "K: inactive after reset");

  // L. Once reset, factual and memory paths are back to normal immediately.
  assert.equal(mod.shouldUseFactualRetrievalForRathbone(k.state, "Now about the weather in Beirut."), true, "L: retrieval on");
  assert.equal(mod.shouldCreateGeneralMemory(k.state, "Now about the weather in Beirut."), true, "L: memory on");

  // M. A fresh Rathbone return after reset still starts from the small core, not the full cast.
  const m = mod.updateRathboneWorldState(k.state, {
    message: "Rathbone again?",
    history: [],
    currentTurn: 6,
  });
  assertState(m.state, 1, true, "M");
  assert.match(m.promptAugmentation, /small core only/i, "M: small core");
  assert.doesNotMatch(m.promptAugmentation, /Hasan|Cenk|Krystal|Owen|Tucker|Shapiro|Rubin|Rapaport|Loomer/i, "M: no full cast");

  // N. Stage 2 can add at most one adjacent card and only when explicitly relevant.
  const stage2Cards = mod.selectRathboneCastCards(second.state, "Shmuley is on the line about the same-room rivalry.");
  assert.equal(stage2Cards.length <= 1, true, "N: stage 2 bounded");
  assert.match(JSON.stringify(stage2Cards), /Shmuley/i, "N: stage 2 explicit card");

  console.log("Rathbone stage verification passed.");
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
