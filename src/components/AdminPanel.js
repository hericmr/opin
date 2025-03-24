import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Search, Filter, Edit2, Trash2, X } from 'lucide-react';
import EditLocationPanel from './EditLocationPanel';

const AdminPanel = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('todos');
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);

  // Buscar todos os locais
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('locations3')
          .select('*')
          .order('titulo', { ascending: true });

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
    const matchesSearch = location.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.descricao_detalhada?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'todos' || location.tipo === selectedType;
    return matchesSearch && matchesType;
  });

  // Tipos únicos para o filtro
  const uniqueTypes = ['todos', ...new Set(locations.map(loc => loc.tipo))];

  const handleDelete = async (location) => {
    if (window.confirm(`Tem certeza que deseja excluir o local "${location.titulo}"?`)) {
      try {
        setLoading(true);
        const { error } = await supabase
          .from('locations3')
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

  const handleSaveEdit = async (e, updatedLocation) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('locations3')
        .update({
          titulo: updatedLocation.titulo,
          tipo: updatedLocation.tipo,
          descricao_detalhada: updatedLocation.descricao_detalhada,
          localizacao: `${updatedLocation.latitude},${updatedLocation.longitude}`,
          links: updatedLocation.links,
          audio: updatedLocation.audio,
          imagens: updatedLocation.imagens,
        })
        .eq('id', updatedLocation.id);

      if (error) throw error;

      // Atualiza a lista local com o item editado
      setLocations(locations.map(loc => 
        loc.id === updatedLocation.id ? updatedLocation : loc
      ));
      setEditingLocation(null);
      setError(null);
    } catch (err) {
      console.error('Erro ao atualizar local:', err);
      setError('Não foi possível atualizar o local. Por favor, tente novamente.');
    } finally {
      setLoading(false);
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
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Localização
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLocations.map((location) => (
                    <tr key={location.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {location.titulo}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {location.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {location.localizacao}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={(e) => handleEdit(location)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={(e) => handleDelete(location)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 