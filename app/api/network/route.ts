import neo4j from "neo4j-driver";
import { NextResponse } from "next/server";
import { sql } from "@/lib/neonClient";

const neoUri = process.env.NEO4J_URI;
const neoUsername = process.env.NEO4J_USERNAME;
const neoPassword = process.env.NEO4J_PASSWORD;
const driver = neoUri && neoUsername && neoPassword
  ? neo4j.driver(neoUri, neo4j.auth.basic(neoUsername, neoPassword))
  : null;

type GraphNode = Record<string, unknown> & { id: string; type: "person" | "event"; label: string; size: number };
type GraphEdge = { source: string; target: string; weight: number; avg_danger?: number };
type GraphPayload = { nodes: GraphNode[]; edges: GraphEdge[]; topPeople?: Array<{ name: string; events: number; avg_danger: number; categories: string[] }>; source: "neo4j" | "neon-fallback"; degraded: boolean; message?: string; path_supported?: boolean };
type GraphFilters = { phase: string; category: string; minDanger: number };

const toNumber = (value: unknown, fallback = 0) => {
  const number = neo4j.isInt(value) ? value.toNumber() : Number(value);
  return Number.isFinite(number) ? number : fallback;
};
const toString = (value: unknown, fallback = "") => typeof value === "string" ? value : value == null ? fallback : String(value);
const toList = (value: unknown) => Array.isArray(value) ? value.map((item) => toString(item)).filter(Boolean) : [];
const fallbackMeta = { source: "neon-fallback" as const, degraded: true, message: "Relationship service is unavailable; this bounded graph is derived from the archive's tagged entries." };

function personNode(name: string, events: number, avgDanger: number, categories: string[] = []): GraphNode {
  return { id: `person:${name}`, label: name, name, type: "person", events, avg_danger: avgDanger, categories, size: Math.min(32, 7 + Math.sqrt(Math.max(events, 1)) * 2) };
}

function addPersonMetrics(nodes: Record<string, GraphNode>, name: string, eventWeight: number, avgDanger: number): GraphNode {
  const id = `person:${name}`;
  const node = nodes[id] ?? personNode(name, 0, 0);
  const previousEvents = toNumber(node.events);
  const nextEvents = previousEvents + eventWeight;
  const previousDanger = toNumber(node.avg_danger);
  node.events = nextEvents;
  node.avg_danger = nextEvents > 0
    ? ((previousDanger * previousEvents) + (avgDanger * eventWeight)) / nextEvents
    : 0;
  node.size = Math.min(32, 7 + Math.sqrt(Math.max(nextEvents, 1)) * 2);
  nodes[id] = node;
  return node;
}

async function neonFallback(mode: string, person: string | null, filters: GraphFilters): Promise<GraphPayload> {
  if (mode === "path") return { nodes: [], edges: [], ...fallbackMeta, message: "Path exploration needs the relationship service and is not available in archive fallback mode.", path_supported: false };
  if (mode === "person") {
    if (!person?.trim()) return { nodes: [], edges: [], ...fallbackMeta, message: "Choose a person to build an archive-backed ego graph." };
    const rows = await sql`
      SELECT te.entry_number, te.title, te.category, TO_CHAR(te.date_start::date, 'YYYY-MM-DD') AS date_start,
        COALESCE(tis.danger::float8, 0) AS danger,
        MAX(tag) FILTER (WHERE LOWER(tag) = LOWER(${person.trim()})) AS center,
        ARRAY_AGG(DISTINCT tag) FILTER (WHERE LOWER(tag) <> LOWER(${person.trim()})) AS cocons
      FROM trump_entries te LEFT JOIN trump_individual_scores tis ON tis.entry_number = te.entry_number
      CROSS JOIN LATERAL UNNEST(COALESCE(te.people_tags, ARRAY[]::text[])) AS tag
      WHERE EXISTS (SELECT 1 FROM UNNEST(COALESCE(te.people_tags, ARRAY[]::text[])) p WHERE LOWER(p) = LOWER(${person.trim()}))
        AND (${filters.phase} = '' OR te.phase = ${filters.phase})
        AND (${filters.category} = '' OR te.category = ${filters.category})
        AND COALESCE(tis.danger::float8, 0) >= ${filters.minDanger}
      GROUP BY te.entry_number, te.title, te.category, te.date_start, tis.danger
      ORDER BY danger DESC NULLS LAST, te.date_start DESC NULLS LAST LIMIT 40
    `;
    const nodes: Record<string, GraphNode> = {}; const edges: GraphEdge[] = [];
    for (const row of rows as Array<Record<string, unknown>>) {
      const center = toString(row.center, person.trim()); const entry = toNumber(row.entry_number); const danger = toNumber(row.danger, 5);
      if (!center || entry <= 0) continue;
      const centerId = `person:${center}`, eventId = `event:${entry}`;
      addPersonMetrics(nodes, center, 1, danger);
      nodes[eventId] = { id: eventId, label: `#${entry} ${toString(row.title)}`, type: "event", entry_number: entry, title: toString(row.title), danger, category: toString(row.category), date_start: toString(row.date_start), size: 5 + Math.min(danger, 10) };
      edges.push({ source: centerId, target: eventId, weight: Math.max(1, danger), avg_danger: danger });
      for (const co of toList(row.cocons).slice(0, 8)) { const coId = `person:${co}`; addPersonMetrics(nodes, co, 1, danger); edges.push({ source: coId, target: eventId, weight: Math.max(1, danger * .5), avg_danger: danger }); }
    }
    return { nodes: Object.values(nodes), edges, ...fallbackMeta };
  }
  const edgeRows = await sql`
    WITH tagged AS (
      SELECT te.entry_number, tag AS person, COALESCE(tis.danger::float8, 0) AS danger
      FROM trump_entries te LEFT JOIN trump_individual_scores tis ON tis.entry_number = te.entry_number
      CROSS JOIN LATERAL UNNEST(COALESCE(te.people_tags, ARRAY[]::text[])) AS tag
      WHERE tag IS NOT NULL AND tag <> ''
        AND (${filters.phase} = '' OR te.phase = ${filters.phase})
        AND (${filters.category} = '' OR te.category = ${filters.category})
        AND COALESCE(tis.danger::float8, 0) >= ${filters.minDanger}
    )
    SELECT a.person AS person_a, b.person AS person_b, COUNT(*)::int AS shared_events, AVG(a.danger)::float8 AS avg_danger
    FROM tagged a JOIN tagged b ON a.entry_number = b.entry_number AND a.person < b.person
    GROUP BY a.person, b.person HAVING COUNT(*) >= ${mode === "community" ? 2 : 1}
    ORDER BY shared_events DESC, avg_danger DESC, person_a ASC, person_b ASC LIMIT ${mode === "community" ? 120 : 90}
  `;
  return cooccurrencePayload(edgeRows as Array<Record<string, unknown>>, fallbackMeta, mode === "community" ? 60 : 45);
}

