#!/usr/bin/env python3
"""
Minimal file storage server — drop-in replacement for supabase/storage-api.
Serves /storage/v1/object/public/{bucket}/{path} and handles upload/delete/list.
No external dependencies — stdlib only.
"""
import base64, hashlib, hmac, json, os, mimetypes, shutil, time
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

STORAGE_ROOT = os.environ.get('FILE_STORAGE_BACKEND_PATH', '/var/lib/storage')
PORT = int(os.environ.get('SERVER_PORT', 5000))
# Mesmo segredo do PostgREST: upload/delete exigem o JWT do admin ("admin": true, de rpc/login)
JWT_SECRET = os.environ.get('JWT_SECRET', '')


def _b64url_decode(part):
    return base64.urlsafe_b64decode(part + '=' * (-len(part) % 4))


def verify_jwt(token):
    """Return the payload of a valid, unexpired HS256 JWT, or None."""
    if not JWT_SECRET or not token:
        return None
    try:
        header_b64, payload_b64, sig_b64 = token.split('.')
        header = json.loads(_b64url_decode(header_b64))
        if header.get('alg') != 'HS256':
            return None
        expected = hmac.new(JWT_SECRET.encode(), f'{header_b64}.{payload_b64}'.encode(), hashlib.sha256).digest()
        if not hmac.compare_digest(expected, _b64url_decode(sig_b64)):
            return None
        payload = json.loads(_b64url_decode(payload_b64))
    except (ValueError, TypeError):
        return None
    exp = payload.get('exp')
    if not isinstance(exp, (int, float)) or exp <= time.time():
        return None
    return payload


def resolve(bucket, path):
    """Return absolute filesystem path; raises ValueError if path escapes root."""
    full = os.path.realpath(os.path.join(STORAGE_ROOT, bucket, path))
    root = os.path.realpath(os.path.join(STORAGE_ROOT, bucket))
    if not full.startswith(root + os.sep) and full != root:
        raise ValueError('path traversal')
    return full


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass  # suppress per-request noise

    def _authorized(self):
        auth = self.headers.get('Authorization', '')
        token = auth[7:] if auth.startswith('Bearer ') else ''
        payload = verify_jwt(token)
        return bool(payload) and payload.get('admin') is True

    # ── routing ──────────────────────────────────────────────────────────────

    def do_GET(self):
        p = urlparse(self.path).path
        # /storage/v1/object/public/{bucket}/{rest}
        # /storage/v1/object/{bucket}/{rest}
        prefix_pub = '/storage/v1/object/public/'
        prefix_obj = '/storage/v1/object/'
        if p.startswith(prefix_pub):
            tail = p[len(prefix_pub):]
        elif p.startswith(prefix_obj):
            tail = p[len(prefix_obj):]
        else:
            return self._send(404, {'error': 'not found'})
        parts = tail.split('/', 1)
        if len(parts) < 2:
            return self._send(400, {'error': 'missing path'})
        bucket, rel = parts
        try:
            fpath = resolve(bucket, rel)
        except ValueError:
            return self._send(400, {'error': 'invalid path'})
        if not os.path.isfile(fpath):
            return self._send(404, {'error': 'not found'})
        mime, _ = mimetypes.guess_type(fpath)
        with open(fpath, 'rb') as f:
            data = f.read()
        self.send_response(200)
        self.send_header('Content-Type', mime or 'application/octet-stream')
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Cache-Control', 'public, max-age=31536000')
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        p = urlparse(self.path).path
        # /storage/v1/object/list/{bucket}
        if p.startswith('/storage/v1/object/list/'):
            return self._handle_list(p[len('/storage/v1/object/list/'):])
        # /storage/v1/object/{bucket}/{path}
        if p.startswith('/storage/v1/object/'):
            tail = p[len('/storage/v1/object/'):]
            parts = tail.split('/', 1)
            if len(parts) < 2:
                return self._send(400, {'error': 'missing path'})
            if not self._authorized():
                return self._send(401, {'error': 'unauthorized'})
            return self._handle_upload(parts[0], parts[1])
        self._send(404, {'error': 'not found'})

    def do_DELETE(self):
        p = urlparse(self.path).path
        if not p.startswith('/storage/v1/object/'):
            return self._send(404, {'error': 'not found'})
        if not self._authorized():
            return self._send(401, {'error': 'unauthorized'})
        bucket = p[len('/storage/v1/object/'):].split('/')[0]
        length = int(self.headers.get('Content-Length', 0))
        body = json.loads(self.rfile.read(length)) if length else {}
        prefixes = body.get('prefixes', [])
        deleted = []
        for prefix in prefixes:
            # Prefixo vazio resolveria para a raiz do bucket e apagaria tudo
            if not isinstance(prefix, str) or not prefix.strip('/'):
                continue
            try:
                fpath = resolve(bucket, prefix)
            except ValueError:
                continue
            if os.path.isfile(fpath):
                os.remove(fpath)
                deleted.append(prefix)
            elif os.path.isdir(fpath):
                shutil.rmtree(fpath)
                deleted.append(prefix)
        self._send(200, [{'name': p} for p in deleted])

    # ── handlers ─────────────────────────────────────────────────────────────

    def _handle_upload(self, bucket, rel):
        try:
            fpath = resolve(bucket, rel)
        except ValueError:
            return self._send(400, {'error': 'invalid path'})
        os.makedirs(os.path.dirname(fpath), exist_ok=True)
        length = int(self.headers.get('Content-Length', 0))
        data = self.rfile.read(length)
        with open(fpath, 'wb') as f:
            f.write(data)
        self._send(200, {'Key': f'{bucket}/{rel}'})

    def _handle_list(self, bucket):
        length = int(self.headers.get('Content-Length', 0))
        body = json.loads(self.rfile.read(length)) if length else {}
        prefix = body.get('prefix', '').strip('/')
        limit  = int(body.get('limit', 100))
        offset = int(body.get('offset', 0))
        bucket_root = os.path.join(STORAGE_ROOT, bucket)
        search_root = os.path.join(bucket_root, prefix) if prefix else bucket_root
        items = []
        if os.path.isdir(search_root):
            for name in sorted(os.listdir(search_root)):
                fpath = os.path.join(search_root, name)
                stat  = os.stat(fpath)
                items.append({
                    'name': name,
                    'id': name,
                    'updated_at': None,
                    'created_at': None,
                    'last_accessed_at': None,
                    'metadata': {'size': stat.st_size, 'mimetype': mimetypes.guess_type(name)[0]},
                })
        self._send(200, items[offset:offset + limit])

    # ── helpers ───────────────────────────────────────────────────────────────

    def _send(self, code, body):
        payload = json.dumps(body).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)


if __name__ == '__main__':
    print(f'Storage server listening on :{PORT}  root={STORAGE_ROOT}', flush=True)
    HTTPServer(('0.0.0.0', PORT), Handler).serve_forever()
