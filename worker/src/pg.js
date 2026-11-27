// D1-compatible database surface backed by a Postgres connection (Supabase).
// The rest of the Worker keeps calling db.prepare(sql).bind(...).all()/first()/run()
// with "?" placeholders, so the entity store and auth code stay unchanged.
import pg from "pg";

// COUNT(*) comes back as a string (bigint) and SUM() as a numeric string in
// Postgres; the app expects numbers, like D1 returned.
pg.types.setTypeParser(20, (value) => Number(value));
pg.types.setTypeParser(1700, (value) => Number(value));

// Rewrites "?" placeholders to $1..$n, skipping quoted strings and identifiers.
export function toPlaceholders(sql) {
  let out = "";
  let index = 0;
  let single = false;
  let double = false;
  for (let position = 0; position < sql.length; position += 1) {
    const char = sql[position];
    if (single) {
      out += char;
      if (char === "'") {
        if (sql[position + 1] === "'") {
          out += "'";
          position += 1;
        } else {
          single = false;
        }
      }
      continue;
    }
    if (double) {
      out += char;
      if (char === '"') double = false;
      continue;
    }
    if (char === "'") single = true;
    if (char === '"') double = true;
    if (char === "?") {
      index += 1;
      out += `$${index}`;
      continue;
    }
    out += char;
  }
  return out;
}

export function createPgDatabase(connectionString) {
  const client = new pg.Client({
    connectionString,
    // Supabase requires TLS; a local Postgres without it opts out with sslmode=disable.
    ssl: /sslmode=disable/i.test(connectionString) ? false : { rejectUnauthorized: false },
    application_name: "sdl-worker",
  });

  let connecting = null;
  const ready = () => {
    if (!connecting) connecting = client.connect();
    return connecting;
  };

  const query = async (text, params = []) => {
    await ready();
    return client.query(toPlaceholders(text), params);
  };

  const statement = (text, params = []) => ({
    sql: text,
    params,
    bind: (...values) => statement(text, values),
    all: async () => {
      const result = await query(text, params);
      return { results: result.rows, meta: { changes: result.rowCount ?? result.rows.length } };
    },
    first: async (column) => {
      const result = await query(text, params);
      const row = result.rows[0];
      if (!row) return null;
      return column ? row[column] ?? null : row;
    },
    run: async () => {
      const result = await query(text, params);
      return { meta: { changes: result.rowCount ?? 0 } };
    },
  });

  return {
    dialect: "postgres",
    prepare: (text) => statement(text, []),
    // D1's batch runs the statements as one transaction.
    batch: async (statements) => {
      await ready();
      await client.query("BEGIN");
      try {
        const results = [];
        for (const entry of statements) {
          const result = await client.query(toPlaceholders(entry.sql), entry.params || []);
          results.push({ results: result.rows, meta: { changes: result.rowCount ?? result.rows.length } });
        }
        await client.query("COMMIT");
        return results;
      } catch (error) {
        await client.query("ROLLBACK").catch(() => {});
        throw error;
      }
    },
    end: async () => {
      if (!connecting) return;
      try {
        await connecting;
      } catch {
        return;
      }
      await client.end().catch(() => {});
    },
  };
}
