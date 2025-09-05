import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';

const DebugImagens = ({ escola_id }) => {
  const [debugInfo, setDebugInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!escola_id) return;

    const debugImagens = async () => {
      try {
        setLoading(true);
        
        // Debug imagens das escolas
        const { data: imagensEscolas, error: errorEscolas } = await supabase.storage
          .from('imagens-das-escolas')
          .list(`${escola_id}/`);

        // Debug imagens dos professores
        const { data: imagensProfessores, error: errorProfessores } = await supabase.storage
          .from('imagens-professores')
          .list(`${escola_id}/`);

        // Debug bucket avatar
        const { data: imagensAvatar, error: errorAvatar } = await supabase.storage
          .from('avatar')
          .list(`${escola_id}/`);

        setDebugInfo({
          escola_id,
          imagensEscolas: {
            data: imagensEscolas || [],
            error: errorEscolas?.message || null,
            count: imagensEscolas?.length || 0
          },
          imagensProfessores: {
            data: imagensProfessores || [],
            error: errorProfessores?.message || null,
            count: imagensProfessores?.length || 0
          },
          imagensAvatar: {
            data: imagensAvatar || [],
            error: errorAvatar?.message || null,
            count: imagensAvatar?.length || 0
          }
        });

      } catch (error) {
        console.error('Erro no debug:', error);
        setDebugInfo({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    debugImagens();
  }, [escola_id]);

  if (loading) {
    return <div className="p-4 bg-blue-50 rounded-lg">Carregando debug...</div>;
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Debug de Imagens - Escola {escola_id}</h3>
      
      {debugInfo.error && (
        <div className="p-3 bg-red-100 text-red-800 rounded">
          <strong>Erro:</strong> {debugInfo.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Imagens das Escolas */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold text-green-800">Imagens das Escolas</h4>
          <p><strong>Count:</strong> {debugInfo.imagensEscolas?.count || 0}</p>
          {debugInfo.imagensEscolas?.error && (
            <p className="text-red-600"><strong>Erro:</strong> {debugInfo.imagensEscolas.error}</p>
          )}
          {debugInfo.imagensEscolas?.data?.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Arquivos:</p>
              <ul className="text-xs text-gray-600 max-h-32 overflow-y-auto">
                {debugInfo.imagensEscolas.data.map((file, idx) => (
                  <li key={idx}>• {file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Imagens dos Professores */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold text-blue-800">Imagens dos Professores</h4>
          <p><strong>Count:</strong> {debugInfo.imagensProfessores?.count || 0}</p>
          {debugInfo.imagensProfessores?.error && (
            <p className="text-red-600"><strong>Erro:</strong> {debugInfo.imagensProfessores.error}</p>
          )}
          {debugInfo.imagensProfessores?.data?.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Arquivos:</p>
              <ul className="text-xs text-gray-600 max-h-32 overflow-y-auto">
                {debugInfo.imagensProfessores.data.map((file, idx) => (
                  <li key={idx}>• {file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Imagens Avatar */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold text-purple-800">Imagens Avatar</h4>
          <p><strong>Count:</strong> {debugInfo.imagensAvatar?.count || 0}</p>
          {debugInfo.imagensAvatar?.error && (
            <p className="text-red-600"><strong>Erro:</strong> {debugInfo.imagensAvatar.error}</p>
          )}
          {debugInfo.imagensAvatar?.data?.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Arquivos:</p>
              <ul className="text-xs text-gray-600 max-h-32 overflow-y-auto">
                {debugInfo.imagensAvatar.data.map((file, idx) => (
                  <li key={idx}>• {file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Teste de URLs */}
      {debugInfo.imagensEscolas?.data?.length > 0 && (
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold">Teste de URLs - Imagens das Escolas</h4>
          <div className="space-y-2">
            {debugInfo.imagensEscolas.data.slice(0, 3).map((file, idx) => {
              const { data: { publicUrl } } = supabase.storage
                .from('imagens-das-escolas')
                .getPublicUrl(`${escola_id}/${file.name}`);
              
              return (
                <div key={idx} className="text-xs">
                  <p><strong>Arquivo:</strong> {file.name}</p>
                  <p><strong>URL:</strong> <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{publicUrl}</a></p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugImagens;
