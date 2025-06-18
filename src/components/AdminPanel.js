import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Search, Filter, Edit2, Trash2, X, MapPin, Star } from 'lucide-react';
import EditLocationPanel from './EditLocationPanel';

// Função para calcular a pontuação
const calcularPontuacao = (location) => {
  let pontuacao = 0;
  
  // Título (15 pontos)
  if (location.Escola && location.Escola !== "Título não disponível") {
    pontuacao += 15;
  }
  
  // Descrição detalhada (25 pontos)
  if (location.descricao_detalhada && location.descricao_detalhada.length > 100) {
    pontuacao += 25;
  }
  
  // Imagens (15 pontos)
  if (location.imagens && location.imagens.length > 0) {
    pontuacao += 15;
  }
  
  // Áudio (15 pontos)
  if (location.audio) {
    pontuacao += 15;
  }
  
  // Links (15 pontos)
  if (location.links && location.links.length > 0) {
    pontuacao += 15;
  }

  // Vídeo (15 pontos)
  if (location.video) {
    pontuacao += 15;
  }

  // Documentos PDF (15 pontos)
  if (location.documentos && location.documentos.split(',').filter(url => url).length > 0) {
    pontuacao += 15;
  }

  return Math.round((pontuacao / 115) * 100); // Ajustado para 115 pontos máximos
};

const AdminPanel = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('todos');
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Buscar todos os locais
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('escolas_completa')
          .select('*')
          .order('Escola', { ascending: true });

        if (error) throw error;
        setLocations(data);
      } catch (err) {
        console.error('Erro ao buscar locais:', err);
        setError('Não foi possível carregar os locais. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Filtrar locais baseado na busca e tipo selecionado
  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.Escola?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.descricao_detalhada?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'todos' || location.tipo === selectedType;
    return matchesSearch && matchesType;
  });

  // Tipos únicos para o filtro
  const uniqueTypes = ['todos', ...new Set(locations.map(loc => loc.tipo))];

  const handleDelete = async (location) => {
    if (window.confirm(`Tem certeza que deseja excluir o local "${location.Escola}"?`)) {
      try {
        setLoading(true);
        const { error } = await supabase
          .from('escolas_completa')
          .delete()
          .eq('id', location.id);

        if (error) throw error;

        // Atualiza a lista local removendo o item excluído
        setLocations(locations.filter(loc => loc.id !== location.id));
        setError(null);
      } catch (err) {
        console.error('Erro ao excluir local:', err);
        setError('Não foi possível excluir o local. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (location) => {
    setEditingLocation(location);
  };

  const handleSaveEdit = async (updatedLocation) => {
    if (!updatedLocation || !updatedLocation.id) {
      setError('Dados do local inválidos. Por favor, tente novamente.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const { error } = await supabase
        .from('escolas_completa')
        .update({
          Escola: updatedLocation.Escola,
          tipo: updatedLocation.tipo,
          descricao_detalhada: updatedLocation.descricao_detalhada,
          localizacao: `${updatedLocation.latitude},${updatedLocation.longitude}`,
          links: updatedLocation.links,
          audio: updatedLocation.audio,
          imagens: updatedLocation.imagens,
          documentos: updatedLocation.documentos,
        })
        .eq('id', updatedLocation.id);

      if (error) throw error;

      // Atualiza a lista local com o item editado
      setLocations(locations.map(loc => 
        loc.id === updatedLocation.id ? updatedLocation : loc
      ));
      setEditingLocation(null);
    } catch (err) {
      console.error('Erro ao atualizar local:', err);
      setError('Não foi possível atualizar o local. Por favor, tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Painel de Administração</h1>
        
        {/* Barra de ferramentas */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Campo de busca */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por título ou descrição..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filtro por tipo */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="pl-10 pr-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Painel de Edição */}
        {editingLocation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Editar Local</h2>
                <button
                  onClick={() => setEditingLocation(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <EditLocationPanel
                location={editingLocation}
                onClose={() => setEditingLocation(null)}
                onSave={handleSaveEdit}
              />
            </div>
          </div>
        )}

        {/* Tabela de locais */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Carregando...</div>
          ) : filteredLocations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhum local encontrado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Escola
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Localização
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Documentos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Pontuação
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLocations.map((location) => {
                      const pontuacao = calcularPontuacao(location);
                      const documentos = location.documentos ? location.documentos.split(',').filter(url => url) : [];
                      return (
                        <tr key={location.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {location.Escola}
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-2">
                              {location.descricao_detalhada?.replace(/<[^>]*>/g, '')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              location.tipo === 'lazer' ? 'bg-blue-100 text-blue-800' :
                              location.tipo === 'assistencia' ? 'bg-green-100 text-green-800' :
                              location.tipo === 'historico' ? 'bg-yellow-100 text-yellow-800' :
                              location.tipo === 'comunidades' ? 'bg-red-100 text-red-800' :
                              location.tipo === 'educação' ? 'bg-violet-100 text-violet-800' :
                              location.tipo === 'religiao' ? 'bg-gray-100 text-gray-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {location.tipo}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="w-4 h-4 mr-1" />
                              {location.localizacao}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500">
                              {documentos.length > 0 ? (
                                <span className="text-green-600">
                                  {documentos.length} {documentos.length === 1 ? 'documento' : 'documentos'}
                                </span>
                              ) : (
                                <span className="text-gray-400">Sem documentos</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div 
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    pontuacao >= 80 ? 'bg-green-500' :
                                    pontuacao >= 60 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${pontuacao}%` }}
                                />
                              </div>
                              <div className="flex items-center text-sm">
                                <Star className="w-4 h-4 mr-1 text-yellow-400" />
                                {pontuacao}%
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(location)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              <Edit2 className="w-4 h-4 inline" />
                            </button>
                            <button
                              onClick={() => handleDelete(location)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(AdminPanel); 