function cooccurrencePayload(rows: Array<Record<string, unknown>>, meta: Pick<GraphPayload, "source" | "degraded" | "message">, limit: number): GraphPayload {
  // Keep the central figure visible without letting one star dominate the layout.
  const isTrumpEdge = (row: Record<string, unknown>) => [row.person_a, row.person_b]
    .some((person) => ["donald trump", "donald j. trump"].includes(toString(person).toLowerCase()));
  const diverseRows = [...rows.filter((row) => !isTrumpEdge(row)).slice(0, Math.max(0, limit - 10)), ...rows.filter(isTrumpEdge).slice(0, 10)];
  const nodes: Record<string, GraphNode> = {}; const edges: GraphEdge[] = [];
  for (const row of diverseRows) {
    const a = toString(row.person_a); const b = toString(row.person_b); const weight = toNumber(row.shared_events); const danger = toNumber(row.avg_danger);
    if (!a || !b || weight <= 0) continue;
    const aId = `person:${a}`, bId = `person:${b}`;
    addPersonMetrics(nodes, a, weight, danger);
    addPersonMetrics(nodes, b, weight, danger);
    edges.push({ source: aId, target: bId, weight, avg_danger: danger });
  }
  const topPeople = Object.values(nodes).sort((a, b) => toNumber(b.events) - toNumber(a.events)).slice(0, 15).map((node) => ({ name: toString(node.name), events: toNumber(node.events), avg_danger: toNumber(node.avg_danger), categories: [] }));
  return { nodes: Object.values(nodes), edges, topPeople, ...meta };
}

