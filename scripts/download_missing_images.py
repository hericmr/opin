#!/usr/bin/env python3
"""
Baixa do Supabase cloud os arquivos referenciados no banco mas ausentes localmente.
Uso: python3 scripts/download_missing_images.py
Requer: requests (pip install requests)
"""
import os, sys, json, urllib.request

STORAGE_BASE = os.path.join(os.path.dirname(__file__), '..', 'data', 'storage', 'opin')
POSTGREST_URL = 'http://localhost:3000'
SUPABASE_URL  = 'https://cbzwrxmcuhsxehdrsrvi.supabase.co'

BUCKET_GUESSES = [
    'imagens-das-escolas',
    'imagens-professores',
    'avatar',
]

def fetch_missing():
    import urllib.request, urllib.parse
    url = f'{POSTGREST_URL}/legendas_fotos?select=imagem_url&ativo=eq.true'
    with urllib.request.urlopen(url) as r:
        legendas = json.load(r)

    paths = set(
        row['imagem_url'] for row in legendas
        if row.get('imagem_url') and not row['imagem_url'].startswith('http')
    )

    missing = []
    for p in sorted(paths):
        full = os.path.join(STORAGE_BASE, p)
        webp = os.path.splitext(full)[0] + '.webp'
        if not os.path.exists(full) and not os.path.exists(webp):
            missing.append(p)
    return missing

def try_download(path):
    dest = os.path.join(STORAGE_BASE, path)
    dest_webp = os.path.splitext(dest)[0] + '.webp'
    os.makedirs(os.path.dirname(dest), exist_ok=True)

    for bucket in BUCKET_GUESSES:
        cloud_url = f'{SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}'
        try:
            req = urllib.request.Request(cloud_url, headers={'User-Agent': 'opin-sync/1.0'})
            with urllib.request.urlopen(req, timeout=15) as r:
                if r.status == 200:
                    data = r.read()
                    # Salva sempre como .webp independente da extensão original
                    with open(dest_webp, 'wb') as f:
                        f.write(data)
                    return True, bucket
        except Exception:
            continue
    return False, None

def main():
    print('Buscando arquivos faltando...')
    missing = fetch_missing()
    print(f'Encontrados: {len(missing)} arquivos faltando\n')

    ok, fail = [], []
    for i, path in enumerate(missing, 1):
        success, bucket = try_download(path)
        if success:
            print(f'[{i}/{len(missing)}] ✓ {path}  (bucket: {bucket})')
            ok.append(path)
        else:
            print(f'[{i}/{len(missing)}] ✗ {path}  (não encontrado em nenhum bucket)')
            fail.append(path)

    print(f'\nBaixados: {len(ok)}  |  Não encontrados: {len(fail)}')
    if fail:
        print('\nArquivos não encontrados no Supabase cloud:')
        for p in fail:
            print(f'  {p}')

if __name__ == '__main__':
    main()
