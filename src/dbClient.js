// Cliente PostgREST + Storage sem dependência do SDK supabase-js.

function resolveBaseUrl() {
  const raw = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim())
    || import.meta.env.REACT_APP_API_URL
    || '';
  if (raw && raw.startsWith('/') && typeof window !== 'undefined') {
    return `${window.location.origin}${raw}`;
  }
  if (!raw && typeof window !== 'undefined') {
    return window.location.origin;
  }
  return raw;
}

// ─── PostgREST query builder ──────────────────────────────────────────────────

class QueryBuilder {
  constructor(table) {
    this._table   = table;
    this._params  = new URLSearchParams();
    this._method  = 'GET';
    this._body    = null;
    this._headers = {};
    this._hasSelect = false;
  }

  select(fields = '*') {
    this._params.set('select', fields);
    this._hasSelect = true;
    return this;
  }

  _filter(col, op, value) {
    const v = value === null  ? 'null'
            : value === true  ? 'true'
            : value === false ? 'false'
            : String(value);
    this._params.append(col, `${op}.${v}`);
    return this;
  }

  eq(col, val)    { return this._filter(col, 'eq',    val); }
  neq(col, val)   { return this._filter(col, 'neq',   val); }
  lt(col, val)    { return this._filter(col, 'lt',    val); }
  lte(col, val)   { return this._filter(col, 'lte',   val); }
  gt(col, val)    { return this._filter(col, 'gt',    val); }
  gte(col, val)   { return this._filter(col, 'gte',   val); }
  like(col, val)  { return this._filter(col, 'like',  val); }
  ilike(col, val) { return this._filter(col, 'ilike', val); }
  is(col, val)    { return this._filter(col, 'is',    val); }

  not(col, operator, value) {
    const v = value === null ? 'null' : String(value);
    this._params.append(col, `not.${operator}.${v}`);
    return this;
  }

  in(col, values) {
    this._params.append(col, `in.(${values.join(',')})`);
    return this;
  }

  match(obj) {
    Object.entries(obj).forEach(([col, val]) => this.eq(col, val));
    return this;
  }

  order(col, { ascending = true, nullsFirst = false } = {}) {
    const dir   = ascending  ? 'asc'        : 'desc';
    const nulls = nullsFirst ? 'nullsfirst' : 'nullslast';
    const prev  = this._params.get('order');
    this._params.set('order', prev ? `${prev},${col}.${dir}.${nulls}` : `${col}.${dir}.${nulls}`);
    return this;
  }

  limit(n) {
    this._params.set('limit', String(n));
    return this;
  }

  single() {
    this._headers['Accept'] = 'application/vnd.pgrst.object+json';
    return this;
  }

  update(data) {
    this._method = 'PATCH';
    this._body   = data;
    this._headers['Content-Type'] = 'application/json';
    this._headers['Prefer']       = 'return=representation';
    if (!this._hasSelect) this._params.set('select', '*');
    return this;
  }

  insert(data) {
    this._method = 'POST';
    this._body   = data;
    this._headers['Content-Type'] = 'application/json';
    this._headers['Prefer']       = 'return=representation';
    return this;
  }

  upsert(data, { onConflict } = {}) {
    this._method = 'POST';
    this._body   = data;
    this._headers['Content-Type'] = 'application/json';
    let prefer = 'resolution=merge-duplicates,return=representation';
    if (onConflict) prefer += `;on_conflict=${onConflict}`;
    this._headers['Prefer'] = prefer;
    return this;
  }

  delete() {
    this._method = 'DELETE';
    this._headers['Prefer'] = 'return=representation';
    return this;
  }

  then(resolve, reject) { return this._run().then(resolve, reject); }
  catch(fn)             { return this._run().catch(fn); }

  async _run() {
    if (this._method === 'GET' && !this._hasSelect) {
      this._params.set('select', '*');
    }
    const url = `${resolveBaseUrl()}/rest/v1/${this._table}?${this._params.toString()}`;
    try {
      const resp = await fetch(url, {
        method:  this._method,
        headers: this._headers,
        ...(this._body != null && { body: JSON.stringify(this._body) }),
      });
      const text = await resp.text();
      let parsed = null;
      try { parsed = text ? JSON.parse(text) : null; } catch (_) {}
      if (!resp.ok) {
        return { data: null, error: parsed || { message: resp.statusText, code: String(resp.status) } };
      }
      return { data: parsed, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  }
}

// ─── Storage client ───────────────────────────────────────────────────────────

class StorageBucket {
  constructor(bucket) {
    this._bucket = bucket;
    this._key    = import.meta.env.VITE_API_ANON_KEY
                || import.meta.env.REACT_APP_API_ANON_KEY
                || '';
  }

  _auth() {
    return this._key ? { Authorization: `Bearer ${this._key}` } : {};
  }

  // URL pública de um arquivo — servida como estático pelo nginx/Vite.
  getPublicUrl(path) {
    return { data: { publicUrl: `/storage/v1/object/public/${this._bucket}/${path}` } };
  }

  async upload(path, file, { cacheControl, upsert = false } = {}) {
    const headers = { ...this._auth() };
    if (upsert) headers['x-upsert'] = 'true';
    try {
      const resp = await fetch(`/storage/v1/object/${this._bucket}/${path}`, {
        method: 'POST', headers, body: file,
      });
      const parsed = await resp.json().catch(() => null);
      if (!resp.ok) return { data: null, error: parsed || { message: resp.statusText } };
      return { data: parsed, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  }

  async remove(paths) {
    try {
      const resp = await fetch(`/storage/v1/object/${this._bucket}`, {
        method: 'DELETE',
        headers: { ...this._auth(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ prefixes: paths }),
      });
      const parsed = await resp.json().catch(() => null);
      if (!resp.ok) return { data: null, error: parsed || { message: resp.statusText } };
      return { data: parsed, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  }

  async list(prefix = '', { limit = 100, offset = 0, sortBy } = {}) {
    try {
      const resp = await fetch(`/storage/v1/object/list/${this._bucket}`, {
        method: 'POST',
        headers: { ...this._auth(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ prefix, limit, offset, sortBy: sortBy || { column: 'name', order: 'asc' } }),
      });
      const parsed = await resp.json().catch(() => null);
      if (!resp.ok) return { data: null, error: parsed || { message: resp.statusText } };
      return { data: parsed, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  }

  async download(path) {
    try {
      const resp = await fetch(`/storage/v1/object/${this._bucket}/${path}`, {
        headers: this._auth(),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ message: resp.statusText }));
        return { data: null, error: err };
      }
      return { data: await resp.blob(), error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  }
}

// ─── Exportação ───────────────────────────────────────────────────────────────

export const supabase = {
  from:    (table)  => new QueryBuilder(table),
  storage: { from: (bucket) => new StorageBucket(bucket) },
  auth:    { getSession: async () => ({ data: { session: null }, error: null }) },
};
