const { Client } = require('pg');

const DATABASE_URL = "postgresql://neondb_owner:npg_UtmAiIbTx51q@ep-fancy-queen-aaooa4ag-pooler.westus3.azure.neon.tech/neondb?sslmode=require&channel_binding=require";

async function main() {
    const client = new Client({
        connectionString: DATABASE_URL,
        ssl: true
    });

    try {
        await client.connect();

        // Fetch aggregated sources for entries > 500
        // We assume trump_sources links to trump_entries via entry_id or something similar.
        // Let's first check how they are linked.
        // trump_entries has 'id' and 'entry_number'. trump_sources has 'entry_id'.

        // We want to see URLs for entries with entry_number > 500
        const res = await client.query(`
      SELECT e.entry_number, e.title, s.source_url
      FROM trump_entries e
      JOIN trump_sources s ON e.id = s.entry_id
      WHERE e.entry_number > 500
      LIMIT 20
    `);

        console.log("Sample URLs for entries > 500:");
        res.rows.forEach(r => {
            console.log(`[#${r.entry_number}] ${r.title.substring(0, 30)}... -> ${r.source_url}`);
        });

        // Also check for obvious formatting errors (e.g. missing protocol, spaces)
        const weirdUrls = await client.query(`
      SELECT s.source_url 
      FROM trump_sources s 
      JOIN trump_entries e ON e.id = s.entry_id
      WHERE e.entry_number > 500 
      AND (s.source_url NOT LIKE 'http%' OR s.source_url LIKE '% %')
      LIMIT 10
    `);

        if (weirdUrls.rows.length > 0) {
            console.log("\nPotentially malformed URLs:");
            weirdUrls.rows.forEach(r => console.log(r.source_url));
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

main();
