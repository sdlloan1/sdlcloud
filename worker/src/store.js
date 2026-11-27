// D1-backed entity store with the query surface the app's screens already use:
// list / filter / get / create / update / delete / count / aggregate / bulk*.
// Row-level rules come from base44/entities/*.jsonc (see entities.generated.js).
import { entities } from "./entities.generated.js";

export const entityNames = Object.keys(entities);

export function entityDef(name) {
  const def = entities[name];
  if (!def) throw httpError(404, `Unknown entity: ${name}`);
  return def;
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

const SYSTEM_COLUMNS = ["id", "created_date", "updated_date", "created_by_id"];

// Identifiers are quoted because a few fields use SQL keywords ("order").
const q = (identifier) => `"${identifier}"`;

// The User entity is owned by the app's own auth: any signed-in user may read
// accounts, a user may edit their own record, and only admins create or delete.
const USER_RULES = {
  create: { user_condition: { role: "admin" } },
  read: null,
  update: { $or: [{ "data.id": "{{user.id}}" }, { user_condition: { role: "admin" } }] },
  delete: { user_condition: { role: "admin" } },
};

export function rulesFor(def, action) {
  if (def.table === "users") return USER_RULES[action];
  return def.rls ? def.rls[action] : undefined;
}

export function columns(def) {
  return [...SYSTEM_COLUMNS, ...Object.keys(def.fields)];
}

const USER_PROFILE_COLUMNS = ["email", "full_name", "status"];

export function selectList(def) {
  const extra = def.table === "users" ? USER_PROFILE_COLUMNS : [];
  return [...columns(def), ...extra].map(q).join(", ");
}

// Columns that only the app's own auth code touches; never exposed through the API.
export const AUTH_COLUMNS = ["email", "full_name", "status", "password_hash", "totp_secret", "totp_enabled", "recovery_codes"];

const isBool = (def, field) => def.fields[field]?.type === "boolean";

function toRow(def, data) {
  const row = {};
  for (const field of columns(def)) {
    if (data[field] === undefined) continue;
    const value = data[field];
    row[field] = isBool(def, field) ? (value ? 1 : 0) : value;
  }
  if (def.table === "users") {
    for (const field of ["email", "full_name", "status"]) {
      if (data[field] !== undefined) row[field] = data[field];
    }
  }
  return row;
}

export function fromRow(def, row) {
  if (!row) return null;
  const out = { ...row };
  for (const [field, spec] of Object.entries(def.fields)) {
    if (spec.type === "boolean") out[field] = Boolean(row[field]);
  }
  return out;
}

const OPERATORS = ["$in", "$nin", "$lt", "$lte", "$gt", "$gte", "$ne"];

// Builds a parameterised WHERE fragment from the app's filter objects.
export function buildFilter(def, query = {}) {
  const clauses = [];
  const params = [];
  for (const [key, value] of Object.entries(query || {})) {
    if (value === undefined || value === null) continue;
    if (key === "$or" || key === "$and") {
      const parts = (value || []).map((part) => buildFilter(def, part));
      if (!parts.length) continue;
      clauses.push(`(${parts.map((part) => part.sql).join(key === "$or" ? " OR " : " AND ")})`);
      for (const part of parts) params.push(...part.params);
      continue;
    }
    if (!columns(def).includes(key)) continue;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      for (const operator of OPERATORS) {
        if (!(operator in value)) continue;
        const operand = value[operator];
        if (operator === "$in" || operator === "$nin") {
          const list = Array.isArray(operand) ? operand : [operand];
          if (!list.length) {
            clauses.push(operator === "$in" ? "1 = 0" : "1 = 1");
            continue;
          }
          clauses.push(`${q(key)} ${operator === "$in" ? "IN" : "NOT IN"} (${list.map(() => "?").join(", ")})`);
          params.push(...list);
        } else {
          const sqlOperator = { $lt: "<", $lte: "<=", $gt: ">", $gte: ">=", $ne: "!=" }[operator];
          clauses.push(`${q(key)} ${sqlOperator} ?`);
          params.push(operand);
        }
      }
      continue;
    }
    clauses.push(`${q(key)} = ?`);
    params.push(isBool(def, key) ? (value ? 1 : 0) : value);
  }
  return { sql: clauses.length ? clauses.join(" AND ") : "1 = 1", params };
}

