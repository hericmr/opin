import { agruparVideos } from '../videoService';

jest.mock('../../dbClient', () => ({ supabase: {} }));

describe('agruparVideos', () => {
  it('junta o mesmo vídeo cadastrado como geral e lindiflix', () => {
    const [v, ...resto] = agruparVideos([
      { id: 15, video_url: 'https://www.youtube.com/embed/3e8N8uGyIvE', titulo: 'Professor Adão Alves', categoria: 'lindiflix' },
      { id: 4, video_url: 'https://www.youtube.com/watch?v=3e8N8uGyIvE', titulo: 'Das crianças da aldeia para o mundo', categoria: 'geral' },
    ]);
    expect(resto).toHaveLength(0);
    expect(v).toMatchObject({ id: 4, titulo: 'Das crianças da aldeia para o mundo', participantes: ['Professor Adão Alves'] });
  });

  it('só lindiflix: sem título, todos viram participantes', () => {
    const [v] = agruparVideos([
      { id: 1, video_url: 'https://youtu.be/yum4n1kHsGE', titulo: 'Professora Iara', categoria: 'lindiflix' },
      { id: 2, video_url: 'https://www.youtube.com/embed/yum4n1kHsGE', titulo: 'Professora Marilene', categoria: 'lindiflix' },
    ]);
    expect(v.titulo).toBeNull();
    expect(v.participantes).toEqual(['Professora Iara', 'Professora Marilene']);
  });

  it('vídeos diferentes continuam separados e na ordem', () => {
    const lista = agruparVideos([
      { id: 1, video_url: 'https://www.youtube.com/embed/aaaaaaaaaaa', titulo: 'A', categoria: 'geral' },
      { id: 2, video_url: 'https://vimeo.com/123456789', titulo: 'B', categoria: 'geral' },
    ]);
    expect(lista.map((v) => v.titulo)).toEqual(['A', 'B']);
    expect(lista[0].participantes).toEqual([]);
  });

  it('aceita lista vazia ou ausente', () => {
    expect(agruparVideos(null)).toEqual([]);
  });
});
