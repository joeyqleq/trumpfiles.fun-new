
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error("DATABASE_URL not found!");
    process.exit(1);
}

const sql = neon(databaseUrl);

// Enhanced Keywords for Scoring
const DANGER_KEYWORDS: Record<string, number> = {
    // Tier 1: Existential/Violent Threats (Base + 7)
    "nuclear": 10, "nuke": 10, "war": 9, "kill": 9, "die": 9, "dead": 9, "execution": 9, "assassinate": 9, "blood": 8,
    "insurrection": 10, "coup": 10, "treason": 9, "militia": 8, "terror": 8, "enemy of the people": 9,
    "vermin": 9, "poison": 8, "fascist": 8, "dictator": 8, "authoritarian": 7, "martial law": 9,

    // Tier 2: Physical/Legal Aggression (Base + 5)
    "attack": 7, "assault": 7, "violence": 7, "weapon": 7, "fight": 6, "riot": 7, "storm": 6,
    "prison": 6, "jail": 6, "arrest": 6, "prosecute": 6, "retribution": 7, "revenge": 7,

    // Tier 3: Rhetorical/Political Danger (Base + 3)
    "threat": 5, "warn": 4, "risk": 4, "harm": 5, "damage": 4, "destroy": 5,
    "ban": 4, "deport": 5, "wall": 4, "separation": 5, "cage": 6,
    "conspiracy": 4, "lie": 3, "fraud": 4, "rigged": 5, "steal": 4,
    "racist": 6, "sexist": 5, "misogyny": 5, "hate": 6, "supremacist": 7
};

const ABSURDITY_KEYWORDS: Record<string, number> = {
    // Tier 1: Pure Nonsense/Bizarre (Base + 7)
    "covfefe": 10, "hamberder": 9, "bleach": 10, "inject": 9, "light": 8, "windmill": 9, "cancer": 8,
    "sharpie": 10, "hurricane": 9, "nuke": 8, "toilet": 9, "flush": 9, "shower": 8,
    "shark": 9, "battery": 9, "hannibal": 9, "lecter": 9, "bacon": 7,

    // Tier 2: Ego/Performance (Base + 5)
    "tweet": 6, "caps": 6, "rant": 6, "all caps": 7, "truth social": 5,
    "golf": 6, "rating": 6, "crowd size": 7, "nobel": 7, "time magazine": 6,
    "hair": 6, "tan": 6, "orange": 5, "makeup": 6, "shoe": 5, "ramp": 7, "water": 6,

    // Tier 3: General Weirdness (Base + 3)
    "joke": 4, "mock": 4, "clown": 5, "stupid": 4, "low iq": 5, "dog": 5, "pig": 5, "slob": 5,
    "bizarre": 5, "weird": 5, "strange": 5, "sleepy": 4, "crooked": 4, "crazy": 4
};

