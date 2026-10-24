import { supabase } from '../dbClient';
import { ADMIN_TOKEN_KEY } from '../utils/adminToken';

const b64url = (obj) => btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const makeJwt = (payload) => `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url(payload)}.assinatura`;
const now = () => Math.floor(Date.now() / 1000);

const resposta = (status, corpo) => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: `status ${status}`,
  text: async () => (corpo === undefined ? '' : JSON.stringify(corpo)),
  json: async () => corpo,
});

// Última chamada ao fetch: { url (sem a origem), params, init }
const ultimaChamada = () => {
  const [url, init] = global.fetch.mock.calls.at(-1);
  const u = new URL(url);
  return { path: u.pathname, params: u.searchParams, init };
};

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn().mockResolvedValue(resposta(200, []));
});

describe('QueryBuilder', () => {
  it('monta um GET com select, filtros, ordem e limite', async () => {
    await supabase
      .from('escolas_completa')
      .select('id,titulo')
      .eq('ativo', true)
      .ilike('titulo', '%guarani%')
      .in('id', [1, 2])
      .is('foto', null)
      .order('ordem', { ascending: false, nullsFirst: true })
      .order('id')
      .limit(5);

    const { path, params, init } = ultimaChamada();
    expect(path).toBe('/rest/v1/escolas_completa');
    expect(init.method).toBe('GET');
    expect(init.body).toBeUndefined();
    expect(params.get('select')).toBe('id,titulo');
    expect(params.get('ativo')).toBe('eq.true');
    expect(params.get('titulo')).toBe('ilike.%guarani%');
    expect(params.get('id')).toBe('in.(1,2)');
    expect(params.get('foto')).toBe('is.null');
    expect(params.get('order')).toBe('ordem.desc.nullsfirst,id.asc.nullslast');
    expect(params.get('limit')).toBe('5');
  });

  it('usa select=* quando o GET não define select', async () => {
    await supabase.from('povos').eq('id', 3);
    expect(ultimaChamada().params.get('select')).toBe('*');
  });

  it('pede objeto único com single()', async () => {
    await supabase.from('povos').select('*').eq('id', 3).single();
    expect(ultimaChamada().init.headers.Accept).toBe('application/vnd.pgrst.object+json');
  });

  it('monta PATCH, POST, upsert e DELETE', async () => {
    await supabase.from('povos').update({ nome: 'x' }).eq('id', 1);
    let { init, params } = ultimaChamada();
    expect(init.method).toBe('PATCH');
    expect(JSON.parse(init.body)).toEqual({ nome: 'x' });
    expect(init.headers.Prefer).toBe('return=representation');
    expect(params.get('id')).toBe('eq.1');

    await supabase.from('povos').insert({ nome: 'y' });
    ({ init } = ultimaChamada());
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({ nome: 'y' });

    await supabase.from('povos').upsert({ id: 1 }, { onConflict: 'id' });
    ({ init } = ultimaChamada());
    expect(init.method).toBe('POST');
    expect(init.headers.Prefer).toBe('resolution=merge-duplicates,return=representation;on_conflict=id');

    await supabase.from('povos').delete().eq('id', 1);
    ({ init } = ultimaChamada());
    expect(init.method).toBe('DELETE');
  });

  it('envia o JWT do admin só quando há token válido', async () => {
    await supabase.from('povos').select('*');
    expect(ultimaChamada().init.headers.Authorization).toBeUndefined();

    const token = makeJwt({ admin: true, exp: now() + 3600 });
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    await supabase.from('povos').select('*');
    expect(ultimaChamada().init.headers.Authorization).toBe(`Bearer ${token}`);

    localStorage.setItem(ADMIN_TOKEN_KEY, makeJwt({ admin: true, exp: now() - 10 }));
    await supabase.from('povos').select('*');
    expect(ultimaChamada().init.headers.Authorization).toBeUndefined();
  });

  it('devolve { data, error } conforme a resposta', async () => {
    global.fetch.mockResolvedValueOnce(resposta(200, [{ id: 1 }]));
    expect(await supabase.from('povos').select('*')).toEqual({ data: [{ id: 1 }], error: null });

    global.fetch.mockResolvedValueOnce(resposta(401, { code: '42501', message: 'Escrita exige login de admin' }));
    expect(await supabase.from('povos').update({ nome: 'x' })).toEqual({
      data: null,
      error: { code: '42501', message: 'Escrita exige login de admin' },
    });

    global.fetch.mockRejectedValueOnce(new Error('rede fora'));
    expect(await supabase.from('povos').select('*')).toEqual({ data: null, error: { message: 'rede fora' } });
  });
});

describe('rpc', () => {
  it('faz POST em /rest/v1/rpc/<fn> com os parâmetros no corpo', async () => {
    global.fetch.mockResolvedValueOnce(resposta(200, { token: 't' }));
    const result = await supabase.rpc('login', { senha: 's' });

    const { path, init } = ultimaChamada();
    expect(path).toBe('/rest/v1/rpc/login');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({ senha: 's' });
    expect(result).toEqual({ data: { token: 't' }, error: null });
  });
});