function matchesUserCondition(condition, user) {
  if (!user) return false;
  return Object.entries(condition || {}).every(([key, expected]) => String(user[key] ?? "") === String(expected));
}

// Evaluates a create/update/delete rule against the request's user and payload.
export function isAllowed(rule, user, data) {
  if (rule === null || rule === undefined) return true;
  if (!user) return false;
  if (Array.isArray(rule.$or)) return rule.$or.some((part) => isAllowed(part, user, data));
  if (Array.isArray(rule.$and)) return rule.$and.every((part) => isAllowed(part, user, data));
  if (rule.user_condition) return matchesUserCondition(rule.user_condition, user);
  const dataKeys = Object.keys(rule).filter((key) => key.startsWith("data."));
  if (dataKeys.length) {
    return dataKeys.every((key) => {
      const expected = rule[key];
      const actual = data?.[key.slice(5)];
      if (expected === "{{user.id}}") return actual === user.id;
      return String(actual ?? "") === String(expected ?? "");
    });
  }
  return false;
}

// Turns a read rule into a SQL scope; null means unrestricted.
export function readScope(def, user) {
  const rule = rulesFor(def, "read");
  if (rule === null || rule === undefined) return null;
  return scopeFromRule(rule, user);
}

function scopeFromRule(rule, user) {
  if (rule === null || rule === undefined) return null;
  if (Array.isArray(rule.$or)) {
    const parts = rule.$or.map((part) => scopeFromRule(part, user)).filter(Boolean);
    if (!parts.length) return { sql: "1 = 0", params: [] };
    if (parts.some((part) => part.sql === "1 = 1")) return null;
    return { sql: `(${parts.map((part) => part.sql).join(" OR ")})`, params: parts.flatMap((part) => part.params) };
  }
  if (Array.isArray(rule.$and)) {
    const parts = rule.$and.map((part) => scopeFromRule(part, user)).filter(Boolean);
    if (parts.some((part) => part.sql === "1 = 0")) return { sql: "1 = 0", params: [] };
    if (!parts.length) return null;
    return { sql: `(${parts.map((part) => part.sql).join(" AND ")})`, params: parts.flatMap((part) => part.params) };
  }
  if (rule.user_condition) {
    return matchesUserCondition(rule.user_condition, user) ? null : { sql: "1 = 0", params: [] };
  }
  const dataKeys = Object.keys(rule).filter((key) => key.startsWith("data."));
  if (dataKeys.length) {
    if (!user) return { sql: "1 = 0", params: [] };
    const parts = dataKeys.map((key) => {
      const expected = rule[key];
      const field = key.slice(5);
      return expected === "{{user.id}}" ? { sql: `${q(field)} = ?`, params: [user.id] } : { sql: `${q(field)} = ?`, params: [expected] };
    });
    return { sql: `(${parts.map((part) => part.sql).join(" AND ")})`, params: parts.flatMap((part) => part.params) };
  }
  return { sql: "1 = 0", params: [] };
}

export function orderClause(sort) {
  const value = String(sort || "-created_date").trim();
  const descending = value.startsWith("-");
  const field = descending ? value.slice(1) : value.replace(/^\+/, "");
  if (!/^[a-z_]+$/i.test(field)) return "ORDER BY created_date DESC";
  return `ORDER BY ${q(field)} ${descending ? "DESC" : "ASC"}`;
}

export class EntityStore {
  constructor(db, user, { serviceRole = false } = {}) {
    this.db = db;
    this.user = user;
    this.serviceRole = serviceRole;
  }

