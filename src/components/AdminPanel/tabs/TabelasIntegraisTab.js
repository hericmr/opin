import React, { useState, useEffect } from 'react';
import { Download, Eye, RefreshCw, Database, FileText, Users, Image, Video, Archive, FileDown, CheckCircle, AlertCircle } from 'lucide-react';
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
      cor: 'bg-blue-500',
      registros: 0
    },
    {
      id: 'historias_professor',
      nome: 'Histórias dos Professores',
      descricao: 'Depoimentos e histórias dos professores indígenas',
      icone: Users,
      cor: 'bg-green-500',
      registros: 0
    },
    {
      id: 'documentos_escola',
      nome: 'Documentos das Escolas',
      descricao: 'PDFs e documentos das escolas',
      icone: FileText,
      cor: 'bg-purple-500',
      registros: 0
    },
    {
      id: 'titulos_videos',
      nome: 'Vídeos das Escolas',
      descricao: 'Links e títulos dos vídeos das escolas',
      icone: Video,
      cor: 'bg-red-500',
      registros: 0
    },
    {
      id: 'legendas_fotos',
      nome: 'Legendas das Fotos',
      descricao: 'Legendas e descrições das imagens',
      icone: Image,
      cor: 'bg-yellow-500',
      registros: 0
    },
    {
      id: 'imagens_professores',
      nome: 'Imagens dos Professores',
      descricao: 'Metadados das imagens dos professores',
      icone: Users,
      cor: 'bg-teal-500',
      registros: 0
    },
    {
      id: 'imagens_escola',
      nome: 'Imagens das Escolas',
      descricao: 'Metadados das imagens das escolas',
      icone: Image,
      cor: 'bg-indigo-500',
      registros: 0
    }
  ];

  // Buckets do Supabase para backup
  const BUCKETS_BACKUP = [
    {
      id: 'imagens-das-escolas',
      nome: 'Imagens das Escolas',
      descricao: 'Fotos das escolas indígenas',
      icone: Image,
      cor: 'bg-indigo-500',
      arquivos: 0
    },
    {
      id: 'imagens-professores',
      nome: 'Imagens dos Professores',
      descricao: 'Fotos dos professores indígenas',
      icone: Users,
      cor: 'bg-teal-500',
      arquivos: 0
    },
    {
      id: 'pdfs',
      nome: 'Documentos PDF',
      descricao: 'Documentos das escolas em PDF',
      icone: FileText,
      cor: 'bg-orange-500',
      arquivos: 0
    },
    {
      id: 'historias-professor',
      nome: 'Histórias dos Professores',
      descricao: 'Imagens das histórias dos professores',
      icone: Users,
      cor: 'bg-green-500',
      arquivos: 0
    }
  ];

  // Função para testar buckets
  const testarBuckets = async () => {
    console.log('Testando buckets do Supabase...');
    setBackupStatus({ status: 'testando', message: 'Testando buckets...' });
    
    const resultados = [];
    
    for (const bucket of BUCKETS_BACKUP) {
      try {
        console.log(`Testando bucket: ${bucket.id}`);
        
        // Tentar listar arquivos do bucket
        const { data, error } = await supabase.storage
          .from(bucket.id)
          .list('', { limit: 1000 });
        
        if (error) {
          console.error(`❌ Erro no bucket ${bucket.id}:`, error);
          resultados.push({ bucket: bucket.id, status: 'erro', mensagem: error.message });
        } else {
          console.log(`✅ Bucket ${bucket.id} OK - ${data?.length || 0} arquivos encontrados`);
          if (data && data.length > 0) {
            console.log(`📁 Arquivos no bucket ${bucket.id}:`, data.map(f => f.name));
          }
          resultados.push({ bucket: bucket.id, status: 'ok', arquivos: data?.length || 0 });
        }
      } catch (err) {
        console.error(`❌ Exceção no bucket ${bucket.id}:`, err);
        resultados.push({ bucket: bucket.id, status: 'excecao', mensagem: err.message });
      }
    }
    
    // Mostrar resultados
    console.log('Resultados dos testes:', resultados);
    
    const bucketsOk = resultados.filter(r => r.status === 'ok').length;
    const bucketsErro = resultados.filter(r => r.status === 'erro' || r.status === 'excecao').length;
    const totalArquivos = resultados.reduce((acc, r) => acc + (r.arquivos || 0), 0);
    
    if (bucketsErro === 0) {
      setBackupStatus({ 
        status: 'concluido', 
        message: `✅ Todos os buckets estão funcionando! ${bucketsOk} buckets testados, ${totalArquivos} arquivos encontrados.` 
      });
    } else {
      setBackupStatus({ 
        status: 'erro', 
        message: `⚠️ ${bucketsErro} bucket(s) com problema. Verifique o console para detalhes.` 
      });
    }
    
    setTimeout(() => {
      setBackupStatus({});
    }, 5000);
  };

  // Função para testar tabelas
  const testarTabelas = async () => {
    console.log('Testando tabelas do Supabase...');
    setBackupStatus({ status: 'testando', message: 'Testando tabelas...' });
    
    const resultados = [];
    
    for (const tabela of TABELAS_SISTEMA) {
      try {
        console.log(`Testando tabela: ${tabela.id}`);
        
        // Tentar buscar dados da tabela
        const { data, error } = await supabase
          .from(tabela.id)
          .select('*')
          .limit(5);
        
        if (error) {
          console.error(`❌ Erro na tabela ${tabela.id}:`, error);
          resultados.push({ tabela: tabela.id, status: 'erro', mensagem: error.message });
        } else {
          console.log(`✅ Tabela ${tabela.id} OK - ${data?.length || 0} registros encontrados`);
          resultados.push({ tabela: tabela.id, status: 'ok', registros: data?.length || 0 });
        }
      } catch (err) {
        console.error(`❌ Exceção na tabela ${tabela.id}:`, err);
        resultados.push({ tabela: tabela.id, status: 'excecao', mensagem: err.message });
      }
    }
    
    // Mostrar resultados
    console.log('Resultados dos testes de tabelas:', resultados);
    
    const tabelasOk = resultados.filter(r => r.status === 'ok').length;
    const tabelasErro = resultados.filter(r => r.status === 'erro' || r.status === 'excecao').length;
    
    if (tabelasErro === 0) {
      setBackupStatus({ 
        status: 'concluido', 
        message: `✅ Todas as tabelas estão funcionando! ${tabelasOk} tabelas testadas.` 
      });
    } else {
      setBackupStatus({ 
        status: 'erro', 
        message: `⚠️ ${tabelasErro} tabela(s) com problema. Verifique o console para detalhes.` 
      });
    }
    
    setTimeout(() => {
      setBackupStatus({});
    }, 5000);
  };

  useEffect(() => {
    setTabelas(TABELAS_SISTEMA);
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      console.log('Iniciando criação do ZIP com', files.length, 'arquivos');
      
      // Importar JSZip dinamicamente
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Adicionar arquivos ao ZIP
      let arquivosAdicionados = 0;
      for (const file of files) {
        try {
          console.log(`Baixando arquivo: ${file.name} de ${file.url}`);
          
          const response = await fetch(file.url);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const blob = await response.blob();
          console.log(`Arquivo ${file.name} baixado, tamanho: ${blob.size} bytes`);
          
          zip.file(file.name, blob);
          arquivosAdicionados++;
          
          // Atualizar progresso
          const progress = (arquivosAdicionados / files.length) * 100;
          setBackupProgress(progress);
          
        } catch (error) {
          console.error(`Erro ao adicionar ${file.name} ao ZIP:`, error);
          // Continuar com outros arquivos
        }
      }

      if (arquivosAdicionados === 0) {
        throw new Error('Nenhum arquivo foi adicionado ao ZIP');
      }

      console.log(`Gerando ZIP com ${arquivosAdicionados} arquivos...`);
      
      // Gerar e baixar ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      console.log(`ZIP gerado, tamanho: ${zipBlob.size} bytes`);
      
      const downloadUrl = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = zipName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      console.log('ZIP baixado com sucesso:', zipName);
      
    } catch (error) {
      console.error('Erro ao criar ZIP:', error);
      
      // Fallback: baixar arquivos individualmente
      console.log('Tentando download individual dos arquivos...');
      for (const file of files) {
        try {
          await downloadFile(file.url, file.name);
          await new Promise(resolve => setTimeout(resolve, 200)); // Delay maior para evitar sobrecarga
        } catch (downloadError) {
          console.error(`Erro ao baixar ${file.name}:`, downloadError);
        }
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
          console.log(`Listando arquivos do bucket: ${bucket.id}`);
          const { data, error } = await supabase.storage
            .from(bucket.id)
            .list('', { limit: 1000 });
          
          if (error) throw error;
          
          console.log(`Bucket ${bucket.id}: ${data?.length || 0} arquivos encontrados`);
          console.log('Arquivos encontrados:', data);
          
          const arquivosComUrls = [];
          for (const arquivo of data) {
            try {
              console.log(`Gerando URL para: ${arquivo.name}`);
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
                console.log(`URL gerada para ${arquivo.name}: ${urlData.signedUrl.substring(0, 50)}...`);
              } else {
                console.warn(`URL não gerada para ${arquivo.name}`);
              }
            } catch (err) {
              console.error(`Erro ao gerar URL para ${arquivo.name}:`, err);
            }
          }
          
          console.log(`Bucket ${bucket.id}: ${arquivosComUrls.length} URLs geradas`);
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
      console.log(`Total de arquivos para download: ${todosArquivos.length}`);
      console.log('Arquivos para download:', todosArquivos);
      
      if (todosArquivos.length > 0) {
        setBackupStatus({ status: 'imagens', message: 'Baixando imagens...' });
        setBackupProgress(95);
        
        await createAndDownloadZip(
          todosArquivos, 
          `imagens_opin_${new Date().toISOString().split('T')[0]}.zip`
        );
      } else {
        console.warn('Nenhuma imagem encontrada para backup');
        setBackupStatus({ 
          status: 'erro', 
          message: 'Nenhuma imagem encontrada para backup. Verifique se há arquivos nos buckets.' 
        });
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

  // Backup apenas das tabelas em formato CSV
  const backupApenasTabelas = async () => {
    try {
      setBackupStatus({ status: 'tabelas', message: 'Fazendo backup das tabelas em CSV...' });
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

      // Criar arquivo CSV para cada tabela
      const dataAtual = new Date().toISOString().split('T')[0];
      
      // Importar JSZip dinamicamente para criar um arquivo ZIP com todos os CSVs
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Adicionar cada tabela como um arquivo CSV separado
      for (const [tabelaId, dados] of Object.entries(backupTabelasData)) {
        if (dados && dados.length > 0) {
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

          // Adicionar ao ZIP
          zip.file(`${tabelaId}_${dataAtual}.csv`, csvContent);
        }
      }

      // Adicionar arquivo de metadados
      const metadata = {
        dataBackup: new Date().toISOString(),
        tipo: 'backup_tabelas_csv',
        tabelas: Object.keys(backupTabelasData),
        totalRegistros: Object.values(backupTabelasData).reduce((acc, tabela) => acc + (tabela?.length || 0), 0),
        formato: 'CSV',
        descricao: 'Backup das tabelas do sistema OPIN em formato CSV'
      };
      
      zip.file(`metadata_${dataAtual}.json`, JSON.stringify(metadata, null, 2));

      // Gerar e baixar ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `backup_tabelas_csv_opin_${dataAtual}.zip`;
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setBackupStatus({ 
        status: 'concluido', 
        message: 'Backup das tabelas em CSV realizado com sucesso!' 
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
      console.log('Iniciando backup das imagens...');
      setBackupStatus({ status: 'imagens', message: 'Preparando backup das imagens...' });
      setBackupProgress(0);

      const todosArquivos = [];
      
      for (let i = 0; i < BUCKETS_BACKUP.length; i++) {
        const bucket = BUCKETS_BACKUP[i];
        try {
          console.log(`Processando bucket: ${bucket.id} (${bucket.nome})`);
          setBackupStatus({ 
            status: 'imagens', 
            message: `Processando bucket: ${bucket.nome}...` 
          });
          
          // Listar arquivos do bucket
          const { data: arquivos, error } = await supabase.storage
            .from(bucket.id)
            .list('', { limit: 1000 });
          
          if (error) {
            console.error(`Erro ao listar arquivos do bucket ${bucket.id}:`, error);
            throw error;
          }
          
          console.log(`Bucket ${bucket.id} tem ${arquivos?.length || 0} arquivos`);
          
          if (arquivos && arquivos.length > 0) {
            // Gerar URLs assinadas para cada arquivo
            for (const arquivo of arquivos) {
              try {
                console.log(`Gerando URL para: ${arquivo.name}`);
                
                const { data: urlData, error: urlError } = await supabase.storage
                  .from(bucket.id)
                  .createSignedUrl(arquivo.name, 3600);
                
                if (urlError) {
                  console.error(`Erro ao gerar URL para ${arquivo.name}:`, urlError);
                  continue;
                }
                
                if (urlData?.signedUrl) {
                  const arquivoCompleto = {
                    ...arquivo,
                    url: urlData.signedUrl,
                    bucket: bucket.id,
                    bucketNome: bucket.nome
                  };
                  todosArquivos.push(arquivoCompleto);
                  console.log(`URL gerada para ${arquivo.name}: ${urlData.signedUrl.substring(0, 50)}...`);
                } else {
                  console.warn(`URL não gerada para ${arquivo.name}`);
                }
              } catch (err) {
                console.error(`Erro ao gerar URL para ${arquivo.name}:`, err);
              }
            }
          } else {
            console.log(`Bucket ${bucket.id} está vazio`);
          }
          
          setBackupProgress((i + 1) / BUCKETS_BACKUP.length * 100);
        } catch (err) {
          console.error(`Erro ao processar bucket ${bucket.id}:`, err);
          // Continuar com outros buckets
        }
      }

      console.log(`Total de arquivos encontrados: ${todosArquivos.length}`);

      if (todosArquivos.length > 0) {
        setBackupStatus({ 
          status: 'download', 
          message: `Criando arquivo ZIP com ${todosArquivos.length} imagens...` 
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
        <div className="text-gray-400 text-lg">Carregando tabelas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Seção de Backup */}
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
        <h4 className="text-lg font-semibold text-gray-100 mb-6 flex items-center gap-2">
          <Archive className="w-5 h-5 text-blue-400" />
          Backup Completo do Sistema
        </h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Backup Completo */}
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-200">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500 p-3 rounded-lg mr-3">
                <Archive className="w-6 h-6 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-100">Backup Completo</h5>
                <p className="text-sm text-gray-400">Sistema completo</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Inclui todas as tabelas, imagens dos buckets e metadados do sistema
            </p>
            <button
              onClick={backupCompletoSite}
              disabled={backupStatus.status === 'iniciando' || backupStatus.status === 'tabelas' || backupStatus.status === 'buckets' || backupStatus.status === 'finalizando' || backupStatus.status === 'download' || backupStatus.status === 'imagens'}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Archive className="w-4 h-4 inline mr-2" />
              Backup Completo
            </button>
          </div>

          {/* Backup das Tabelas */}
          <div className="bg-gradient-to-br from-green-600/20 to-green-700/20 rounded-xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all duration-200">
            <div className="flex items-center mb-4">
              <div className="bg-green-500 p-3 rounded-lg mr-3">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-100">Backup das Tabelas</h5>
                <p className="text-sm text-gray-400">Apenas dados</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Apenas os dados das tabelas em formato CSV
            </p>
            <div className="space-y-2">
              <button
                onClick={backupApenasTabelas}
                disabled={backupStatus.status === 'tabelas'}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Database className="w-4 h-4 inline mr-2" />
                Backup Tabelas
              </button>
              <button
                onClick={testarTabelas}
                className="w-full px-3 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600/50 text-sm"
              >
                🔍 Testar Tabelas
              </button>
            </div>
          </div>

          {/* Backup das Imagens */}
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-200">
            <div className="flex items-center mb-4">
              <div className="bg-purple-500 p-3 rounded-lg mr-3">
                <FileDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-100">Backup das Imagens</h5>
                <p className="text-sm text-gray-400">Apenas arquivos</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Apenas as imagens dos buckets em arquivo ZIP
            </p>
            <div className="space-y-2">
              <button
                onClick={backupImagens}
                disabled={backupStatus.status === 'imagens' || backupStatus.status === 'download'}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FileDown className="w-4 h-4 inline mr-2" />
                Backup Imagens
              </button>
              <button
                onClick={testarBuckets}
                className="w-full px-3 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600/50 text-sm"
              >
                🔍 Testar Buckets
              </button>
            </div>
          </div>
        </div>

        {/* Status do Backup */}
        {backupStatus.status && (
          <div className={`p-6 rounded-xl border backdrop-blur-sm ${
            backupStatus.status === 'concluido' 
              ? 'bg-green-900/50 border-green-700/50 text-green-200' 
              : backupStatus.status === 'erro' 
                ? 'bg-red-900/50 border-red-700/50 text-red-200'
                : 'bg-blue-900/50 border-blue-700/50 text-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {backupStatus.status === 'concluido' ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : backupStatus.status === 'erro' ? (
                  <AlertCircle className="w-6 h-6 text-red-400" />
                ) : (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                )}
                <div>
                  <p className="font-semibold">{backupStatus.message}</p>
                  {backupStatus.detalhes && (
                    <p className="text-sm mt-1 text-gray-300">
                      Tabelas: {backupStatus.detalhes.tabelas} | 
                      Registros: {backupStatus.detalhes.registros} | 
                      Arquivos: {backupStatus.detalhes.arquivos}
                    </p>
                  )}
                </div>
              </div>
              {backupProgress > 0 && backupProgress < 100 && (
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full transition-all duration-300" 
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
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
        <h4 className="text-lg font-semibold text-gray-100 mb-6 flex items-center gap-2">
          <Database className="w-5 h-5 text-gray-400" />
          Tabelas do Sistema
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tabelas.map((tabela) => {
            const Icone = tabela.icone;
            const isSelected = selectedTabela === tabela.id;
            
            return (
              <div
                key={tabela.id}
                className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected 
                    ? 'border-green-500/50 bg-green-600/20' 
                    : 'border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-700/30'
                }`}
                onClick={() => carregarDadosTabela(tabela.id)}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`${tabela.cor} p-3 rounded-lg mr-3 shadow-lg`}>
                      <Icone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-100">{tabela.nome}</h4>
                      <p className="text-sm text-gray-400">{tabela.registros} registros</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">{tabela.descricao}</p>
                  
                  <div className="flex space-x-2">
                    <button
                      className="flex items-center px-3 py-2 text-xs bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors border border-blue-500/30"
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



      {/* Visualização dos Dados */}
      {selectedTabela && (
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-100">
                Dados da Tabela: {tabelas.find(t => t.id === selectedTabela)?.nome}
              </h4>
              <p className="text-sm text-gray-400">
                {dadosTabela.length} registros encontrados
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => carregarDadosTabela(selectedTabela)}
                disabled={loadingDados}
                className="flex items-center px-4 py-2 text-sm bg-gray-700/50 text-gray-200 rounded-lg hover:bg-gray-600/50 transition-colors disabled:opacity-50 border border-gray-600/50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loadingDados ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
              
              <button
                onClick={() => downloadCSV(selectedTabela, dadosTabela)}
                disabled={loadingDados || dadosTabela.length === 0}
                className="flex items-center px-4 py-2 text-sm bg-green-600/20 text-green-300 rounded-lg hover:bg-green-600/30 transition-colors disabled:opacity-50 border border-green-500/30"
              >
                <Download className="w-4 h-4 mr-2" />
                CSV
              </button>
              
              <button
                onClick={() => downloadJSON(selectedTabela, dadosTabela)}
                disabled={loadingDados || dadosTabela.length === 0}
                className="flex items-center px-4 py-2 text-sm bg-purple-600/20 text-purple-300 rounded-lg hover:bg-purple-600/30 transition-colors disabled:opacity-50 border border-purple-500/30"
              >
                <Download className="w-4 h-4 mr-2" />
                JSON
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700/50 text-red-200 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {loadingDados ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
              <span className="ml-3 text-gray-400">Carregando dados...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {dadosTabela.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700/30">
                    <tr>
                      {Object.keys(dadosTabela[0]).map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800/20 divide-y divide-gray-700">
                    {dadosTabela.slice(0, 100).map((row, index) => (
                      <tr key={index} className="hover:bg-gray-700/30 transition-colors">
                        {Object.values(row).map((value, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 max-w-xs truncate"
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
                <div className="text-center py-12 text-gray-400">
                  <div className="w-16 h-16 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Database className="w-8 h-8 text-gray-500" />
                  </div>
                  <p>Nenhum dado encontrado nesta tabela</p>
                </div>
              )}
              
              {dadosTabela.length > 100 && (
                <div className="mt-6 text-center text-sm text-gray-400 bg-gray-700/20 p-4 rounded-lg">
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

