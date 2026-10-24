import { getLocalImageUrl, getStorageUrl, isLocalImage } from '../imageUtils';

const P = '/data/storage/opin/';

describe('getLocalImageUrl', () => {
  it.each([
    [undefined, undefined],
    ['', ''],
    ['11/foto.webp', `${P}imagens-das-escolas/11/foto.webp`],
    ['imagens-professores/3/a.webp', `${P}imagens-professores/3/a.webp`],
    [`${P}23/x.webp`, `${P}imagens-das-escolas/23/x.webp`],
    [`${P}avatar/x.webp`, `${P}avatar/x.webp`],
    [`https://opin.unifesp.br${P}23/x.webp`, `${P}imagens-das-escolas/23/x.webp`],
    ['https://abc.supabase.co/storage/v1/object/public/imagens-das-escolas/5/y.jpg', `${P}imagens-das-escolas/5/y.jpg`],
    ['https://exemplo.org/foto.png', 'https://exemplo.org/foto.png'],
    ['/images/logo.png', '/images/logo.png'],
    ['data:image/png;base64,AAA', 'data:image/png;base64,AAA'],
    ['blob:http://localhost/abc', 'blob:http://localhost/abc'],
  ])('%s → %s', (entrada, saida) => {
    expect(getLocalImageUrl(entrada)).toBe(saida);
  });

  it('usa o bucket informado quando o caminho não traz um', () => {
    expect(getLocalImageUrl('3/a.webp', 'imagens-professores')).toBe(`${P}imagens-professores/3/a.webp`);
  });
});

describe('getStorageUrl', () => {
  it.each([
    [undefined, ''],
    ['11/foto.webp', `${P}imagens-das-escolas/11/foto.webp`],
    ['/11/foto.webp', `${P}imagens-das-escolas/11/foto.webp`],
    ['imagens-professores/3/a.webp', `${P}imagens-professores/3/a.webp`],
    [`${P}23/x.webp`, `${P}imagens-das-escolas/23/x.webp`],
    ['https://exemplo.org/foto.png', 'https://exemplo.org/foto.png'],
  ])('%s → %s', (entrada, saida) => {
    expect(getStorageUrl(entrada)).toBe(saida);
  });

  it('usa o bucket informado', () => {
    expect(getStorageUrl('3/a.webp', 'imagens-professores')).toBe(`${P}imagens-professores/3/a.webp`);
  });
});

describe('isLocalImage', () => {
  it.each([
    ['11/foto.webp', true],
    [`${P}x.webp`, true],
    ['https://abc.supabase.co/storage/v1/object/public/b/x.jpg', true],
    ['https://exemplo.org/foto.png', false],
    ['/images/logo.png', false],
    ['', false],
  ])('%s → %s', (entrada, saida) => {
    expect(isLocalImage(entrada)).toBe(saida);
  });
});
