import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

// Testes de fumaça: cada rota principal renderiza sem cair no ErrorBoundary.
// O banco é simulado com listas vazias; o objetivo é pegar erros de import,
// de render e de rota, não validar conteúdo.

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    statusText: 'OK',
    text: async () => '[]',
    json: async () => [],
  });
  window.scrollTo = jest.fn();
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

const renderEm = async (rota) => {
  window.history.pushState({}, '', rota);
  render(<App />);
  // As páginas são lazy: espera a página entrar no <main>
  await waitFor(() => expect(document.getElementById('main-content')).not.toBeNull(), { timeout: 30000 });
};

describe.each(['/', '/mapa', '/escolas', '/historias'])('rota %s', (rota) => {
  it('renderiza sem erro', async () => {
    await renderEm(rota);
    expect(screen.queryByText('Ocorreu um erro inesperado')).toBeNull();
  }, 40000);
});
