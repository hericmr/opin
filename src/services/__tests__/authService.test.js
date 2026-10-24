import { AuthService } from '../authService';
import { supabase } from '../../dbClient';
import { ADMIN_TOKEN_KEY, decodeJwtPayload, getValidAdminToken } from '../../utils/adminToken';

jest.mock('../../dbClient', () => ({ supabase: { rpc: jest.fn() } }));
jest.mock('../../utils/logger', () => ({ error: jest.fn(), debug: jest.fn() }));

// UTF-8, como o PostgreSQL emite
const b64url = (obj) => btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const makeJwt = (payload) => `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url(payload)}.assinatura`;
const now = () => Math.floor(Date.now() / 1000);

describe('adminToken', () => {
  beforeEach(() => localStorage.clear());

  it('decodifica o payload, inclusive com acentos', () => {
    const token = makeJwt({ username: 'joão', exp: 1 });
    expect(decodeJwtPayload(token)).toEqual({ username: 'joão', exp: 1 });
  });

  it('retorna null para token malformado', () => {
    expect(decodeJwtPayload('nao-e-jwt')).toBeNull();
    expect(decodeJwtPayload('a.!!!.c')).toBeNull();
  });

  it('só devolve o token salvo enquanto não venceu', () => {
    const valido = makeJwt({ role: 'opin_admin', exp: now() + 60 });
    localStorage.setItem(ADMIN_TOKEN_KEY, valido);
    expect(getValidAdminToken()).toBe(valido);

    localStorage.setItem(ADMIN_TOKEN_KEY, makeJwt({ role: 'opin_admin', exp: now() - 1 }));
    expect(getValidAdminToken()).toBeNull();
  });

  it('ignora o token Base64 antigo (sem assinatura)', () => {
    localStorage.setItem(ADMIN_TOKEN_KEY, btoa(JSON.stringify({ username: 'admin', exp: Date.now() + 1e6 })));
    expect(getValidAdminToken()).toBeNull();
  });
});

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
    supabase.rpc.mockReset();
  });

  it('autentica pelo servidor e devolve o JWT', async () => {
    const token = makeJwt({ role: 'opin_admin', username: 'admin', exp: now() + 3600 });
    supabase.rpc.mockResolvedValue({ data: { token, username: 'admin', role: 'opin_admin' }, error: null });

    const result = await AuthService.authenticate('  segredo  ');

    expect(supabase.rpc).toHaveBeenCalledWith('login', { senha: 'segredo' });
    expect(result).toEqual({ success: true, token, user: { username: 'admin', role: 'opin_admin' } });
  });

  it('senha errada (28P01) vira "Senha incorreta"', async () => {
    supabase.rpc.mockResolvedValue({ data: null, error: { code: '28P01', message: 'Senha incorreta' } });
    expect(await AuthService.authenticate('x')).toEqual({ success: false, error: 'Senha incorreta' });
  });

  it('outros erros viram erro interno', async () => {
    supabase.rpc.mockResolvedValue({ data: null, error: { message: 'Failed to fetch' } });
    expect(await AuthService.authenticate('x')).toEqual({ success: false, error: 'Erro interno de autenticação' });
  });

  it('senha vazia não chama o servidor', async () => {
    expect(await AuthService.authenticate('   ')).toEqual({ success: false, error: 'Senha incorreta' });
    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it('isAuthenticated / getCurrentUser leem o JWT salvo', async () => {
    expect(await AuthService.isAuthenticated()).toBe(false);
    expect(await AuthService.getCurrentUser()).toBeNull();

    const iat = now();
    AuthService.setToken(makeJwt({ role: 'opin_admin', username: 'admin', iat, exp: iat + 3600 }));

    expect(await AuthService.isAuthenticated()).toBe(true);
    expect(await AuthService.getCurrentUser()).toEqual({ username: 'admin', role: 'opin_admin', loginTime: iat * 1000 });
  });

  it('isTokenExpiringSoon só nas últimas 2 horas', async () => {
    AuthService.setToken(makeJwt({ role: 'opin_admin', exp: now() + 3 * 3600 }));
    expect(await AuthService.isTokenExpiringSoon()).toBe(false);

    AuthService.setToken(makeJwt({ role: 'opin_admin', exp: now() + 3600 }));
    expect(await AuthService.isTokenExpiringSoon()).toBe(true);
  });
});
