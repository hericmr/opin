import React, { useState } from 'react';
import { Archive, Database, FileText, Users, Image, Video, FileDown, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../../dbClient';
import logger from '../../../utils/logger';

export const TABELAS_SISTEMA = [
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
  },
  {
    id: 'fontes_dados',
    nome: 'Fontes de Dados',
    descricao: 'Fontes de dados utilizadas no sistema de versionamento',
    icone: FileText,
    cor: 'bg-cyan-500',
    registros: 0
  },
  {
    id: 'versoes_dados',
    nome: 'Versões de Dados',
    descricao: 'Histórico de versões e metadados das alterações',
    icone: Archive,
    cor: 'bg-orange-500',
    registros: 0
  }
];

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

const BackupSection = () => {
  const [backupStatus, setBackupStatus] = useState({});
  const [backupProgress, setBackupProgress] = useState(0);

  const testarBuckets = async () => {
    logger.debug('Testando buckets do Supabase...');
    setBackupStatus({ status: 'testando', message: 'Testando buckets...' });

    const resultados = [];

    for (const bucket of BUCKETS_BACKUP) {
      try {
        logger.debug(`Testando bucket: ${bucket.id}`);

        const { data, error } = await supabase.storage
          .from(bucket.id)
          .list('', { limit: 1000 });

        if (error) {
          logger.error(`❌ Erro no bucket ${bucket.id}:`, error);
          resultados.push({ bucket: bucket.id, status: 'erro', mensagem: error.message });
        } else {
          logger.debug(`✅ Bucket ${bucket.id} OK - ${data?.length || 0} arquivos encontrados`);
          if (data && data.length > 0) {
            logger.debug(`📁 Arquivos no bucket ${bucket.id}:`, data.map(f => f.name));
          }
          resultados.push({ bucket: bucket.id, status: 'ok', arquivos: data?.length || 0 });
        }
      } catch (err) {
        logger.error(`❌ Exceção no bucket ${bucket.id}:`, err);
        resultados.push({ bucket: bucket.id, status: 'excecao', mensagem: err.message });
      }
    }

    logger.debug('Resultados dos testes:', resultados);

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

    setTimeout(() => { setBackupStatus({}); }, 5000);
  };

  const testarTabelas = async () => {
    logger.debug('Testando tabelas do Supabase...');
    setBackupStatus({ status: 'testando', message: 'Testando tabelas...' });

    const resultados = [];

    for (const tabela of TABELAS_SISTEMA) {
      try {
        logger.debug(`Testando tabela: ${tabela.id}`);

        const { data, error } = await supabase
          .from(tabela.id)
          .select('*')
          .limit(5);

        if (error) {
          logger.error(`❌ Erro na tabela ${tabela.id}:`, error);
          resultados.push({ tabela: tabela.id, status: 'erro', mensagem: error.message });
        } else {
          logger.debug(`✅ Tabela ${tabela.id} OK - ${data?.length || 0} registros encontrados`);
          resultados.push({ tabela: tabela.id, status: 'ok', registros: data?.length || 0 });
        }
      } catch (err) {
        logger.error(`❌ Exceção na tabela ${tabela.id}:`, err);
        resultados.push({ tabela: tabela.id, status: 'excecao', mensagem: err.message });
      }
    }

    logger.debug('Resultados dos testes de tabelas:', resultados);

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

    setTimeout(() => { setBackupStatus({}); }, 5000);
  };

  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      logger.error(`Erro ao baixar arquivo ${filename}:`, err);
    }
  };

  const createAndDownloadZip = async (files, zipName) => {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const response = await fetch(file.url);
        if (!response.ok) {
          logger.error(`Erro ao baixar ${file.name}: HTTP ${response.status}`);
          continue;
        }
        const blob = await response.blob();
        const folderName = file.bucketNome || file.bucket || 'arquivos';
        zip.file(`${folderName}/${file.name}`, blob);

        if (i % 5 === 0) {
          setBackupProgress(50 + (i / files.length) * 40);
        }
      } catch (err) {
        logger.error(`Erro ao processar ${file.name}:`, err);
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const downloadUrl = window.URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = zipName;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  };

  const backupCompletoSite = async () => {
    try {
      setBackupStatus({ status: 'iniciando', message: 'Iniciando backup completo...' });
      setBackupProgress(0);

      // 1. Backup das tabelas
      setBackupStatus({ status: 'tabelas', message: 'Fazendo backup das tabelas...' });
      const backupTabelas = {};

      for (let i = 0; i < TABELAS_SISTEMA.length; i++) {
        const tabela = TABELAS_SISTEMA[i];
        try {
          const { data, error } = await supabase.from(tabela.id).select('*');
          if (error) throw error;
          backupTabelas[tabela.id] = data || [];
          setBackupProgress((i + 1) / TABELAS_SISTEMA.length * 30);
        } catch (err) {
          logger.error(`Erro ao fazer backup da tabela ${tabela.id}:`, err);
          backupTabelas[tabela.id] = [];
        }
      }

      // 2. Backup dos buckets
      setBackupStatus({ status: 'buckets', message: 'Listando arquivos dos buckets...' });
      const backupArquivos = {};
      const todosArquivos = [];

      for (let i = 0; i < BUCKETS_BACKUP.length; i++) {
        const bucket = BUCKETS_BACKUP[i];
        try {
          const { data: arquivos, error } = await supabase.storage
            .from(bucket.id)
            .list('', { limit: 1000 });

          if (error) throw error;
          backupArquivos[bucket.id] = arquivos || [];

          if (arquivos && arquivos.length > 0) {
            for (const arquivo of arquivos) {
              const { data: urlData, error: urlError } = await supabase.storage
                .from(bucket.id)
                .createSignedUrl(arquivo.name, 3600);

              if (!urlError && urlData?.signedUrl) {
                todosArquivos.push({
                  ...arquivo,
                  url: urlData.signedUrl,
                  bucket: bucket.id,
                  bucketNome: bucket.nome
                });
              }
            }
          }

          setBackupProgress(30 + (i + 1) / BUCKETS_BACKUP.length * 30);
        } catch (err) {
          logger.error(`Erro ao listar bucket ${bucket.id}:`, err);
          backupArquivos[bucket.id] = [];
        }
      }

      // 3. Criar JSON de backup
      setBackupStatus({ status: 'finalizando', message: 'Finalizando backup...' });
      setBackupProgress(85);

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
      logger.debug(`Total de arquivos para download: ${todosArquivos.length}`);

      if (todosArquivos.length > 0) {
        setBackupStatus({ status: 'imagens', message: 'Baixando imagens...' });
        setBackupProgress(95);
        await createAndDownloadZip(todosArquivos, `imagens_opin_${new Date().toISOString().split('T')[0]}.zip`);
      } else {
        logger.warn('Nenhuma imagem encontrada para backup');
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

      setTimeout(() => { setBackupStatus({}); setBackupProgress(0); }, 5000);

    } catch (err) {
      logger.error('Erro no backup completo:', err);
      setBackupStatus({ status: 'erro', message: `Erro no backup: ${err.message}` });
      setBackupProgress(0);
    }
  };

  const backupApenasTabelas = async () => {
    try {
      setBackupStatus({ status: 'tabelas', message: 'Fazendo backup das tabelas em CSV...' });
      setBackupProgress(0);

      const backupTabelasData = {};
      for (let i = 0; i < TABELAS_SISTEMA.length; i++) {
        const tabela = TABELAS_SISTEMA[i];
        try {
          const { data, error } = await supabase.from(tabela.id).select('*');
          if (error) throw error;
          backupTabelasData[tabela.id] = data || [];
          setBackupProgress((i + 1) / TABELAS_SISTEMA.length * 100);
        } catch (err) {
          logger.error(`Erro ao fazer backup da tabela ${tabela.id}:`, err);
        }
      }

      const dataAtual = new Date().toISOString().split('T')[0];
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      for (const [tabelaId, dados] of Object.entries(backupTabelasData)) {
        if (dados && dados.length > 0) {
          const headers = Object.keys(dados[0]);
          const csvContent = [
            headers.join(','),
            ...dados.map(row =>
              headers.map(header => {
                const value = row[header];
                if (typeof value === 'string' && (value.includes(',') || value.includes('\n') || value.includes('"'))) {
                  return `"${value.replace(/"/g, '""')}"`;
                }
                return value || '';
              }).join(',')
            )
          ].join('\n');
          zip.file(`${tabelaId}_${dataAtual}.csv`, csvContent);
        }
      }

      const metadata = {
        dataBackup: new Date().toISOString(),
        tipo: 'backup_tabelas_csv',
        tabelas: Object.keys(backupTabelasData),
        totalRegistros: Object.values(backupTabelasData).reduce((acc, tabela) => acc + (tabela?.length || 0), 0),
        formato: 'CSV',
        descricao: 'Backup das tabelas do sistema OPIN em formato CSV'
      };
      zip.file(`metadata_${dataAtual}.json`, JSON.stringify(metadata, null, 2));

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

      setBackupStatus({ status: 'concluido', message: 'Backup das tabelas em CSV realizado com sucesso!' });
      setTimeout(() => { setBackupStatus({}); setBackupProgress(0); }, 3000);

    } catch (err) {
      logger.error('Erro no backup das tabelas:', err);
      setBackupStatus({ status: 'erro', message: `Erro no backup: ${err.message}` });
      setBackupProgress(0);
    }
  };

  const backupImagens = async () => {
    try {
      logger.debug('Iniciando backup das imagens...');
      setBackupStatus({ status: 'imagens', message: 'Preparando backup das imagens...' });
      setBackupProgress(0);

      const todosArquivos = [];

      for (let i = 0; i < BUCKETS_BACKUP.length; i++) {
        const bucket = BUCKETS_BACKUP[i];
        try {
          logger.debug(`Processando bucket: ${bucket.id} (${bucket.nome})`);
          setBackupStatus({ status: 'imagens', message: `Processando bucket: ${bucket.nome}...` });

          const { data: arquivos, error } = await supabase.storage
            .from(bucket.id)
            .list('', { limit: 1000 });

          if (error) {
            logger.error(`Erro ao listar arquivos do bucket ${bucket.id}:`, error);
            throw error;
          }

          logger.debug(`Bucket ${bucket.id} tem ${arquivos?.length || 0} arquivos`);

          if (arquivos && arquivos.length > 0) {
            for (const arquivo of arquivos) {
              try {
                const { data: urlData, error: urlError } = await supabase.storage
                  .from(bucket.id)
                  .createSignedUrl(arquivo.name, 3600);

                if (urlError) {
                  logger.error(`Erro ao gerar URL para ${arquivo.name}:`, urlError);
                  continue;
                }

                if (urlData?.signedUrl) {
                  todosArquivos.push({
                    ...arquivo,
                    url: urlData.signedUrl,
                    bucket: bucket.id,
                    bucketNome: bucket.nome
                  });
                }
              } catch (err) {
                logger.error(`Erro ao gerar URL para ${arquivo.name}:`, err);
              }
            }
          }

          setBackupProgress((i + 1) / BUCKETS_BACKUP.length * 100);
        } catch (err) {
          logger.error(`Erro ao processar bucket ${bucket.id}:`, err);
        }
      }

      logger.debug(`Total de arquivos encontrados: ${todosArquivos.length}`);

      if (todosArquivos.length > 0) {
        setBackupStatus({ status: 'download', message: `Criando arquivo ZIP com ${todosArquivos.length} imagens...` });
        await createAndDownloadZip(todosArquivos, `imagens_opin_${new Date().toISOString().split('T')[0]}.zip`);
        setBackupStatus({ status: 'concluido', message: `Backup das imagens realizado com sucesso! ${todosArquivos.length} arquivos baixados.` });
      } else {
        setBackupStatus({ status: 'concluido', message: 'Nenhuma imagem encontrada para backup.' });
      }

      setTimeout(() => { setBackupStatus({}); setBackupProgress(0); }, 3000);

    } catch (err) {
      logger.error('Erro no backup das imagens:', err);
      setBackupStatus({ status: 'erro', message: `Erro no backup: ${err.message}` });
      setBackupProgress(0);
    }
  };

  const isBackupRunning = ['iniciando', 'tabelas', 'buckets', 'finalizando', 'download', 'imagens'].includes(backupStatus.status);

  return (
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
            Inclui todas as tabelas, imagens dos buckets e tabelas de metadados (fontes_dados e versoes_dados)
          </p>
          <button
            onClick={backupCompletoSite}
            disabled={isBackupRunning}
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
                <div className="w-6 h-6"></div>
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
  );
};

export default BackupSection;
