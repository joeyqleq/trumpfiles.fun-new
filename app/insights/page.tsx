import { sql } from "@/lib/neonClient";
import InsightsClient from "./InsightsClient";

export const revalidate = 3600;

export const metadata = {
  title: "Insights — The Making of a Threat",
  description: "A narrative data investigation into 60+ years of documented Trump misconduct, told through forensic visualizations.",
};

const EMPTY_INSIGHTS_DATA = {
  loadError: true,
  totals: { total: 0, avg_danger: 0, avg_auth: 0, avg_lawless: 0, peak_danger: 0 },
  timeline: [],
  categories: [],
  escalation: [],
  humanRights: [],
  violentRhetoric: [],
  yearlyAcceleration: [],
  topKeywords: [],
  radarDimensions: {},
  iranWar: [],
  israelDedication: [],
  lieMeter: [],
  legalBattles: [],
  pardons: [],
  epsteinConnection: [],
  peopleTagFrequency: [],
  categoryYearMatrix: [],
  scoreDistribution: [],
  familyOrbitEntries: [],
  topCooccurrences: [],
  recentEntries: [],
  wordCloudByEra: [],
  networkEdges: [],
  legalBattlesData: [],
  pressureMatrix: [],
};

async function getInsightsData() {
  try {
    const [totals] = await sql`
    SELECT COUNT(*) as total,
      AVG(danger)::float8 as avg_danger,
      AVG(authoritarianism)::float8 as avg_auth,
      AVG(lawlessness)::float8 as avg_lawless,
      MAX(danger)::float8 as peak_danger
    FROM ai_complete_trump_data
  `;

  const timeline = await sql`
    SELECT
      EXTRACT(YEAR FROM date_start::date)::int as year,
      COUNT(*)::int as count,
      AVG(danger)::float8 as avg_danger,
      AVG(authoritarianism)::float8 as avg_auth,
      AVG(absurdity)::float8 as avg_absurdity
    FROM ai_complete_trump_data
    WHERE date_start IS NOT NULL AND EXTRACT(YEAR FROM date_start::date) >= 1970
    GROUP BY EXTRACT(YEAR FROM date_start::date)
    ORDER BY year
  `;

  const categories = await sql`
    SELECT category, COUNT(*)::int as count,
      AVG(danger)::float8 as avg_danger,
      AVG(impact_scope)::float8 as avg_impact
    FROM ai_complete_trump_data
    GROUP BY category
    ORDER BY count DESC
    LIMIT 12
  `;

  const escalation = await sql`
    SELECT
      CASE
        WHEN EXTRACT(YEAR FROM date_start::date) < 2015 THEN 'Pre-Political'
        WHEN EXTRACT(YEAR FROM date_start::date) BETWEEN 2015 AND 2016 THEN 'Campaign'
        WHEN EXTRACT(YEAR FROM date_start::date) BETWEEN 2017 AND 2020 THEN 'First Term'
        WHEN EXTRACT(YEAR FROM date_start::date) BETWEEN 2021 AND 2024 THEN 'Between Terms'
        ELSE 'Second Term'
      END as era,
      COUNT(*)::int as count,
      AVG(danger)::float8 as avg_danger,
      AVG(authoritarianism)::float8 as avg_auth,
      AVG(lawlessness)::float8 as avg_lawless
    FROM ai_complete_trump_data
    WHERE date_start IS NOT NULL
    GROUP BY era
    ORDER BY MIN(date_start)
  `;

  const humanRights = await sql`
    SELECT entry_number, title, danger::float8 AS danger,
      TO_CHAR(date_start::date, 'YYYY-MM-DD') AS date_start
    FROM ai_complete_trump_data
    WHERE category = 'Human Rights Violations' AND danger >= 8
    ORDER BY danger DESC, date_start DESC
    LIMIT 10
  `;

  const violentRhetoric = await sql`
    SELECT entry_number, title, danger::float8 AS danger, insanity::float8 AS insanity,
      TO_CHAR(date_start::date, 'YYYY-MM-DD') AS date_start
    FROM ai_complete_trump_data
    WHERE category IN ('Violent Rhetoric / Threats', 'Insurrection / Coup Attempts')
    ORDER BY danger DESC
    LIMIT 10
  `;

  const yearlyAcceleration = await sql`
    SELECT
      EXTRACT(YEAR FROM date_start::date)::int as year,
      COUNT(*)::int as count
    FROM ai_complete_trump_data
    WHERE date_start IS NOT NULL AND EXTRACT(YEAR FROM date_start::date) >= 2016
    GROUP BY EXTRACT(YEAR FROM date_start::date)
    ORDER BY year
  `;

  const topKeywords = await sql`
    SELECT kw as keyword, COUNT(*)::int as freq
    FROM ai_complete_trump_data, UNNEST(all_keywords) AS kw
    WHERE kw IS NOT NULL AND LENGTH(kw) > 4
      AND kw NOT IN ('donald trump', 'evidence', 'documented', 'source')
    GROUP BY kw
    ORDER BY freq DESC
    LIMIT 20
  `;

  const radarDimensions = await sql`
    SELECT
      AVG(danger)::float8 as danger,
      AVG(authoritarianism)::float8 as authoritarianism,
      AVG(lawlessness)::float8 as lawlessness,
      AVG(insanity)::float8 as insanity,
      AVG(absurdity)::float8 as absurdity,
      AVG(credibility_risk)::float8 as credibility_risk,
      AVG(impact_scope)::float8 as impact_scope
    FROM ai_complete_trump_data
  `;

  const iranWar = await sql`
    SELECT
      CASE
        WHEN EXTRACT(YEAR FROM date_start::date) BETWEEN 2017 AND 2020 THEN 'First Term'
        WHEN EXTRACT(YEAR FROM date_start::date) BETWEEN 2025 AND 2026 THEN 'Second Term'
        ELSE 'Between Terms'
      END as era,
      COUNT(*)::int as count,
      AVG(danger)::float8 as avg_danger
    FROM ai_complete_trump_data
    WHERE (LOWER(title) LIKE '%iran%' OR LOWER(synopsis) LIKE '%iran%'
      OR EXISTS (SELECT 1 FROM UNNEST(all_keywords) k WHERE LOWER(k) LIKE '%iran%'))
      AND date_start IS NOT NULL
    GROUP BY era
    ORDER BY MIN(date_start)
  `;

  const israelDedication = await sql`
    SELECT entry_number, title, danger::float8 AS danger,
      TO_CHAR(date_start::date, 'YYYY-MM-DD') AS date_start, category
    FROM ai_complete_trump_data
    WHERE (LOWER(title) LIKE '%israel%' OR LOWER(synopsis) LIKE '%israel%'
      OR LOWER(synopsis) LIKE '%netanyahu%' OR LOWER(synopsis) LIKE '%adelson%')
    ORDER BY date_start DESC
    LIMIT 15
  `;

  const lieMeter = await sql`
    SELECT
      EXTRACT(YEAR FROM date_start::date)::int as year,
      COUNT(*)::int as lies
    FROM ai_complete_trump_data
    WHERE (LOWER(title) LIKE '%lie%' OR LOWER(title) LIKE '%false%'
      OR LOWER(title) LIKE '%claim%' OR LOWER(title) LIKE '%disinformation%'
      OR LOWER(category) LIKE '%conspiracy%' OR LOWER(category) LIKE '%disinformation%')
      AND date_start IS NOT NULL AND EXTRACT(YEAR FROM date_start::date) >= 2015
    GROUP BY EXTRACT(YEAR FROM date_start::date)
    ORDER BY year
  `;

  const pardons = await sql`
    SELECT entry_number, title, TO_CHAR(date_start::date, 'YYYY-MM-DD') AS date_start,
      danger::float8 AS danger, category
    FROM ai_complete_trump_data
    WHERE (LOWER(title) LIKE '%pardon%' OR LOWER(title) LIKE '%commut%')
      AND date_start IS NOT NULL
      AND entry_number != 4031
    ORDER BY date_start DESC
    LIMIT 20
  `;

  const epsteinConnection = await sql`
    SELECT entry_number, title, TO_CHAR(date_start::date, 'YYYY-MM-DD') AS date_start,
      danger::float8 AS danger, category
    FROM ai_complete_trump_data
    WHERE (LOWER(title) LIKE '%epstein%' OR LOWER(synopsis) LIKE '%epstein%')
      AND date_start IS NOT NULL
    ORDER BY danger DESC, date_start DESC
    LIMIT 15
  `;

  const legalBattles = await sql`
    SELECT
      CASE
        WHEN EXTRACT(YEAR FROM date_start::date) < 2017 THEN 'Pre-Presidency'
        WHEN EXTRACT(YEAR FROM date_start::date) BETWEEN 2017 AND 2020 THEN 'First Term'
        WHEN EXTRACT(YEAR FROM date_start::date) BETWEEN 2021 AND 2024 THEN 'Between Terms'
        ELSE 'Second Term'
      END as era,
      COUNT(*)::int as count
    FROM ai_complete_trump_data
    WHERE (LOWER(title) LIKE '%lawsuit%' OR LOWER(title) LIKE '%indictment%'
      OR LOWER(title) LIKE '%trial%' OR LOWER(title) LIKE '%impeach%'
      OR LOWER(title) LIKE '%conviction%' OR LOWER(title) LIKE '%charged%'
      OR LOWER(category) LIKE '%election interference%')
      AND date_start IS NOT NULL
    GROUP BY era
    ORDER BY MIN(date_start)
  `;

  const wordCloudByEra = await sql`
    SELECT
      CASE
        WHEN EXTRACT(YEAR FROM date_start::date) < 2015 THEN 'Pre-Political'
        WHEN EXTRACT(YEAR FROM date_start::date) BETWEEN 2015 AND 2016 THEN 'Campaign'
        WHEN EXTRACT(YEAR FROM date_start::date) BETWEEN 2017 AND 2020 THEN 'First Term'
        WHEN EXTRACT(YEAR FROM date_start::date) BETWEEN 2021 AND 2024 THEN 'Between Terms'
        ELSE 'Second Term'
      END as era,
      kw as keyword,
      COUNT(*)::int as freq
    FROM ai_complete_trump_data, UNNEST(all_keywords) AS kw
    WHERE kw IS NOT NULL AND LENGTH(kw) > 4
      AND kw NOT IN ('donald trump', 'evidence', 'documented', 'source', 'trump', 'president')
      AND date_start IS NOT NULL
    GROUP BY era, kw
    ORDER BY era, freq DESC
  `;

  const pressureMatrix = await sql`
    SELECT
      category,
      CASE
        WHEN EXTRACT(YEAR FROM date_start::date) BETWEEN 2017 AND 2020 THEN 'First Term'
        WHEN EXTRACT(YEAR FROM date_start::date) BETWEEN 2025 AND 2026 THEN 'Second Term'
        ELSE NULL
      END as era,
      COUNT(*)::int as count,
      AVG(danger)::float8 as avg_danger
    FROM ai_complete_trump_data
    WHERE date_start IS NOT NULL
      AND EXTRACT(YEAR FROM date_start::date) IN (2017,2018,2019,2020,2025,2026)
    GROUP BY category, era
    HAVING COUNT(*) >= 3
    ORDER BY count DESC
  `;

  const networkEdges = await sql`
    SELECT
      kw as person,
      category,
      COUNT(*)::int as mentions,
      AVG(danger)::float8 as avg_danger
    FROM ai_complete_trump_data, UNNEST(all_keywords) AS kw
    WHERE kw IN (
      'epstein', 'maxwell', 'netanyahu', 'putin', 'bannon', 'musk',
      'kushner', 'ivanka', 'giuliani', 'barr', 'pence', 'mcconnell',
      'desantis', 'rfk', 'hegseth', 'bondi', 'patel', 'miller',
      'loomer', 'flynn', 'stone', 'meadows', 'eastman'
    )
    GROUP BY kw, category
    HAVING COUNT(*) >= 2
    ORDER BY mentions DESC
  `;

  // ── NEW EXHIBITS ─────────────────────────────────────────────────────────────

  const peopleTagFrequency = await sql`
    SELECT
      person,
      COUNT(*)::int AS count
    FROM trump_entries,
      LATERAL UNNEST(people_tags) AS person
    WHERE person IS NOT NULL AND person <> ''
    GROUP BY person
    ORDER BY count DESC
    LIMIT 30
  `;

  const categoryYearMatrix = await sql`
    SELECT
      te.category,
      EXTRACT(YEAR FROM te.date_start)::int AS year,
      COUNT(*)::int AS count,
      AVG(tis.danger)::float8 AS avg_danger
    FROM trump_entries te
    JOIN trump_individual_scores tis ON te.entry_number = tis.entry_number
    WHERE EXTRACT(YEAR FROM te.date_start) BETWEEN 2015 AND 2026
      AND te.category IS NOT NULL
      AND te.date_start IS NOT NULL
    GROUP BY te.category, EXTRACT(YEAR FROM te.date_start)
    ORDER BY te.category, year
  `;

  const scoreDistribution = await sql`
    SELECT
      tis.danger::float8 AS score,
      COUNT(*)::int AS count,
      CONCAT('Danger ', tis.danger) AS label
    FROM trump_entries te
    JOIN trump_individual_scores tis ON te.entry_number = tis.entry_number
    WHERE tis.danger BETWEEN 1 AND 10
    GROUP BY tis.danger
    ORDER BY tis.danger
  `;

  const familyOrbitEntries = await sql`
    SELECT
      te.entry_number,
      te.title,
      TO_CHAR(te.date_start::date, 'YYYY-MM-DD') AS date_start,
      tis.danger::float8 AS danger,
      te.category,
      te.people_tags
    FROM trump_entries te
    JOIN trump_individual_scores tis ON te.entry_number = tis.entry_number
    WHERE te.people_tags && ARRAY[
      'Ivanka Trump', 'Jared Kushner', 'Donald Trump Jr.', 'Eric Trump',
      'Melania Trump', 'Barron Trump', 'Kash Patel', 'Pete Hegseth', 'Elon Musk'
    ]::text[]
    ORDER BY tis.danger DESC
    LIMIT 25
  `;

  const topCooccurrences = await sql`
    SELECT
      a.person AS person_a,
      b.person AS person_b,
      COUNT(*)::int AS co_count
    FROM trump_entries te,
      LATERAL UNNEST(te.people_tags) AS a(person),
      LATERAL UNNEST(te.people_tags) AS b(person)
    WHERE a.person < b.person
      AND a.person IS NOT NULL AND b.person IS NOT NULL
      AND a.person <> '' AND b.person <> ''
      AND array_length(te.people_tags, 1) > 1
    GROUP BY a.person, b.person
    ORDER BY co_count DESC
    LIMIT 20
  `;

  const recentEntries = await sql`
    SELECT entry_number, title, TO_CHAR(date_start::date, 'YYYY-MM-DD') AS date_start,
      danger::float8 AS danger, category
    FROM ai_complete_trump_data
    WHERE date_start IS NOT NULL
    ORDER BY date_start DESC
    LIMIT 10
  `;

  return {
    totals: {
      total: parseInt(totals.total),
      avg_danger: parseFloat(totals.avg_danger),
      avg_auth: parseFloat(totals.avg_auth),
      avg_lawless: parseFloat(totals.avg_lawless),
      peak_danger: parseFloat(totals.peak_danger),
    },
    timeline,
    categories,
    escalation,
    humanRights,
    violentRhetoric,
    yearlyAcceleration,
    topKeywords,
    radarDimensions: radarDimensions[0],
    iranWar,
    israelDedication,
    lieMeter,
    legalBattles,
    pardons,
    epsteinConnection,
    peopleTagFrequency: peopleTagFrequency as Array<{ person: string; count: number }>,
    categoryYearMatrix: categoryYearMatrix as Array<{ category: string; year: number; count: number; avg_danger: number }>,
    scoreDistribution: scoreDistribution as Array<{ score: number; count: number; label: string }>,
    familyOrbitEntries,
    topCooccurrences: topCooccurrences as Array<{ person_a: string; person_b: string; co_count: number }>,
    recentEntries: recentEntries as Array<{ entry_number: number; title: string; date_start: string | null; danger: number | null; category: string }>,
    pressureMatrix: pressureMatrix as Array<{ category: string; era: "First Term" | "Second Term"; count: number; avg_danger: number | null }>,
  };
  } catch (error) {
    console.error("Insights data load failed:", error);
    return EMPTY_INSIGHTS_DATA;
  }
}

import { Suspense } from "react";

function InsightsLoading() {
  return (
    <div className="flex items-center justify-center h-[calc(100dvh-64px)]">
      <div className="font-mono text-sm animate-pulse" style={{ color: "#3ee6c1" }}>
        // loading corpus...
      </div>
    </div>
  );
}

export default async function InsightsPage() {
  const data = await getInsightsData();
  return (
    <Suspense fallback={<InsightsLoading />}>
      <InsightsClient data={data} />
    </Suspense>
  );
}