  scope(def) {
    return this.serviceRole ? null : readScope(def, this.user);
  }

  async list(name, sort, limit) {
    return this.query(name, {}, sort, limit);
  }

  async filter(name, query, sort, limit) {
    return this.query(name, query, sort, limit);
  }

  async query(name, query, sort, limit) {
    const def = entityDef(name);
    const where = buildFilter(def, query);
    const scope = this.scope(def);
    const params = [...where.params];
    let sql = `SELECT ${selectList(def)} FROM ${def.table} WHERE ${where.sql}`;
    if (scope) {
      sql += ` AND ${scope.sql}`;
      params.push(...scope.params);
    }
    sql += ` ${orderClause(sort)}`;
    if (limit) sql += ` LIMIT ${Math.max(1, Math.min(Number(limit), 5000))}`;
    const { results } = await this.db.prepare(sql).bind(...params).all();
    return (results || []).map((row) => fromRow(def, row));
  }

  async get(name, id) {
    const def = entityDef(name);
    const scope = this.scope(def);
    let sql = `SELECT ${selectList(def)} FROM ${def.table} WHERE id = ?`;
    const params = [id];
    if (scope) {
      sql += ` AND ${scope.sql}`;
      params.push(...scope.params);
    }
    const row = await this.db.prepare(sql).bind(...params).first();
    return fromRow(def, row);
  }

  async count(name, query = {}) {
    const def = entityDef(name);
    const where = buildFilter(def, query);
    const scope = this.scope(def);
    const params = [...where.params];
    let sql = `SELECT COUNT(*) AS total FROM ${def.table} WHERE ${where.sql}`;
    if (scope) {
      sql += ` AND ${scope.sql}`;
      params.push(...scope.params);
    }
    const row = await this.db.prepare(sql).bind(...params).first();
    return Number(row?.total || 0);
  }

  async create(name, data) {
    const def = entityDef(name);
    if (!this.serviceRole && !isAllowed(rulesFor(def, "create"), this.user, data)) {
      throw httpError(403, `Not allowed to create ${name}`);
    }
    const now = new Date().toISOString();
    const row = {
      id: data.id || crypto.randomUUID(),
      created_date: now,
      updated_date: now,
      created_by_id: data.created_by_id || this.user?.id || null,
      ...toRow(def, data),
    };
    for (const [field, spec] of Object.entries(def.fields)) {
      if (row[field] === undefined && spec.default !== undefined) {
        row[field] = isBool(def, field) ? (spec.default ? 1 : 0) : spec.default;
      }
    }
    if (def.table === "users" && !row.email) throw httpError(400, "An email address is required");
    const names = Object.keys(row);
    const sql = `INSERT INTO ${def.table} (${names.map(q).join(", ")}) VALUES (${names.map(() => "?").join(", ")}) RETURNING *`;
    const created = await this.db.prepare(sql).bind(...names.map((key) => row[key])).first();
    return fromRow(def, created || row);
  }

  async update(name, id, data) {
    const def = entityDef(name);
    const existing = await this.get(name, id);
    if (!existing) throw httpError(404, `${name} not found`);
    if (!this.serviceRole && !isAllowed(rulesFor(def, "update"), this.user, { ...existing, ...data })) {
      throw httpError(403, `Not allowed to update ${name}`);
    }
    if (!this.serviceRole) {
      for (const [field, spec] of Object.entries(def.fields)) {
        if (data[field] === undefined || !spec.rls?.update) continue;
        if (!isAllowed(spec.rls.update, this.user, { ...existing, ...data })) {
          throw httpError(403, `Not allowed to update ${name}.${field}`);
        }
      }
    }
    const patch = toRow(def, data);
    patch.updated_date = new Date().toISOString();
    const names = Object.keys(patch);
    const sql = `UPDATE ${def.table} SET ${names.map((key) => `${q(key)} = ?`).join(", ")} WHERE id = ? RETURNING *`;
    const updated = await this.db.prepare(sql).bind(...names.map((key) => patch[key]), id).first();
    return fromRow(def, updated);
  }

