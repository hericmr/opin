import { formatarEscolasListagem, getEscolasListagem } from '../escolasService';
import { supabase } from '../../dbClient';

jest.mock('../../dbClient', () => ({ supabase: { from: jest.fn() } }));

const mockSelect = (resultado) => {
  const select = jest.fn().mockResolvedValue(resultado);
  supabase.from.mockReturnValue({ select });
  return select;
};

describe('formatarEscolasListagem', () => {
  it('mapeia as colunas do banco para os campos do front', () => {
    const [e] = formatarEscolasListagem([{ id: 1, Escola: 'E.E.I. Teste', 'Município': 'Avaí', Latitude: '-22.1', Longitude: '-49.3' }]);
    expect(e).toMatchObject({ id: 1, titulo: 'E.E.I. Teste', nome: 'E.E.I. Teste', municipio: 'Avaí' });
  });

  it('descarta linhas sem nome de escola ou que não são objetos', () => {
    expect(formatarEscolasListagem([null, [], 'x', { id: 2 }, { id: 3, Escola: '' }])).toEqual([]);
  });

  it('mantém escolas sem coordenadas', () => {
    expect(formatarEscolasListagem([{ id: 4, Escola: 'Sem coordenadas' }])).toHaveLength(1);
  });

  it('devolve lista vazia para entrada que não é array', () => {
    expect(formatarEscolasListagem(null)).toEqual([]);
  });
});

describe('getEscolasListagem', () => {
  it('consulta escolas_completa só com os campos de listagem', async () => {
    const select = mockSelect({ data: [{ id: 1, Escola: 'A' }], error: null });
    const escolas = await getEscolasListagem();
    expect(supabase.from).toHaveBeenCalledWith('escolas_completa');
    expect(select.mock.calls[0][0]).toContain('"Escola"');
    expect(select.mock.calls[0][0]).not.toContain('*');
    expect(escolas).toHaveLength(1);
  });

  it('propaga o erro do banco', async () => {
    mockSelect({ data: null, error: { message: 'falhou' } });
    await expect(getEscolasListagem()).rejects.toEqual({ message: 'falhou' });
  });
});
