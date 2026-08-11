#!/usr/bin/env node
/**
 * Trump Files → Neo4j Graph Import
 *
 * Reads all entries + people_tags from Neon and builds a graph:
 *   (:Person {name}) -[:INVOLVED_IN]-> (:Event {entry_number, title, category, phase, date_start})
 *   (:Event) -[:IN_CATEGORY]-> (:Category {name})
 *
 * Run:
 *   NEO4J_URI=neo4j+s://xxx.databases.neo4j.io \
 *   NEO4J_USER=neo4j \
 *   NEO4J_PASSWORD=your_password \
 *   DATABASE_URL=postgresql://... \
 *   node scripts/neo4j-import.mjs
 *
 * Install driver first: npm install neo4j-driver
 */

import neo4j from 'neo4j-driver';
import { neon } from '@neondatabase/serverless';

const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USER = process.env.NEO4J_USER || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;
const DATABASE_URL = process.env.DATABASE_URL;
const BATCH_SIZE = 100;

if (!NEO4J_URI || !NEO4J_PASSWORD || !DATABASE_URL) {
  console.error('Required: NEO4J_URI, NEO4J_PASSWORD, DATABASE_URL');
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));

async function setupConstraints(session) {
  await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (e:Event) REQUIRE e.entry_number IS UNIQUE');
  await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (p:Person) REQUIRE p.name IS UNIQUE');
  await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (c:Category) REQUIRE c.name IS UNIQUE');
  await session.run('CREATE INDEX IF NOT EXISTS FOR (e:Event) ON (e.phase)');
  await session.run('CREATE INDEX IF NOT EXISTS FOR (e:Event) ON (e.date_start)');
  console.log('Constraints + indexes created');
}

async function importBatch(session, rows) {
  // Upsert events
  await session.run(
    `UNWIND $rows AS row
     MERGE (e:Event {entry_number: row.entry_number})
     SET e.title = row.title,
         e.synopsis = row.synopsis,
         e.category = row.category,
         e.phase = row.phase,
         e.date_start = row.date_start,
         e.danger = row.danger,
         e.authoritarianism = row.authoritarianism,
         e.lawlessness = row.lawlessness,
         e.insanity = row.insanity,
         e.absurdity = row.absurdity
     WITH e, row
     MERGE (c:Category {name: row.category})
     MERGE (e)-[:IN_CATEGORY]->(c)`,
    { rows }
  );

  // Upsert people + relationships
  const personRows = [];
  for (const row of rows) {
    for (const person of (row.people_tags || [])) {
      if (person && person.trim()) {
        personRows.push({ entry_number: row.entry_number, person: person.trim() });
      }
    }
  }

  if (personRows.length > 0) {
    await session.run(
      `UNWIND $personRows AS pr
       MATCH (e:Event {entry_number: pr.entry_number})
       MERGE (p:Person {name: pr.person})
       MERGE (p)-[:INVOLVED_IN]->(e)`,
      { personRows }
    );
  }
}

async function run() {
  console.log('Trump Files → Neo4j import starting...');

  const rows = await sql`
    SELECT
      te.entry_number,
      te.title,
      LEFT(te.synopsis, 500) as synopsis,
      te.category,
      te.phase,
      te.date_start::text as date_start,
      COALESCE(te.people_tags, '{}') as people_tags,
      COALESCE(tis.danger, 5) as danger,
      COALESCE(tis.authoritarianism, 5) as authoritarianism,
      COALESCE(tis.lawlessness, 5) as lawlessness,
      COALESCE(tis.insanity, 5) as insanity,
      COALESCE(tis.absurdity, 5) as absurdity
    FROM trump_entries te
    LEFT JOIN trump_individual_scores tis ON te.entry_number = tis.entry_number
    ORDER BY te.entry_number
  `;

  const startOffset = parseInt(process.env.NEO4J_OFFSET || '0', 10);
  const rowsToProcess = startOffset > 0 ? rows.slice(startOffset) : rows;
  console.log(`Loaded ${rows.length} entries from Neon (starting at offset ${startOffset})`);

  let session = driver.session();
  try {
    await setupConstraints(session);

    let done = startOffset;
    for (let i = 0; i < rowsToProcess.length; i += BATCH_SIZE) {
      const batch = rowsToProcess.slice(i, i + BATCH_SIZE).map(r => ({
        ...r,
        entry_number: neo4j.int(r.entry_number),
        danger: neo4j.int(r.danger),
        authoritarianism: neo4j.int(r.authoritarianism),
        lawlessness: neo4j.int(r.lawlessness),
        insanity: neo4j.int(r.insanity),
        absurdity: neo4j.int(r.absurdity),
        people_tags: Array.isArray(r.people_tags) ? r.people_tags : [],
      }));

      let retries = 3;
      while (retries > 0) {
        try {
          await importBatch(session, batch);
          break;
        } catch (err) {
          retries--;
          if (retries === 0) throw err;
          console.log(`  Retry batch at ${i} (${3 - retries}/3)...`);
          await new Promise(r => setTimeout(r, 3000));
          // Recreate session on connection errors
          await session.close();
          session = driver.session();
        }
      }
      done += batch.length;
      if (done % 500 === 0 || done === rows.length) console.log(`  ${done}/${rows.length} events imported`);
    }

    // Print stats
    const stats = await session.run(`
      MATCH (e:Event) WITH count(e) as events
      MATCH (p:Person) WITH events, count(p) as persons
      MATCH ()-[r:INVOLVED_IN]->() WITH events, persons, count(r) as rels
      RETURN events, persons, rels
    `);
    const s = stats.records[0];
    console.log(`\nGraph: ${s.get('events')} events, ${s.get('persons')} persons, ${s.get('rels')} relationships`);

  } finally {
    await session.close();
    await driver.close();
  }

  console.log('\nDone. Open Neo4j Bloom to explore the graph.');
  console.log('Try: MATCH (p:Person {name:"Jeffrey Epstein"})-[:INVOLVED_IN]->(e:Event) RETURN p, e LIMIT 25');
}

run().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
