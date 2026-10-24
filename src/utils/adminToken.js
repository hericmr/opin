// Token JWT do admin, emitido pelo servidor em POST /rest/v1/rpc/login.
// A assinatura é validada pelo PostgREST; aqui só lemos o payload para saber
// se ainda vale a pena enviá-lo (um token vencido faz até as leituras darem 401).

export const ADMIN_TOKEN_KEY = 'opin_admin_token';

// Disparado em window quando o token é gravado, para todas as instâncias de
// useAuth (ProtectedRoute, Navbar...) reverem o estado sem recarregar a página.
export const ADMIN_TOKEN_EVENT = 'opin-admin-token';

/**
 * Decodifica o payload de um JWT sem validar a assinatura.
 * @param {string} token
 * @returns {Object|null}
 */
export function decodeJwtPayload(token) {
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64).split('').map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Payload do token salvo, ou null se ausente, malformado ou vencido.
 * @returns {Object|null}
 */
export function getAdminTokenPayload() {
  let token = null;
  try {
    token = localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now()) {
    return null;
  }
  return payload;
}

/**
 * Token salvo, se ainda válido.
 * @returns {string|null}
 */
export function getValidAdminToken() {
  return getAdminTokenPayload() ? localStorage.getItem(ADMIN_TOKEN_KEY) : null;
}
