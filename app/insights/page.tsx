import { sql } from "@/lib/neonClient";
import InsightsClient from "./InsightsClient";

export const revalidate = 3600;

export const metadata = {
  title: "Insights — The Making of a Threat",
  description: "A narrative data investigation into 60+ years of documented Trump misconduct, told through forensic visualizations.",
};

async function getInsightsData() {
  const [totals] = await sql`
    SELECT COUNT(*) as total,
      AVG(danger) as avg_danger,
      AVG(authoritarianism) as avg_auth,
      AVG(lawlessness) as avg_lawless,
      MAX(danger) as peak_danger
    FROM ai_complete_trump_data
  `;

  const timeline = await sql`
    SELECT
      EXTRACT(YEAR FROM date_start::date)::int as year,
      COUNT(*)::int as count,
      AVG(danger)::numeric(4,2) as avg_danger,
      AVG(authoritarianism)::numeric(4,2) as avg_auth,
      AVG(absurdity)::numeric(4,2) as avg_absurdity
    FROM ai_complete_trump_data
    WHERE date_start IS NOT NULL AND EXTRACT(YEAR FROM date_start::date) >= 1970
    GROUP BY EXTRACT(YEAR FROM date_start::date)
    ORDER BY year
  `;

  const categories = await sql`
    SELECT category, COUNT(*)::int as count,
      AVG(danger)::numeric(4,2) as avg_danger,
      AVG(impact_scope)::numeric(4,2) as avg_impact
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
      AVG(danger)::numeric(4,2) as avg_danger,
      AVG(authoritarianism)::numeric(4,2) as avg_auth,
      AVG(lawlessness)::numeric(4,2) as avg_lawless
    FROM ai_complete_trump_data
    WHERE date_start IS NOT NULL
    GROUP BY era
    ORDER BY MIN(date_start)
  `;

  const humanRights = await sql`
    SELECT entry_number, title, danger, date_start
    FROM ai_complete_trump_data
    WHERE category = 'Human Rights Violations' AND danger >= 8
    ORDER BY danger DESC, date_start DESC
    LIMIT 10
  `;

  const violentRhetoric = await sql`
    SELECT entry_number, title, danger, insanity, date_start
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
      AVG(danger)::numeric(4,2) as danger,
      AVG(authoritarianism)::numeric(4,2) as authoritarianism,
      AVG(lawlessness)::numeric(4,2) as lawlessness,
      AVG(insanity)::numeric(4,2) as insanity,
      AVG(absurdity)::numeric(4,2) as absurdity,
      AVG(credibility_risk)::numeric(4,2) as credibility_risk,
      AVG(impact_scope)::numeric(4,2) as impact_scope
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
      AVG(danger)::numeric(4,2) as avg_danger
    FROM ai_complete_trump_data
    WHERE (LOWER(title) LIKE '%iran%' OR LOWER(synopsis) LIKE '%iran%'
      OR EXISTS (SELECT 1 FROM UNNEST(all_keywords) k WHERE LOWER(k) LIKE '%iran%'))
      AND date_start IS NOT NULL
    GROUP BY era
    ORDER BY MIN(date_start)
  `;

  const israelDedication = await sql`
    SELECT entry_number, title, danger, date_start, category
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
    SELECT entry_number, title, date_start, danger, category
    FROM ai_complete_trump_data
    WHERE (LOWER(title) LIKE '%pardon%' OR LOWER(title) LIKE '%commut%')
      AND date_start IS NOT NULL
      AND entry_number != 4031
    ORDER BY date_start DESC
    LIMIT 20
  `;

  const epsteinConnection = await sql`
    SELECT entry_number, title, date_start, danger, category
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
      AVG(danger)::numeric(4,2) as avg_danger
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
      AVG(danger)::numeric(4,2) as avg_danger
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
  };
}

export default async function InsightsPage() {
  const data = await getInsightsData();
  return <InsightsClient data={data} />;
}
