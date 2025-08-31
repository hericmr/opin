import React, { useState, useEffect } from 'react';
import { Download, Eye, RefreshCw, Database, FileText, Users, Image, Video, FileImage, Archive, Cloud, HardDrive, Globe, FileDown } from 'lucide-react';
import { supabase } from '../../../supabaseClient';

const TabelasIntegraisTab = () => {
  const [tabelas, setTabelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTabela, setSelectedTabela] = useState(null);
  const [dadosTabela, setDadosTabela] = useState([]);
  const [loadingDados, setLoadingDados] = useState(false);
  const [backupStatus, setBackupStatus] = useState({});
  const [backupProgress, setBackupProgress] = useState(0);

  // Lista das tabelas principais do sistema
  const TABELAS_SISTEMA = [
    {
      id: 'escolas_completa',
      nome: 'Escolas Completas',
      descricao: 'Dados principais de todas as escolas indígenas',
      icone: Database,
      cor: 'bg-blue-500'
    },
    {
      id: 'historias_professor',
      nome: 'Histórias dos Professores',
      descricao: 'Depoimentos e histórias dos professores indígenas',
      icone: Users,
      cor: 'bg-green-500'
    },
    {
      id: 'documentos_escola',
      nome: 'Documentos das Escolas',
      descricao: 'PDFs e documentos das escolas',
      icone: FileText,
      cor: 'bg-purple-500'
    },
    {
      id: 'titulos_videos',
      nome: 'Vídeos das Escolas',
      descricao: 'Links e títulos dos vídeos das escolas',
      icone: Video,
      cor: 'bg-red-500'
    },
    {
      id: 'legendas_fotos',
      nome: 'Legendas das Fotos',
      descricao: 'Legendas e descrições das imagens',
      icone: Image,
      cor: 'bg-yellow-500'
    }
  ];

  // Buckets do Supabase para backup
  const BUCKETS_BACKUP = [
    {
      id: 'imagens-das-escolas',
      nome: 'Imagens das Escolas',
      descricao: 'Fotos das escolas indígenas',
      icone: Image,
      cor: 'bg-indigo-500'
    },
    {
      id: 'imagens-professores',
      nome: 'Imagens dos Professores',
      descricao: 'Fotos dos professores indígenas',
      icone: Users,
      cor: 'bg-teal-500'
    },
    {
      id: 'pdfs',
      nome: 'Documentos PDF',
      descricao: 'Documentos das escolas em PDF',
      icone: FileText,
      cor: 'bg-orange-500'
    }
  ];

  useEffect(() => {
    setTabelas(TABELAS_SISTEMA);
    setLoading(false);
  }, []);

  // Carregar dados de uma tabela específica
  const carregarDadosTabela = async (tabelaId) => {
    try {
      setLoadingDados(true);
      setError(null);
      
      const { data, error } = await supabase
        .from(tabelaId)
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      
      setDadosTabela(data || []);
      setSelectedTabela(tabelaId);
    } catch (err) {
      console.error(`Erro ao carregar dados da tabela ${tabelaId}:`, err);
      setError(`Erro ao carregar dados: ${err.message}`);
    } finally {
      setLoadingDados(false);
    }
  };

  // Função para baixar arquivo individual
  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(`Erro ao baixar ${filename}:`, error);
    }
  };

  // Função para criar e baixar ZIP
  const createAndDownloadZip = async (files, zipName) => {
    try {
      // Verificar se JSZip está disponível
      if (typeof JSZip === 'undefined') {
        // Se JSZip não estiver disponível, baixar arquivos individualmente
        alert('JSZip não disponível. Baixando arquivos individualmente...');
        for (const file of files) {
          await downloadFile(file.url, file.name);
          await new Promise(resolve => setTimeout(resolve, 100)); // Delay para evitar sobrecarga
        }
        return;
      }

      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Adicionar arquivos ao ZIP
      for (const file of files) {
        try {
          const response = await fetch(file.url);
          const blob = await response.blob();
          zip.file(file.name, blob);
        } catch (error) {
          console.error(`Erro ao adicionar ${file.name} ao ZIP:`, error);
        }
      }

      // Gerar e baixar ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = zipName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Erro ao criar ZIP:', error);
      // Fallback: baixar arquivos individualmente
      alert('Erro ao criar ZIP. Baixando arquivos individualmente...');
      for (const file of files) {
        await downloadFile(file.url, file.name);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  };

  // Backup completo do site com download das imagens
  const backupCompletoSite = async () => {
    try {
      setBackupStatus({ status: 'iniciando', message: 'Iniciando backup completo...' });
      setBackupProgress(0);

      // 1. Backup das tabelas (25% do progresso)
      setBackupStatus({ status: 'tabelas', message: 'Fazendo backup das tabelas...' });
      setBackupProgress(10);
      
      const backupTabelas = {};
      for (const tabela of TABELAS_SISTEMA) {
        try {
          const { data, error } = await supabase
            .from(tabela.id)
            .select('*');
          
          if (error) throw error;
          backupTabelas[tabela.id] = data || [];
        } catch (err) {
          console.error(`Erro ao fazer backup da tabela ${tabela.id}:`, err);
        }
      }
      setBackupProgress(25);

      // 2. Backup dos buckets com URLs para download (50% do progresso)
      setBackupStatus({ status: 'buckets', message: 'Preparando download das imagens...' });
      setBackupProgress(30);

      const backupArquivos = {};
      const todosArquivos = [];
      
      for (const bucket of BUCKETS_BACKUP) {
        try {
          const { data, error } = await supabase.storage
            .from(bucket.id)
            .list('', { limit: 1000 });
          
          if (error) throw error;
          
          const arquivosComUrls = [];
          for (const arquivo of data) {
            try {
              const { data: urlData } = await supabase.storage
                .from(bucket.id)
                .createSignedUrl(arquivo.name, 3600); // URL válida por 1 hora
              
              if (urlData?.signedUrl) {
                const arquivoCompleto = {
                  ...arquivo,
                  url: urlData.signedUrl,
                  bucket: bucket.id,
                  bucketNome: bucket.nome
                };
                arquivosComUrls.push(arquivoCompleto);
                todosArquivos.push(arquivoCompleto);
              }
            } catch (err) {
              console.error(`Erro ao gerar URL para ${arquivo.name}:`, err);
            }
          }
          
          backupArquivos[bucket.id] = arquivosComUrls;
        } catch (err) {
          console.error(`Erro ao fazer backup do bucket ${bucket.id}:`, err);
        }
      }
      setBackupProgress(75);

      // 3. Criar arquivo de backup completo (25% do progresso)
      setBackupStatus({ status: 'finalizando', message: 'Criando arquivo de backup...' });
      setBackupProgress(80);

      const backupCompleto = {
        metadata: {
          dataBackup: new Date().toISOString(),
          versao: '1.0',
          descricao: 'Backup completo do sistema OPIN - Observatório dos Professores Indígenas',
          tabelas: TABELAS_SISTEMA.map(t => ({ id: t.id, nome: t.nome })),
          buckets: BUCKETS_BACKUP.map(b => ({ id: b.id, nome: b.nome })),
          totalRegistros: Object.values(backupTabelas).reduce((acc, tabela) => acc + (tabela?.length || 0), 0),
          totalArquivos: Object.values(backupArquivos).reduce((acc, bucket) => acc + (bucket?.length || 0), 0)
        },
        dados: backupTabelas,
        arquivos: backupArquivos
      };

      // 4. Download do backup completo
      setBackupStatus({ status: 'download', message: 'Preparando download...' });
      setBackupProgress(90);

      const jsonContent = JSON.stringify(backupCompleto, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `backup_completo_opin_${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 5. Download das imagens em ZIP
      if (todosArquivos.length > 0) {
        setBackupStatus({ status: 'imagens', message: 'Baixando imagens...' });
        setBackupProgress(95);
        
        await createAndDownloadZip(
          todosArquivos, 
          `imagens_opin_${new Date().toISOString().split('T')[0]}.zip`
        );
      }

      setBackupProgress(100);
      setBackupStatus({ 
        status: 'concluido', 
        message: 'Backup completo realizado com sucesso!',
                  detalhes: {
            tabelas: Object.keys(backupTabelas).length,
            registros: Object.values(backupTabelas).reduce((acc, tabela) => acc + (tabela?.length || 0), 0),
            arquivos: Object.values(backupArquivos).reduce((acc, bucket) => acc + (bucket?.length || 0), 0)
          }
      });

      // Limpar status após 5 segundos
      setTimeout(() => {
        setBackupStatus({});
        setBackupProgress(0);
      }, 5000);

    } catch (err) {
      console.error('Erro no backup completo:', err);
      setBackupStatus({ 
        status: 'erro', 
        message: `Erro no backup: ${err.message}` 
      });
      setBackupProgress(0);
    }
  };

  // Backup apenas das tabelas
  const backupApenasTabelas = async () => {
    try {
      setBackupStatus({ status: 'tabelas', message: 'Fazendo backup das tabelas...' });
      setBackupProgress(0);

      const backupTabelasData = {};
      for (let i = 0; i < TABELAS_SISTEMA.length; i++) {
        const tabela = TABELAS_SISTEMA[i];
        try {
          const { data, error } = await supabase
            .from(tabela.id)
            .select('*');
          
          if (error) throw error;
          backupTabelasData[tabela.id] = data || [];
          
          setBackupProgress((i + 1) / TABELAS_SISTEMA.length * 100);
        } catch (err) {
          console.error(`Erro ao fazer backup da tabela ${tabela.id}:`, err);
        }
      }

      const backupData = {
        metadata: {
          dataBackup: new Date().toISOString(),
          tipo: 'backup_tabelas',
          tabelas: Object.keys(backupTabelasData),
          totalRegistros: Object.values(backupTabelasData).reduce((acc, tabela) => acc + (tabela?.length || 0), 0)
        },
        dados: backupTabelasData
      };

      const jsonContent = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `backup_tabelas_opin_${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setBackupStatus({ 
        status: 'concluido', 
        message: 'Backup das tabelas realizado com sucesso!' 
      });

      setTimeout(() => {
        setBackupStatus({});
        setBackupProgress(0);
      }, 3000);

    } catch (err) {
      console.error('Erro no backup das tabelas:', err);
      setBackupStatus({ 
        status: 'erro', 
        message: `Erro no backup: ${err.message}` 
      });
      setBackupProgress(0);
    }
  };

  // Backup apenas das imagens
  const backupImagens = async () => {
    try {
      setBackupStatus({ status: 'imagens', message: 'Preparando backup das imagens...' });
      setBackupProgress(0);

      const todosArquivos = [];
      
      for (let i = 0; i < BUCKETS_BACKUP.length; i++) {
        const bucket = BUCKETS_BACKUP[i];
        try {
          setBackupStatus({ 
            status: 'imagens', 
            message: `Processando bucket: ${bucket.nome}...` 
          });
          
          const { data, error } = await supabase.storage
            .from(bucket.id)
            .list('', { limit: 1000 });
          
          if (error) throw error;
          
          for (const arquivo of data) {
            try {
              const { data: urlData } = await supabase.storage
                .from(bucket.id)
                .createSignedUrl(arquivo.name, 3600);
              
              if (urlData?.signedUrl) {
                todosArquivos.push({
                  ...arquivo,
                  url: urlData.signedUrl,
                  bucket: bucket.id,
                  bucketNome: bucket.nome
                });
              }
            } catch (err) {
              console.error(`Erro ao gerar URL para ${arquivo.name}:`, err);
            }
          }
          
          setBackupProgress((i + 1) / BUCKETS_BACKUP.length * 100);
        } catch (err) {
          console.error(`Erro ao fazer backup do bucket ${bucket.id}:`, err);
        }
      }

      if (todosArquivos.length > 0) {
        setBackupStatus({ 
          status: 'download', 
          message: 'Criando arquivo ZIP com as imagens...' 
        });
        
        await createAndDownloadZip(
          todosArquivos, 
          `imagens_opin_${new Date().toISOString().split('T')[0]}.zip`
        );

        setBackupStatus({ 
          status: 'concluido', 
          message: `Backup das imagens realizado com sucesso! ${todosArquivos.length} arquivos baixados.` 
        });
      } else {
        setBackupStatus({ 
          status: 'concluido', 
          message: 'Nenhuma imagem encontrada para backup.' 
        });
      }

      setTimeout(() => {
        setBackupStatus({});
        setBackupProgress(0);
      }, 3000);

    } catch (err) {
      console.error('Erro no backup das imagens:', err);
      setBackupStatus({ 
        status: 'erro', 
        message: `Erro no backup: ${err.message}` 
      });
      setBackupProgress(0);
    }
  };

  // Download dos dados em formato CSV
  const downloadCSV = (tabelaId, dados) => {
    if (!dados || dados.length === 0) {
      alert('Nenhum dado para baixar');
      return;
    }

    // Obter cabeçalhos das colunas
    const headers = Object.keys(dados[0]);
    
    // Criar conteúdo CSV
    const csvContent = [
      headers.join(','),
      ...dados.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escapar vírgulas e quebras de linha
          if (typeof value === 'string' && (value.includes(',') || value.includes('\n') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        }).join(',')
      )
    ].join('\n');

    // Criar blob e download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${tabelaId}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download dos dados em formato JSON
  const downloadJSON = (tabelaId, dados) => {
    if (!dados || dados.length === 0) {
      alert('Nenhum dado para baixar');
      return;
    }

    const jsonContent = JSON.stringify(dados, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${tabelaId}_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-400">Carregando tabelas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Tabelas Integrais e Backup do Sistema
        </h3>
        <p className="text-sm text-gray-600">
          Visualize, baixe e faça backup completo de todas as tabelas e arquivos do sistema
        </p>
      </div>

      {/* Seção de Backup */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Archive className="w-5 h-5 mr-2 text-blue-600" />
          Backup Completo do Sistema
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h5 className="font-medium text-blue-900 mb-2">Backup Completo</h5>
            <p className="text-sm text-blue-700 mb-3">
              Inclui todas as tabelas, imagens dos buckets e metadados do sistema
            </p>
            <button
              onClick={backupCompletoSite}
              disabled={backupStatus.status === 'iniciando' || backupStatus.status === 'tabelas' || backupStatus.status === 'buckets' || backupStatus.status === 'finalizando' || backupStatus.status === 'download' || backupStatus.status === 'imagens'}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Archive className="w-4 h-4 inline mr-2" />
              Backup Completo
            </button>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h5 className="font-medium text-green-900 mb-2">Backup das Tabelas</h5>
            <p className="text-sm text-green-700 mb-3">
              Apenas os dados das tabelas em formato JSON
            </p>
                          <button
                onClick={backupApenasTabelas}
                disabled={backupStatus.status === 'tabelas'}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Database className="w-4 h-4 inline mr-2" />
                Backup Tabelas
              </button>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h5 className="font-medium text-purple-900 mb-2">Backup das Imagens</h5>
            <p className="text-sm text-purple-700 mb-3">
              Apenas as imagens dos buckets em arquivo ZIP
            </p>
            <button
              onClick={backupImagens}
              disabled={backupStatus.status === 'imagens' || backupStatus.status === 'download'}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FileDown className="w-4 h-4 inline mr-2" />
              Backup Imagens
            </button>
          </div>
        </div>

        {/* Status do Backup */}
        {backupStatus.status && (
          <div className={`p-4 rounded-lg border ${
            backupStatus.status === 'concluido' ? 'bg-green-50 border-green-200 text-green-800' :
            backupStatus.status === 'erro' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{backupStatus.message}</p>
                {backupStatus.detalhes && (
                  <p className="text-sm mt-1">
                    Tabelas: {backupStatus.detalhes.tabelas} | 
                    Registros: {backupStatus.detalhes.registros} | 
                    Arquivos: {backupStatus.detalhes.arquivos}
                  </p>
                )}
              </div>
              {backupProgress > 0 && backupProgress < 100 && (
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${backupProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{Math.round(backupProgress)}%</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lista de Tabelas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2 text-gray-600" />
          Tabelas do Sistema
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tabelas.map((tabela) => {
            const Icone = tabela.icone;
            const isSelected = selectedTabela === tabela.id;
            
            return (
              <div
                key={tabela.id}
                className={`bg-white rounded-lg shadow-sm border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => carregarDadosTabela(tabela.id)}
              >
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <div className={`${tabela.cor} p-2 rounded-lg mr-3`}>
                      <Icone className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-medium text-gray-900">{tabela.nome}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{tabela.descricao}</p>
                  
                  <div className="flex space-x-2">
                    <button
                      className="flex items-center px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        carregarDadosTabela(tabela.id);
                      }}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Visualizar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista de Buckets */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Cloud className="w-5 h-5 mr-2 text-gray-600" />
          Buckets de Arquivos
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BUCKETS_BACKUP.map((bucket) => {
            const Icone = bucket.icone;
            
            return (
              <div
                key={bucket.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-3">
                  <div className={`${bucket.cor} p-2 rounded-lg mr-3`}>
                    <Icone className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900">{bucket.nome}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{bucket.descricao}</p>
                <p className="text-xs text-gray-500">
                  Incluído no backup completo do sistema
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visualização dos Dados */}
      {selectedTabela && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                Dados da Tabela: {tabelas.find(t => t.id === selectedTabela)?.nome}
              </h4>
              <p className="text-sm text-gray-600">
                {dadosTabela.length} registros encontrados
              </p>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => carregarDadosTabela(selectedTabela)}
                disabled={loadingDados}
                className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${loadingDados ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
              
              <button
                onClick={() => downloadCSV(selectedTabela, dadosTabela)}
                disabled={loadingDados || dadosTabela.length === 0}
                className="flex items-center px-3 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-1" />
                CSV
              </button>
              
              <button
                onClick={() => downloadJSON(selectedTabela, dadosTabela)}
                disabled={loadingDados || dadosTabela.length === 0}
                className="flex items-center px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-1" />
                JSON
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
              {error}
            </div>
          )}

          {loadingDados ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <span className="ml-2 text-gray-600">Carregando dados...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {dadosTabela.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(dadosTabela[0]).map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dadosTabela.slice(0, 100).map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {Object.values(row).map((value, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate"
                            title={typeof value === 'string' && value.length > 50 ? value : ''}
                          >
                            {typeof value === 'string' && value.length > 50 
                              ? `${value.substring(0, 50)}...` 
                              : value || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhum dado encontrado nesta tabela
                </div>
              )}
              
              {dadosTabela.length > 100 && (
                <div className="mt-4 text-center text-sm text-gray-600">
                  Mostrando os primeiros 100 registros de {dadosTabela.length} total.
                  Use os botões de download para acessar todos os dados.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TabelasIntegraisTab;