async function neoGraph(mode: string, person: string | null): Promise<GraphPayload> {
  if (!driver) throw new Error("Neo4j configuration unavailable");
  const session = driver.session({ defaultAccessMode: neo4j.session.READ });
  try {
    if (mode === "path") {
      const [rawFrom, rawTo] = (person ?? "").split("__", 2).map((value) => value.trim());
      const from = rawTo ? rawFrom : "Donald Trump";
      const to = rawTo ?? rawFrom;
      if (!to || to.length > 96 || from.length > 96) return { nodes: [], edges: [], source: "neo4j", degraded: false, message: "Enter a target person, or use From__To, to explore a path.", path_supported: true };
      const result = await session.run(`MATCH p=shortestPath((a:Person {name:$from})-[*..6]-(b:Person {name:$to})) RETURN p LIMIT 1`, { from, to });
      const nodes: Record<string, GraphNode> = {}; const edges: GraphEdge[] = [];
      for (const record of result.records) {
        const path = record.get("p") as { segments?: Array<{ start: { identity: { toString(): string }; labels: string[]; properties: Record<string, unknown> }; end: { identity: { toString(): string }; labels: string[]; properties: Record<string, unknown> } }> };
        for (const segment of path.segments ?? []) {
          for (const node of [segment.start, segment.end]) {
            const id = node.identity.toString(); const event = node.labels.some((label) => label.toLowerCase() === "event"); const entry = toNumber(node.properties.entry_number);
            nodes[id] = { id, type: event ? "event" : "person", label: toString(node.properties.name ?? node.properties.title, id), name: toString(node.properties.name), title: toString(node.properties.title), entry_number: entry || undefined, danger: toNumber(node.properties.danger, 0), size: event ? 9 : 13 };
          }
          edges.push({ source: segment.start.identity.toString(), target: segment.end.identity.toString(), weight: 1 });
        }
      }
      return { nodes: Object.values(nodes), edges, source: "neo4j", degraded: false, path_supported: true, message: nodes && Object.keys(nodes).length ? undefined : "No path was found within six relationships." };
    }
    if (mode === "person" && person) {
      const result = await session.run(`MATCH (p:Person {name:$name})-[:INVOLVED_IN]->(e:Event) OPTIONAL MATCH (other:Person)-[:INVOLVED_IN]->(e) WHERE other.name <> $name WITH p,e,collect(DISTINCT other.name)[..8] AS cocons RETURN p.name AS center,e.entry_number AS entry_number,e.title AS title,e.danger AS danger,e.category AS category,e.date_start AS date_start,cocons ORDER BY e.danger DESC LIMIT 40`, { name: person });
      const rows = result.records.map((record) => ({ center: record.get("center"), entry_number: record.get("entry_number"), title: record.get("title"), danger: record.get("danger"), category: record.get("category"), date_start: record.get("date_start"), cocons: record.get("cocons") }));
      const nodes: Record<string, GraphNode> = {}; const edges: GraphEdge[] = [];
      for (const row of rows) {
        const center = toString(row.center); const entry = toNumber(row.entry_number); const danger = toNumber(row.danger, 5); if (!center || entry <= 0) continue;
        const centerId = `person:${center}`, eventId = `event:${entry}`; addPersonMetrics(nodes, center, 1, danger);
        nodes[eventId] = { id: eventId, label: `#${entry} ${toString(row.title)}`, type: "event", entry_number: entry, title: toString(row.title), danger, category: toString(row.category), date_start: toString(row.date_start), size: 5 + danger };
        edges.push({ source: centerId, target: eventId, weight: danger, avg_danger: danger });
        for (const co of toList(row.cocons)) { const coId = `person:${co}`; addPersonMetrics(nodes, co, 1, danger); edges.push({ source: coId, target: eventId, weight: danger * .5, avg_danger: danger }); }
      }
      return { nodes: Object.values(nodes), edges, source: "neo4j", degraded: false };
    }
    const result = await session.run(`MATCH (a:Person)-[:INVOLVED_IN]->(e:Event)<-[:INVOLVED_IN]-(b:Person) WHERE a.name < b.name WITH a.name AS person_a,b.name AS person_b,count(e) AS shared_events,avg(e.danger) AS avg_danger ${mode === "community" ? "WHERE shared_events >= 2" : ""} RETURN person_a,person_b,shared_events,avg_danger ORDER BY shared_events DESC, avg_danger DESC, person_a ASC, person_b ASC LIMIT ${mode === "community" ? 120 : 90}`);
    return cooccurrencePayload(result.records.map((record) => ({ person_a: record.get("person_a"), person_b: record.get("person_b"), shared_events: record.get("shared_events"), avg_danger: record.get("avg_danger") })), { source: "neo4j", degraded: false }, mode === "community" ? 60 : 45);
  } finally { await session.close(); }
}

export async function GET(req: Request) {
  const url = new URL(req.url); const person = url.searchParams.get("person"); const rawMode = url.searchParams.get("mode") ?? "top";
  const mode = ["top", "person", "path", "community"].includes(rawMode) ? rawMode : "top";
  const cleanFilter = (value: string | null) => typeof value === "string" ? value.trim().slice(0, 96) : "";
  const rawMinDanger = Number(url.searchParams.get("minDanger") ?? 0);
  const filters: GraphFilters = { phase: cleanFilter(url.searchParams.get("phase")), category: cleanFilter(url.searchParams.get("category")), minDanger: Number.isFinite(rawMinDanger) ? Math.max(0, Math.min(10, rawMinDanger)) : 0 };
  const needsFilteredFallback = Boolean(filters.phase || filters.category || filters.minDanger);
  try {
    if (needsFilteredFallback) return NextResponse.json(await neonFallback(mode, person, filters));
    return NextResponse.json(await neoGraph(mode, person));
  } catch { try { return NextResponse.json(await neonFallback(mode, person, filters)); } catch { return NextResponse.json({ nodes: [], edges: [], ...fallbackMeta, message: "The graph data is temporarily unavailable. Retry shortly." }, { status: 503 }); } }
}