function calculateScore(text: string, category: string): { danger: number, absurdity: number, lawlessness: number } {
    const lowerText = text.toLowerCase();

    // Adjusted Baselines based on the user's "Real World" expectation
    // Even a "neutral" Trump event usually carries some baseline variance.
    let danger = 3;
    let absurdity = 3;
    let lawlessness = 2;

    // Category modifiers
    if (category?.toLowerCase().includes("rhetoric") || category?.toLowerCase().includes("speech")) {
        absurdity += 2; // Speeches are usually absurd
        danger += 1; // And often dangerous
    }
    if (category?.toLowerCase().includes("crime") || category?.toLowerCase().includes("legal")) {
        lawlessness += 3;
        danger += 2;
    }
    if (category?.toLowerCase().includes("violence") || category?.toLowerCase().includes("conflict")) {
        danger += 4;
    }

    // Cumulative Scoring for Danger
    // Instead of just taking the max, we look for multiple signals.
    // Hit a Tier 1 keyword? +3 points. Tier 2? +2. etc.
    let dangerHits = 0;
    let maxKeywordScore = 0;

    for (const [word, weight] of Object.entries(DANGER_KEYWORDS)) {
        if (lowerText.includes(word)) {
            dangerHits++;
            if (weight > maxKeywordScore) maxKeywordScore = weight;

            // Add weight to score but dampen it
            danger += weight * 0.3;
        }
    }
    // Ensure if we hit a REALLY bad word, we at least respect its weight
    danger = Math.max(danger, maxKeywordScore);

    // Absurdity Logic
    let absurdityHits = 0;
    let maxAbsurdityScore = 0;

    for (const [word, weight] of Object.entries(ABSURDITY_KEYWORDS)) {
        if (lowerText.includes(word)) {
            absurdityHits++;
            if (weight > maxAbsurdityScore) maxAbsurdityScore = weight;
            absurdity += weight * 0.3;
        }
    }
    absurdity = Math.max(absurdity, maxAbsurdityScore);

    // Lawlessness (Contextual)
    if (["indict", "guilt", "convict", "crime", "illegal", "lawsuit", "judge", "court", "subpoena", "fraud", "felony", "prison"].some(k => lowerText.includes(k))) {
        lawlessness = Math.max(lawlessness, 8);
    } else if (["sued", "investig", "probe", "rule", "law", "violate", "fine", "doj", "fbi"].some(k => lowerText.includes(k))) {
        lawlessness = Math.max(lawlessness, 6);
    }

    // Cap at 10
    return {
        danger: Math.min(10, Math.round(danger)),
        absurdity: Math.min(10, Math.round(absurdity)),
        lawlessness: Math.min(10, Math.round(lawlessness))
    };
}

async function main() {
    console.log("Starting advanced re-scoring process...");

    while (true) {
        // Get entries that are likely under-scored (using 3 as the cutoff to catch the 2s)
        const entries = await sql`
      SELECT entry_number, title, synopsis, category
      FROM ai_complete_trump_data 
      WHERE danger <= 2
      LIMIT 100
    `;

        if (entries.length === 0) {
            console.log("No more under-scored entries found. Done!");
            break;
        }

        console.log(`Processing batch of ${entries.length} entries...`);

        const updatePromises = entries.map(async (entry) => {
            const text = `${entry.title} ${entry.synopsis}`;
            const scores = calculateScore(text, entry.category);

            // Calculate derived scores
            const insanity = Math.max(scores.danger, scores.absurdity);

            // Check if score record exists
            const existing = await sql`SELECT score_id FROM trump_individual_scores WHERE entry_number = ${entry.entry_number}`;

            if (existing.length > 0) {
                // Update
                return sql`
          UPDATE trump_individual_scores 
          SET 
            danger = ${scores.danger}, 
            absurdity = ${scores.absurdity},
            lawlessness = ${scores.lawlessness},
            insanity = ${insanity},
            authoritarianism = ${Math.max(1, Math.round(scores.danger * 0.8))},
            impact_scope = ${Math.max(1, Math.round(scores.danger * 0.9))},
            recency_intensity = 5,
            credibility_risk = 1
          WHERE entry_number = ${entry.entry_number}
        `;
            } else {
                // Insert
                return sql`
          INSERT INTO trump_individual_scores 
          (entry_number, danger, absurdity, lawlessness, insanity, authoritarianism, impact_scope, recency_intensity, credibility_risk)
          VALUES 
          (${entry.entry_number}, ${scores.danger}, ${scores.absurdity}, ${scores.lawlessness}, ${insanity}, 
           ${Math.max(1, Math.round(scores.danger * 0.8))}, 
           ${Math.max(1, Math.round(scores.danger * 0.9))}, 
           5, 1)
        `;
            }
        });

        await Promise.all(updatePromises);

        console.log(`Batch complete.`);
        // Small pause to be safe
        await new Promise(r => setTimeout(r, 500));
    }
}

main().catch(console.error);
