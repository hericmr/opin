import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orangeIcon, blackIcon, violetIcon, redIcon, blueIcon, greenIcon, yellowIcon } from './CustomIcon';

const CATEGORIAS = {
  'lazer': { cor: 'blue-700', icone: blueIcon, label: 'Lazer' },
  'assistencia': { cor: 'green-700', icone: greenIcon, label: 'Assistência' },
  'historico': { cor: 'yellow-600', icone: yellowIcon, label: 'Históricos' },
  'comunidades': { cor: 'red-600', icone: redIcon, label: 'Comunidades' },
  'educação': { cor: 'violet-600', icone: violetIcon, label: 'Educação' },
  'religiao': { cor: 'black', icone: blackIcon, label: 'Religião' },
  'bairro': { cor: 'orange-500', icone: orangeIcon, label: 'Bairro' }
};

const ConteudoCartografia = ({ locations }) => {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todos');
  const [termoBusca, setTermoBusca] = useState('');
  const navigate = useNavigate();

  // Função para converter título em slug
  const criarSlug = (texto) => {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-')     // Substitui caracteres especiais por hífen
      .replace(/^-+|-+$/g, '')         // Remove hífens do início e fim
      .trim();
  };

  // Agrupa os locais por categoria
  const locaisPorCategoria = locations.reduce((acc, local) => {
    const categoria = local.tipo?.toLowerCase() || 'outros';
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(local);
    return acc;
  }, {});

  // Filtra os locais baseado na busca
  const filtrarLocais = (locais) => {
    if (!termoBusca) return locais;
    const termo = termoBusca.toLowerCase();
    return locais.filter(local => 
      local.titulo?.toLowerCase().includes(termo) ||
      local.descricao_detalhada?.toLowerCase().includes(termo)
    );
  };

  const abrirLocal = (local) => {
    const slug = criarSlug(local.titulo);
    navigate(`/?panel=${slug}`);
  };

  // Função para renderizar o ícone SVG com a cor correta
  const renderIconeSVG = (categoria) => {
    const categoriaInfo = CATEGORIAS[categoria.toLowerCase()];
    if (!categoriaInfo) return null;

    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
        <path
          fill="currentColor"
          className={`text-${categoriaInfo.cor}`}
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        />
        <circle cx="12" cy="9" r="3" fill="white"/>
      </svg>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Cabeçalho fixo */}
      <div className="p-4 sm:p-6 lg:p-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Conteúdo da Cartografia Social
          </h1>

          {/* Barra de busca e filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Buscar por título ou descrição..."
              className="flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
            <select
              className="p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={categoriaSelecionada}
              onChange={(e) => setCategoriaSelecionada(e.target.value)}
            >
              <option value="todos">Todas as categorias</option>
              {Object.entries(CATEGORIAS).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Conteúdo com rolagem */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {Object.entries(locaisPorCategoria)
            .filter(([categoria]) => 
              categoriaSelecionada === 'todos' || categoria.toLowerCase() === categoriaSelecionada.toLowerCase()
            )
            .map(([categoria, locais]) => {
              const locaisFiltrados = filtrarLocais(locais);
              if (locaisFiltrados.length === 0) return null;

              const categoriaInfo = CATEGORIAS[categoria.toLowerCase()];
              if (!categoriaInfo) return null;

              return (
                <div key={categoria} className="bg-white rounded-lg shadow-lg p-6 transition-all hover:shadow-xl">
                  <div className="flex items-center mb-6 pb-3 border-b">
                    {renderIconeSVG(categoria)}
                    <h2 className={`text-xl font-semibold ml-2 text-${categoriaInfo.cor}`}>
                      {categoriaInfo.label}
                    </h2>
                    <span className="ml-auto text-sm text-gray-500">
                      {locaisFiltrados.length} {locaisFiltrados.length === 1 ? 'local' : 'locais'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {locaisFiltrados.map((local) => (
                      <div
                        key={local.id}
                        onClick={() => abrirLocal(local)}
                        className="cursor-pointer border rounded-lg p-5 hover:bg-gray-50 transition-all duration-200 hover:shadow-md group"
                      >
                        <h3 className="font-medium text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {local.titulo}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {local.descricao_detalhada?.replace(/<[^>]*>/g, '').substring(0, 200)}...
                        </p>
                        <div className="mt-3 text-sm text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          Clique para ver mais →
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ConteudoCartografia; 