  async delete(name, id) {
    const def = entityDef(name);
    const existing = await this.get(name, id);
    if (!existing) throw httpError(404, `${name} not found`);
    if (!this.serviceRole && !isAllowed(rulesFor(def, "delete"), this.user, existing)) {
      throw httpError(403, `Not allowed to delete ${name}`);
    }
    await this.db.prepare(`DELETE FROM ${def.table} WHERE id = ?`).bind(id).run();
    return { id };
  }

  async updateMany(name, query, patch) {
    const rows = await this.query(name, query);
    const def = entityDef(name);
    const values = toRow(def, patch);
    const names = Object.keys(values);
    if (!names.length) return rows.length;
    const sql = `UPDATE ${def.table} SET ${names.map((key) => `${q(key)} = ?`).join(", ")}, updated_date = ? WHERE id = ?`;
    const statements = rows.map((row) => this.db.prepare(sql).bind(...names.map((key) => values[key]), new Date().toISOString(), row.id));
    if (statements.length) await this.db.batch(statements);
    return rows.length;
  }

  async bulkCreate(name, items) {
    const created = [];
    for (const item of items || []) created.push(await this.create(name, item));
    return created;
  }

  async bulkUpdate(name, items) {
    const updated = [];
    for (const item of items || []) {
      const { id, ...patch } = item || {};
      if (id) updated.push(await this.update(name, id, patch));
    }
    return updated;
  }

  async deleteMany(name, query) {
    const def = entityDef(name);
    const where = buildFilter(def, query);
    const scope = this.scope(def);
    const params = [...where.params];
    let sql = `DELETE FROM ${def.table} WHERE ${where.sql}`;
    if (scope) {
      sql += ` AND ${scope.sql}`;
      params.push(...scope.params);
    }
    const result = await this.db.prepare(sql).bind(...params).run();
    return Number(result?.meta?.changes || 0);
  }

  // Month/week buckets with counts and sums, the shape the dashboard reads.
  async aggregate(name, { query = {}, dateBucket, groupBy, sum } = {}) {
    const def = entityDef(name);
    const where = buildFilter(def, query);
    const scope = this.scope(def);
    const params = [...where.params];

    const bucket = dateBucket?.field && def.fields[dateBucket.field] ? dateBucket.field : "created_date";
    const unit = dateBucket?.unit === "week" ? "week" : "month";
    // Postgres (Supabase) and SQLite (D1) bucket dates differently.
    const postgres = this.db.dialect === "postgres";
    const bucketSql = postgres
      ? `to_char(date_trunc('${unit}', ${q(bucket)}::timestamptz), 'YYYY-MM-DD')`
      : unit === "week"
        ? `date(${q(bucket)}, '-' || ((strftime('%w', ${q(bucket)}) + 6) % 7) || ' days')`
        : `date(${q(bucket)}, 'start of month')`;

    const groups = (Array.isArray(groupBy) ? groupBy : groupBy ? [groupBy] : []).filter((field) => def.fields[field] || field === "created_date");
    const sums = (Array.isArray(sum) ? sum : sum ? [sum] : []).filter((field) => def.fields[field]);

    const select = [`${bucketSql} AS created_date`];
    for (const field of groups) select.push(q(field));
    select.push("COUNT(*) AS count");
    for (const field of sums) select.push(`SUM(${q(field)}) AS sum_${field}`);

    let sql = `SELECT ${select.join(", ")} FROM ${def.table} WHERE ${where.sql}`;
    if (scope) {
      sql += ` AND ${scope.sql}`;
      params.push(...scope.params);
    }
    sql += ` GROUP BY ${[bucketSql, ...groups.map(q)].join(", ")}`;
    const { results } = await this.db.prepare(sql).bind(...params).all();
    return { rows: (results || []).map((row) => ({ ...row })) };
  }
}
