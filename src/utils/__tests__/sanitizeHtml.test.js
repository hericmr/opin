import { sanitizeHtml } from '../sanitizeHtml';

describe('sanitizeHtml', () => {
  it('retorna string vazia para valores vazios', () => {
    expect(sanitizeHtml(null)).toBe('');
    expect(sanitizeHtml(undefined)).toBe('');
    expect(sanitizeHtml('')).toBe('');
  });

  it('mantém a formatação usada nas histórias', () => {
    const html = '<h3>Título</h3><p class="ql-align-center"><strong>forte</strong> <em>ênfase</em></p><ul><li>item</li></ul><br>';
    expect(sanitizeHtml(html)).toBe(html);
  });

  it('mantém links e imagens', () => {
    const html = '<a href="https://opin.unifesp.br" target="_blank">x</a><img src="/a.webp" alt="a">';
    expect(sanitizeHtml(html)).toBe(html);
  });

  it('remove scripts e handlers de evento', () => {
    expect(sanitizeHtml('<p>ok</p><script>alert(1)</script>')).toBe('<p>ok</p>');
    expect(sanitizeHtml('<img src="x" onerror="alert(1)">')).toBe('<img src="x">');
    expect(sanitizeHtml('<p onclick="alert(1)">a</p>')).toBe('<p>a</p>');
  });

  it('remove URLs javascript: e iframes', () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">a</a>')).toBe('<a>a</a>');
    expect(sanitizeHtml('<iframe src="https://evil.example"></iframe>')).toBe('');
  });
});
