import neo4j from "neo4j-driver";
import { NextResponse } from "next/server";

const driver = neo4j.driver(
  process.env.NEO4J_URI ?? "neo4j+s://be848f77.databases.neo4j.io",
  neo4j.auth.basic(
    process.env.NEO4J_USERNAME ?? "be848f77",
    process.env.NEO4J_PASSWORD ?? ""
  )
);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const person = url.searchParams.get("person");
  const mode = url.searchParams.get("mode") ?? "top"; // top | person | path | community

  const session = driver.session({ defaultAccessMode: neo4j.session.READ });

  try {
    if (mode === "person" && person) {
      // Ego network: all events connected to a person + their co-conspirators
      const result = await session.run(
        `MATCH (p:Person {name: $name})-[:INVOLVED_IN]->(e:Event)
         OPTIONAL MATCH (other:Person)-[:INVOLVED_IN]->(e)
         WHERE other.name <> $name
         WITH p, e, collect(DISTINCT other.name)[..8] as cocons
         RETURN
           p.name as center,
           e.entry_number as entry_number,
           e.title as title,
           e.danger as danger,
           e.category as category,
           e.date_start as date_start,
           cocons
         ORDER BY e.danger DESC
         LIMIT 50`,
        { name: person }
      );
      const nodes: Record<string, any> = {};
      const edges: any[] = [];
      result.records.forEach(r => {
        const center = r.get("center");
        const entry = r.get("entry_number");
        const danger = neo4j.isInt(r.get("danger")) ? r.get("danger").toNumber() : (r.get("danger") ?? 5);
        nodes[center] = { id: center, type: "person", size: 20, color: "#FF6500" };
        nodes[`e${entry}`] = { id: `e${entry}`, type: "event", entry_number: entry, title: r.get("title"), danger, category: r.get("category"), date_start: r.get("date_start"), size: 4 + danger };
        edges.push({ source: center, target: `e${entry}`, weight: danger });
        (r.get("cocons") as string[]).forEach(co => {
          if (!nodes[co]) nodes[co] = { id: co, type: "person", size: 10, color: "#e8b44c" };
          edges.push({ source: co, target: `e${entry}`, weight: danger * 0.5 });
        });
      });
      return NextResponse.json({ nodes: Object.values(nodes), edges });
    }

    if (mode === "path" && person) {
      // Shortest path from Trump to person via events
      const [from, to] = person.split("__");
      const result = await session.run(
        `MATCH p=shortestPath(
          (a:Person {name: $from})-[*..6]-(b:Person {name: $to})
        )
        RETURN p`,
        { from: from ?? "Donald Trump", to: to ?? person }
      );
      const nodes: Record<string, any> = {};
      const edges: any[] = [];
      result.records.forEach(r => {
        const path = r.get("p");
        path.segments.forEach((seg: any) => {
          const s = seg.start;
          const e = seg.end;
          nodes[s.identity.toString()] = { id: s.identity.toString(), label: s.properties.name ?? s.properties.title, type: s.labels[0] };
          nodes[e.identity.toString()] = { id: e.identity.toString(), label: e.properties.name ?? e.properties.title, type: e.labels[0] };
          edges.push({ source: s.identity.toString(), target: e.identity.toString() });
        });
      });
      return NextResponse.json({ nodes: Object.values(nodes), edges });
    }

    if (mode === "community") {
      // Top co-occurrence clusters — find tight communities
      const result = await session.run(
        `MATCH (a:Person)-[:INVOLVED_IN]->(e:Event)<-[:INVOLVED_IN]-(b:Person)
         WHERE a.name < b.name
         WITH a.name as person_a, b.name as person_b, count(e) as shared_events,
              avg(e.danger) as avg_danger
         WHERE shared_events >= 3
         RETURN person_a, person_b, shared_events, avg_danger
         ORDER BY shared_events DESC
         LIMIT 60`
      );
      const nodes: Record<string, any> = {};
      const edges: any[] = [];
      result.records.forEach(r => {
        const a = r.get("person_a");
        const b = r.get("person_b");
        const w = neo4j.isInt(r.get("shared_events")) ? r.get("shared_events").toNumber() : r.get("shared_events");
        const danger = r.get("avg_danger");
        nodes[a] = nodes[a] ?? { id: a, type: "person", size: 8, connections: 0 };
        nodes[b] = nodes[b] ?? { id: b, type: "person", size: 8, connections: 0 };
        nodes[a].connections += w;
        nodes[b].connections += w;
        nodes[a].size = Math.min(30, 6 + Math.sqrt(nodes[a].connections));
        nodes[b].size = Math.min(30, 6 + Math.sqrt(nodes[b].connections));
        edges.push({ source: a, target: b, weight: w, avg_danger: danger });
      });
      return NextResponse.json({ nodes: Object.values(nodes), edges });
    }

    // Default: top connected people + their event counts + avg danger
    const result = await session.run(
      `MATCH (p:Person)-[:INVOLVED_IN]->(e:Event)
       WITH p.name as name, count(e) as events, avg(e.danger) as avg_danger,
            collect(DISTINCT e.category)[..4] as categories
       ORDER BY events DESC
       LIMIT 30
       RETURN name, events, avg_danger, categories`
    );

    const topPeople = result.records.map(r => ({
      name: r.get("name"),
      events: neo4j.isInt(r.get("events")) ? r.get("events").toNumber() : r.get("events"),
      avg_danger: r.get("avg_danger"),
      categories: r.get("categories"),
    }));

    // Get co-occurrence for top 15 people to build graph
    const names = topPeople.slice(0, 15).map(p => p.name);
    const edgeResult = await session.run(
      `MATCH (a:Person)-[:INVOLVED_IN]->(e:Event)<-[:INVOLVED_IN]-(b:Person)
       WHERE a.name IN $names AND b.name IN $names AND a.name < b.name
       WITH a.name as pa, b.name as pb, count(e) as w, avg(e.danger) as d
       WHERE w >= 2
       RETURN pa, pb, w, d
       ORDER BY w DESC`,
      { names }
    );

    const edges = edgeResult.records.map(r => ({
      source: r.get("pa"),
      target: r.get("pb"),
      weight: neo4j.isInt(r.get("w")) ? r.get("w").toNumber() : r.get("w"),
      avg_danger: r.get("d"),
    }));

    const nodes = topPeople.slice(0, 15).map(p => ({
      id: p.name,
      type: "person",
      events: p.events,
      avg_danger: p.avg_danger,
      size: Math.min(35, 8 + Math.sqrt(p.events) * 2),
      categories: p.categories,
    }));

    return NextResponse.json({ nodes, edges, topPeople });

  } catch (err) {
    console.error("Neo4j error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await session.close();
  }
}
