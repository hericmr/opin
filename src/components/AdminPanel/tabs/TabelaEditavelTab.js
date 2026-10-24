import React, { useState, useMemo } from 'react';
import EditableTable from '../components/EditableTable';
import { useEscolas } from '../hooks/useEscolas';
import { AlertCircle, ArrowLeft, CheckCircle2, Download, Loader2, Search, X } from 'lucide-react';
import logger from '../../../utils/logger';
import GlobalSpinner from '../../GlobalSpinner';
import { useTextScale } from '../../../hooks/useTextScale';
import { COLUMN_GROUPS, NAME_COLUMN, TABLE_COLUMNS } from '../constants/tabelaColumns';

// Aspas dobradas e campo entre aspas, como pede o formato CSV
const campoCSV = (value) => `"${(value === null || value === undefined ? '' : String(value)).replace(/"/g, '""')}"`;

const TabelaEditavelTab = ({ setEditingLocation, onShowMetadadosModal, onOpenEscola }) => {
  const {
    escolas,
    loading: escolasLoading,
    error: escolasError,
    saveEscola
  } = useEscolas();

  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('todas');

  // Controle de tamanho do texto (reutilizando lógica do MapSelector)
  const [textScale, cycleTextScale] = useTextScale();

  const visibleColumns = useMemo(() => (
    selectedGroup === 'todas'
      ? TABLE_COLUMNS
      : TABLE_COLUMNS.filter(column => column.group === selectedGroup)
  ), [selectedGroup]);

  // Exporta todas as escolas com as mesmas colunas da tabela
  const exportToCSV = () => {
    const columns = [NAME_COLUMN, ...TABLE_COLUMNS];
    const csvContent = [
      columns.map(column => campoCSV(column.label)).join(','),
      ...escolas.map(escola => columns.map(column => campoCSV(escola[column.key])).join(','))
    ].join('\n');

    // BOM para o Excel reconhecer os acentos
    const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'escolas_indigenas.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Função para salvar alterações na tabela
  const handleTableSave = async (updatedData, campoAlterado) => {
    try {
      setTableLoading(true);
      setTableError(null);

      // Salvar escola sem metadados (metadados serão salvos depois no modal)
      const result = await saveEscola(updatedData, null);

      if (result.success) {
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);

        // Preparar dados para o modal de metadados
        if (onShowMetadadosModal && campoAlterado) {
          const camposAlterados = [{
            campo: campoAlterado.campo,
            valorAntigo: campoAlterado.valorAntigo || '',
            valorNovo: campoAlterado.valorNovo || '',
            label: campoAlterado.label || campoAlterado.campo
          }];

          onShowMetadadosModal(
            updatedData.id || result.data.id,
            updatedData.Escola || 'Escola',
            camposAlterados
          );
        }
      } else {
        setTableError(result.error || 'Erro ao salvar escola');
      }

    } catch (error) {
      logger.error('Erro ao salvar escola:', error);
      setTableError(error.message);
    } finally {
      setTableLoading(false);
    }
  };

  // Filtrar escolas baseado na busca
  const filteredEscolas = useMemo(() => {
    if (!searchTerm.trim()) return escolas;

    const term = searchTerm.toLowerCase();
    return escolas.filter(escola =>
      escola.Escola?.toLowerCase().includes(term) ||
      escola['Município']?.toLowerCase().includes(term) ||
      escola['Endereço']?.toLowerCase().includes(term) ||
      escola['Terra Indigena (TI)']?.toLowerCase().includes(term)
    );
  }, [escolas, searchTerm]);

  if (escolasLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-950">
        <GlobalSpinner message="Carregando escolas..." lightText={true} />
      </div>
    );
  }

  const groupButtonClass = (active) => `flex-shrink-0 px-3 py-1.5 text-xs rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${active
    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
    : 'border-gray-700 text-gray-400 hover:text-gray-100 hover:border-gray-600'
    }`;

  return (
    <div className="flex flex-col h-full bg-gray-950 text-gray-100">
      {/* Barra de ferramentas */}
      <div className="flex-shrink-0 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-3 flex-wrap px-4 pt-3 pb-2">
          <button
            type="button"
            onClick={() => setEditingLocation(null)}
            className="inline-flex items-center gap-1.5 px-2.5 py-2 text-sm text-gray-300 rounded-lg hover:bg-gray-800 hover:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
            title="Voltar ao painel principal"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>

          <div className="mr-2">
            <h2 className="text-base font-semibold text-gray-100 leading-tight">Edição em tabela</h2>
            <p className="text-xs text-gray-500 leading-tight mt-0.5">
              {searchTerm ? `${filteredEscolas.length} de ${escolas.length} escolas` : `${escolas.length} escolas`} · clique numa célula para editar
            </p>
          </div>

          {/* Busca */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
            <input
              type="text"
              placeholder="Buscar escola, município, TI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm bg-gray-950 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-gray-500 hover:text-gray-100"
                aria-label="Limpar busca"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status do salvamento */}
          <div className="flex items-center text-xs min-h-[1.5rem]" role="status">
            {tableLoading ? (
              <span className="inline-flex items-center gap-1.5 text-gray-400">
                <Loader2 size={14} className="animate-spin" />
                Salvando...
              </span>
            ) : updateSuccess ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 size={14} />
                Salvo
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Botão Ajuste de Texto */}
            <button
              type="button"
              onClick={cycleTextScale}
              className="flex items-center gap-1.5 px-2.5 py-2 text-gray-300 rounded-lg border border-gray-700 hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
              aria-label="Ajustar tamanho do texto"
              title={`Tamanho do texto: ${Math.round(textScale * 100)}%`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M6.6117 5.00684C6.86862 5.02589 7.11696 5.11134 7.3324 5.25488C7.57862 5.41908 7.77125 5.65263 7.88514 5.92578L11.9232 15.6162C12.1352 16.1258 11.8947 16.7115 11.3851 16.9238C10.8755 17.1362 10.2901 16.8942 10.0775 16.3848L9.08338 14H3.91736L2.92322 16.3857C2.71049 16.8948 2.12502 17.1359 1.6156 16.9238C1.10605 16.7114 0.865522 16.1258 1.07752 15.6162L5.11658 5.92578L5.16248 5.8252C5.27895 5.59518 5.45376 5.39859 5.66932 5.25488L5.76307 5.19727C5.98766 5.07035 6.24213 5.00195 6.50135 5.00195L6.6117 5.00684ZM4.75135 12H8.25037L6.50037 7.80176L4.75135 12Z" fill="#CDE8CF"></path>
                  <path d="M18.0209 6.00098C18.0385 6.00133 18.0561 6.00165 18.0736 6.00293C18.0913 6.00421 18.1089 6.00562 18.1263 6.00781C18.1434 6.00996 18.1602 6.01358 18.1771 6.0166C18.1869 6.01835 18.1968 6.01946 18.2064 6.02148C18.234 6.02726 18.2614 6.03388 18.2885 6.04199C18.2921 6.04309 18.2956 6.04476 18.2992 6.0459C18.317 6.05145 18.3344 6.05789 18.3519 6.06445C18.368 6.07049 18.3841 6.07618 18.3998 6.08301C18.5114 6.13159 18.6161 6.20168 18.7074 6.29297L22.7074 10.293C23.0977 10.6835 23.0979 11.3166 22.7074 11.707C22.3169 12.0975 21.6839 12.0973 21.2933 11.707L19.0004 9.41406V16C19.0004 16.5522 18.5526 16.9999 18.0004 17C17.4481 17 17.0004 16.5523 17.0004 16V9.41406L14.7074 11.707C14.3169 12.0975 13.6839 12.0973 13.2933 11.707C12.9028 11.3165 12.9028 10.6835 13.2933 10.293L17.2933 6.29297C17.3386 6.2477 17.3876 6.20587 17.4408 6.16992C17.4934 6.13439 17.5488 6.10452 17.6058 6.08008C17.6512 6.06059 17.6989 6.04587 17.7474 6.0332C17.7614 6.02955 17.7753 6.0255 17.7894 6.02246C17.8033 6.01948 17.8173 6.01704 17.8314 6.01465C17.847 6.01199 17.8626 6.00973 17.8783 6.00781C17.8961 6.00565 17.914 6.00415 17.932 6.00293C17.948 6.00184 17.9639 6.00131 17.9799 6.00098C17.9866 6.00084 17.9936 6 18.0004 6C18.0072 6 18.0141 6.00084 18.0209 6.00098Z" fill="#CDE8CF"></path>
                </svg>
              <span className="text-xs hidden sm:inline">{Math.round(textScale * 100)}%</span>
            </button>

            <button
              type="button"
              onClick={exportToCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-200 rounded-lg border border-gray-700 hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 whitespace-nowrap"
              title="Baixar todas as escolas em CSV"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Exportar CSV</span>
              <span className="sm:hidden">CSV</span>
            </button>
          </div>
        </div>

        {/* Grupos de colunas */}
        <div className="tabs-container flex items-center gap-1.5 px-4 pb-3" role="group" aria-label="Colunas exibidas">
          <span className="flex-shrink-0 mr-1 text-xs text-gray-500">Colunas:</span>
          <button
            type="button"
            className={groupButtonClass(selectedGroup === 'todas')}
            aria-pressed={selectedGroup === 'todas'}
            onClick={() => setSelectedGroup('todas')}
          >
            Todas
          </button>
          {COLUMN_GROUPS.map(group => (
            <button
              key={group.id}
              type="button"
              className={groupButtonClass(selectedGroup === group.id)}
              aria-pressed={selectedGroup === group.id}
              onClick={() => setSelectedGroup(group.id)}
            >
              {group.label}
            </button>
          ))}
        </div>
      </div>

      {/* Erros */}
      {(escolasError || tableError) && (
        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-red-950/40 border-b border-red-900 text-sm text-red-300">
          <AlertCircle size={14} className="flex-shrink-0" />
          {escolasError ? `Erro ao carregar escolas: ${escolasError}` : tableError}
        </div>
      )}

      {/* Tabela Editável */}
      {!escolasError && (
        <div className="flex-1 min-h-0">
          {/* key: trocar o grupo recria a tabela, voltando a rolagem para o início */}
          <EditableTable
            key={selectedGroup}
            escolas={filteredEscolas}
            columns={visibleColumns}
            onSave={handleTableSave}
            onOpenEscola={onOpenEscola}
          />
        </div>
      )}
    </div>
  );
};

export default TabelaEditavelTab;
