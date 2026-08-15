import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/neonClient";

const VALID_SORTS = new Set([
  "entry_asc",
  "entry_desc",
  "rank_asc",
  "score_desc",
  "score_asc",
  "date_desc",
  "date_asc",
  "danger_desc",
  "authoritarianism_desc",
  "lawlessness_desc",
  "insanity_desc",
  "absurdity_desc",
  "title_asc",
]);

function boundedNumber(value: string | null, min: number, max: number, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const page = Math.floor(boundedNumber(params.get("page"), 1, 10000, 1));
    const pageSize = Math.floor(boundedNumber(params.get("pageSize"), 1, 48, 24));
    const offset = (page - 1) * pageSize;
    const search = (params.get("q") ?? "").trim().slice(0, 160);
    const searchPattern = `%${search}%`;
    const category = (params.get("category") ?? "all").slice(0, 160);
    const phase = (params.get("phase") ?? "all").slice(0, 160);
    const requestedSort = params.get("sort") ?? "entry_desc";
    const sort = VALID_SORTS.has(requestedSort) ? requestedSort : "entry_desc";
    const minDanger = boundedNumber(params.get("danger"), 0, 10, 0);
    const minAuthority = boundedNumber(params.get("authority"), 0, 10, 0);
    const minLawless = boundedNumber(params.get("lawless"), 0, 10, 0);
    const minInsanity = boundedNumber(params.get("insanity"), 0, 10, 0);
    const minAbsurdity = boundedNumber(params.get("absurd"), 0, 10, 0);
    const minScore = boundedNumber(params.get("score"), 0, 10, 0);
    const sourcedOnly = params.get("sourced") === "1";

    const [rows, countRows, categoryRows, phaseRows] = await Promise.all([
      sql`
        WITH ranked_scores AS (
          SELECT
            scores.*,
            row_number() OVER (ORDER BY scores.composite_score) AS fucked_up_rank
          FROM trump_individual_scores scores
        ), filtered AS (
          SELECT
            entry.entry_number,
            entry.title,
            entry.synopsis,
            entry.category,
            entry.subcategory,
            entry.phase,
            entry.age,
            entry.start_year,
            entry.date_start,
            entry.date_end,
            entry.duration_days,
            ranked_scores.composite_score AS fucked_up_score,
            ranked_scores.fucked_up_rank,
            ranked_scores.danger,
            ranked_scores.authoritarianism,
            ranked_scores.lawlessness,
            ranked_scores.insanity,
            ranked_scores.absurdity,
            ranked_scores.credibility_risk,
            ranked_scores.recency_intensity,
            ranked_scores.impact_scope,
            ranked_scores.rationale_short,
            COALESCE(entry.keywords, ARRAY[]::text[]) AS all_keywords
          FROM trump_entries entry
          LEFT JOIN ranked_scores USING (entry_number)
          WHERE
            (
              ${search} = '' OR
              entry.title ILIKE ${searchPattern} OR
              entry.synopsis ILIKE ${searchPattern} OR
              entry.category ILIKE ${searchPattern} OR
              COALESCE(entry.subcategory, '') ILIKE ${searchPattern} OR
              entry.phase ILIKE ${searchPattern} OR
              COALESCE(ranked_scores.rationale_short, '') ILIKE ${searchPattern} OR
              array_to_string(entry.keywords, ' ') ILIKE ${searchPattern} OR
              EXISTS (
                SELECT 1 FROM trump_sources search_source
                WHERE search_source.entry_number = entry.entry_number
                  AND (
                    COALESCE(search_source.publisher, '') ILIKE ${searchPattern} OR
                    COALESCE(search_source.title, '') ILIKE ${searchPattern}
                  )
              )
            )
            AND (${category} = 'all' OR entry.category = ${category})
            AND (
              ${phase} = 'all' OR
              entry.phase = ${phase} OR
              (
                ${phase} = '__second_term__' AND entry.phase IN (
                  'White House 2', 'White House 2:2', 'Term 2: Year 2',
                  'Presidency 2 (2025–2029)', 'WH2:2'
                )
              )
            )
            AND (${minDanger} = 0 OR COALESCE(ranked_scores.danger, 0) >= ${minDanger})
            AND (${minAuthority} = 0 OR COALESCE(ranked_scores.authoritarianism, 0) >= ${minAuthority})
            AND (${minLawless} = 0 OR COALESCE(ranked_scores.lawlessness, 0) >= ${minLawless})
            AND (${minInsanity} = 0 OR COALESCE(ranked_scores.insanity, 0) >= ${minInsanity})
            AND (${minAbsurdity} = 0 OR COALESCE(ranked_scores.absurdity, 0) >= ${minAbsurdity})
            AND (${minScore} = 0 OR COALESCE(ranked_scores.composite_score, 0) >= ${minScore})
            AND (
              ${sourcedOnly} = false OR EXISTS (
                SELECT 1 FROM trump_sources source_check
                WHERE source_check.entry_number = entry.entry_number
                  AND source_check.url IS NOT NULL
                  AND btrim(source_check.url) <> ''
              )
            )
        ), paged AS (
          SELECT filtered.*
          FROM filtered
          ORDER BY
            CASE WHEN ${sort} = 'entry_asc' THEN entry_number END ASC,
            CASE WHEN ${sort} = 'entry_desc' THEN entry_number END DESC,
            CASE WHEN ${sort} = 'rank_asc' THEN fucked_up_rank END ASC NULLS LAST,
            CASE WHEN ${sort} = 'score_desc' THEN fucked_up_score END DESC NULLS LAST,
            CASE WHEN ${sort} = 'score_asc' THEN fucked_up_score END ASC NULLS LAST,
            CASE WHEN ${sort} = 'date_desc' THEN date_start END DESC NULLS LAST,
            CASE WHEN ${sort} = 'date_asc' THEN date_start END ASC NULLS LAST,
            CASE WHEN ${sort} = 'danger_desc' THEN danger END DESC NULLS LAST,
            CASE WHEN ${sort} = 'authoritarianism_desc' THEN authoritarianism END DESC NULLS LAST,
            CASE WHEN ${sort} = 'lawlessness_desc' THEN lawlessness END DESC NULLS LAST,
            CASE WHEN ${sort} = 'insanity_desc' THEN insanity END DESC NULLS LAST,
            CASE WHEN ${sort} = 'absurdity_desc' THEN absurdity END DESC NULLS LAST,
            CASE WHEN ${sort} = 'title_asc' THEN title END ASC,
            entry_number DESC
          LIMIT ${pageSize}
          OFFSET ${offset}
        )
        SELECT
          paged.*,
          COALESCE(source_rollup.sources, '[]'::jsonb) AS sources
        FROM paged
        LEFT JOIN LATERAL (
          SELECT jsonb_agg(
            jsonb_build_object(
              'url', source.url,
              'title', source.title,
              'publisher', source.publisher,
              'source_type', source.source_type
            ) ORDER BY source.source_id
          ) FILTER (WHERE source.url IS NOT NULL AND btrim(source.url) <> '') AS sources
          FROM trump_sources source
          WHERE source.entry_number = paged.entry_number
        ) source_rollup ON true
      `,
      sql`
        SELECT COUNT(*)::int AS total
        FROM trump_entries entry
        LEFT JOIN trump_individual_scores scores USING (entry_number)
        WHERE
          (
            ${search} = '' OR
            entry.title ILIKE ${searchPattern} OR
            entry.synopsis ILIKE ${searchPattern} OR
            entry.category ILIKE ${searchPattern} OR
            COALESCE(entry.subcategory, '') ILIKE ${searchPattern} OR
            entry.phase ILIKE ${searchPattern} OR
            COALESCE(scores.rationale_short, '') ILIKE ${searchPattern} OR
            array_to_string(entry.keywords, ' ') ILIKE ${searchPattern} OR
            EXISTS (
              SELECT 1 FROM trump_sources search_source
              WHERE search_source.entry_number = entry.entry_number
                AND (
                  COALESCE(search_source.publisher, '') ILIKE ${searchPattern} OR
                  COALESCE(search_source.title, '') ILIKE ${searchPattern}
                )
            )
          )
          AND (${category} = 'all' OR entry.category = ${category})
          AND (
            ${phase} = 'all' OR
            entry.phase = ${phase} OR
            (
              ${phase} = '__second_term__' AND entry.phase IN (
                'White House 2', 'White House 2:2', 'Term 2: Year 2',
                'Presidency 2 (2025–2029)', 'WH2:2'
              )
            )
          )
          AND (${minDanger} = 0 OR COALESCE(scores.danger, 0) >= ${minDanger})
          AND (${minAuthority} = 0 OR COALESCE(scores.authoritarianism, 0) >= ${minAuthority})
          AND (${minLawless} = 0 OR COALESCE(scores.lawlessness, 0) >= ${minLawless})
          AND (${minInsanity} = 0 OR COALESCE(scores.insanity, 0) >= ${minInsanity})
          AND (${minAbsurdity} = 0 OR COALESCE(scores.absurdity, 0) >= ${minAbsurdity})
          AND (${minScore} = 0 OR COALESCE(scores.composite_score, 0) >= ${minScore})
          AND (
            ${sourcedOnly} = false OR EXISTS (
              SELECT 1 FROM trump_sources source_check
              WHERE source_check.entry_number = entry.entry_number
                AND source_check.url IS NOT NULL
                AND btrim(source_check.url) <> ''
            )
          )
      `,
      sql`SELECT DISTINCT category FROM trump_entries WHERE category IS NOT NULL AND btrim(category) <> '' ORDER BY category`,
      sql`SELECT DISTINCT phase FROM trump_entries WHERE phase IS NOT NULL AND btrim(phase) <> '' ORDER BY phase`,
    ]);

    const total = Number(countRows[0]?.total ?? 0);
    const entries = rows;

    return NextResponse.json(
      {
        entries,
        total,
        page,
        pageSize,
        categories: categoryRows.map((row) => String(row.category)),
        phases: phaseRows.map((row) => String(row.phase)),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching catalog entries:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
