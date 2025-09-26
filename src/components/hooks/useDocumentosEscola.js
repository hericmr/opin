import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const useDocumentosEscola = (escolaId) => {
  const [documentos, setDocumentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocumentos = async () => {
      console.log('🔄 Iniciando busca de documentos para escola:', escolaId, 'tipo:', typeof escolaId);
      
      if (!escolaId) {
        console.log('⚠️ Nenhum ID de escola fornecido, retornando array vazio');
        setDocumentos([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('📡 Consultando tabela documentos_escola...');
        
        // Verificar conexão com Supabase
        const { data: authData, error: authError } = await supabase.auth.getSession();
        console.log('🔐 Estado da autenticação:', {
          temSessao: !!authData?.session,
          error: authError
        });

        // Verificar permissões da tabela
        const { error: rlsError } = await supabase
          .from('documentos_escola')
          .select('count')
          .limit(1);

        console.log('🔑 Verificação de permissões:', {
          podeAcessar: !rlsError,
          error: rlsError ? {
            code: rlsError.code,
            message: rlsError.message,
            details: rlsError.details,
            hint: rlsError.hint
          } : null
        });

        // Primeiro, vamos verificar todos os documentos para debug
        const { data: allDocs, error: allDocsError } = await supabase
          .from('documentos_escola')
          .select('*');

        if (allDocsError) {
          console.error('❌ Erro ao buscar todos os documentos:', {
            code: allDocsError.code,
            message: allDocsError.message,
            details: allDocsError.details,
            hint: allDocsError.hint
          });
        } else {
          console.log('📊 Todos os documentos na tabela:', allDocs);
          if (allDocs && allDocs.length > 0) {
            console.log('📊 Exemplo de documento:', allDocs[0]);
            console.log('📊 Tipos de escola_id encontrados:', allDocs.map(doc => ({
              id: doc.id,
              escola_id: doc.escola_id,
              tipo_escola_id: typeof doc.escola_id,
              valor_escola_id: doc.escola_id
            })));
          } else {
            console.log('⚠️ Tabela está vazia ou não temos permissão para ver os dados');
          }
        }
        
        // Agora vamos buscar os documentos específicos
        console.log('🔍 Buscando documentos para escola_id:', escolaId);
        const { data, error } = await supabase
          .from('documentos_escola')
          .select('*')
          .eq('escola_id', escolaId.toString()) // Convertendo para string para garantir
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Erro na consulta Supabase:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          throw error;
        }

        console.log('✅ Documentos encontrados:', data?.length || 0);
        if (data?.length === 0) {
          console.log('ℹ️ Nenhum documento encontrado para a escola ID:', escolaId);
          console.log('ℹ️ Tentando buscar com diferentes formatos de escola_id...');
          
          // Tentando diferentes formatos do ID
          const { data: dataAsNumber, error: errorAsNumber } = await supabase
            .from('documentos_escola')
            .select('*')
            .eq('escola_id', Number(escolaId));
            
          const { data: dataAsString, error: errorAsString } = await supabase
            .from('documentos_escola')
            .select('*')
            .eq('escola_id', String(escolaId));
            
          console.log('Resultados com escola_id como número:', {
            count: dataAsNumber?.length || 0,
            error: errorAsNumber
          });
          console.log('Resultados com escola_id como string:', {
            count: dataAsString?.length || 0,
            error: errorAsString
          });
        } else {
          console.log('📄 Dados dos documentos:', data);
        }
        
        setDocumentos(data || []);
      } catch (err) {
        console.error('❌ Erro ao buscar documentos:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
        // console.log removido para evitar dependências desnecessárias
      }
    };

    fetchDocumentos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escolaId]);

  return { documentos, isLoading, error };
};

export default useDocumentosEscola; 