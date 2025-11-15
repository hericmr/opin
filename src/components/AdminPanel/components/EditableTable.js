import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Edit2, AlertCircle } from 'lucide-react';

const EditableTable = ({ 
  escolas, 
  onSave, 
  loading = false,
  error = null 
}) => {
  const [canScroll, setCanScroll] = useState(false);
  const scrollRef = useRef(null);

  // Verificar se há scroll horizontal ou vertical
  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const hasHorizontalScroll = scrollRef.current.scrollWidth > scrollRef.current.clientWidth;
        const hasVerticalScroll = scrollRef.current.scrollHeight > scrollRef.current.clientHeight;
        setCanScroll(hasHorizontalScroll || hasVerticalScroll);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [escolas]);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [originalValue, setOriginalValue] = useState('');

  // Colunas da tabela - definidas antes dos callbacks
  const columns = useMemo(() => [
    { key: 'Escola', label: 'Escola', width: 'w-32' },
    { key: 'Município', label: 'Município', width: 'w-28' },
    { key: 'Endereço', label: 'Endereço', width: 'w-40' },
    { key: 'Terra Indigena (TI)', label: 'Terra Indígena', width: 'w-32' },
    { key: 'Parcerias com o município', label: 'Parcerias', width: 'w-32' },
    { key: 'Diretoria de Ensino', label: 'Diretoria', width: 'w-32' },
    { key: 'Ano de criação da escola', label: 'Ano Criação', width: 'w-24' },
    { key: 'Povos indigenas', label: 'Povos', width: 'w-32' },
    { key: 'Linguas faladas', label: 'Línguas', width: 'w-32' },
    { key: 'Modalidade de Ensino/turnos de funcionamento', label: 'Modalidade', width: 'w-48' },
    { key: 'Numero de alunos', label: 'Alunos', width: 'w-20' },
    { key: 'turnos_funcionamento', label: 'Turnos', width: 'w-24' },
    { key: 'Espaço escolar e estrutura', label: 'Estrutura', width: 'w-40' },
    { key: 'Acesso à água', label: 'Água', width: 'w-24' },
    { key: 'Tem coleta de lixo?', label: 'Coleta Lixo', width: 'w-24' },
    { key: 'Acesso à internet', label: 'Internet', width: 'w-24' },
    { key: 'Equipamentos Tecs', label: 'Equipamentos', width: 'w-32' },
    { key: 'Modo de acesso à escola', label: 'Acesso', width: 'w-32' },
    { key: 'Gestão/Nome', label: 'Gestão', width: 'w-32' },
    { key: 'Outros funcionários', label: 'Funcionários', width: 'w-32' },
    { key: 'Quantidade de professores indígenas', label: 'Prof. Indígenas', width: 'w-28' },
    { key: 'Quantidade de professores não indígenas', label: 'Prof. Não Indígenas', width: 'w-32' },
    { key: 'Professores falam a língua indígena?', label: 'Falam Língua', width: 'w-24' },
    { key: 'Formação dos professores', label: 'Formação', width: 'w-32' },
    { key: 'Formação continuada oferecida', label: 'Formação Cont.', width: 'w-32' },
    { key: 'PPP elaborado com a comunidade?', label: 'PPP Comunidade', width: 'w-28' },
    { key: 'Projetos em andamento', label: 'Projetos', width: 'w-32' },
    { key: 'Parcerias com universidades?', label: 'Parcerias Univ.', width: 'w-28' },
    { key: 'Ações com ONGs ou coletivos?', label: 'ONGs', width: 'w-24' },
    { key: 'Desejos da comunidade para a escola', label: 'Desejos', width: 'w-40' },
    { key: 'Escola utiliza redes sociais?', label: 'Redes Sociais', width: 'w-24' },
    { key: 'Links das redes sociais', label: 'Links Redes', width: 'w-40' },
    { key: 'historia_da_escola', label: 'História', width: 'w-40' },
    { key: 'Latitude', label: 'Latitude', width: 'w-20' },
    { key: 'Longitude', label: 'Longitude', width: 'w-20' },
    { key: 'links', label: 'Links', width: 'w-32' },
    { key: 'link_para_videos', label: 'Vídeos', width: 'w-32' },
    { key: 'logradouro', label: 'Logradouro', width: 'w-32' },
    { key: 'numero', label: 'Número', width: 'w-16' },
    { key: 'complemento', label: 'Complemento', width: 'w-24' },
    { key: 'bairro', label: 'Bairro', width: 'w-24' },
    { key: 'cep', label: 'CEP', width: 'w-20' },
    { key: 'estado', label: 'Estado', width: 'w-16' },
    { key: 'nome_professor', label: 'Nome Professor', width: 'w-32' },
    { key: 'professores_indigenas', label: 'Prof. Indígenas (Det.)', width: 'w-32' },
    { key: 'professores_nao_indigenas', label: 'Prof. Não Indígenas (Det.)', width: 'w-32' },
    { key: 'professores_falam_lingua_indigena', label: 'Falam Língua (Det.)', width: 'w-32' },
    { key: 'formacao_professores', label: 'Formação (Det.)', width: 'w-32' },
    { key: 'visitas_supervisores_formacao', label: 'Visitas Supervisores', width: 'w-32' },
    { key: 'outros_funcionarios', label: 'Outros Funcionários (Det.)', width: 'w-32' },
    { key: 'gestao', label: 'Gestão (Det.)', width: 'w-32' },
    { key: 'merenda_diferenciada', label: 'Merenda Diferenciada', width: 'w-32' },
    { key: 'diferenciada', label: 'Diferenciada', width: 'w-24' },
    { key: 'actions', label: 'Ações', width: 'w-32' }
  ], []);

  // Iniciar edição de uma célula
  const startEditing = useCallback((rowIndex, columnKey, value) => {
    setEditingCell({ rowIndex, columnKey });
    setEditValue(value || '');
    setOriginalValue(value || '');
  }, []);

  // Cancelar edição
  const cancelEditing = useCallback(() => {
    setEditingCell(null);
    setEditValue('');
    setOriginalValue('');
  }, []);

  // Salvar edição
  const saveEdit = useCallback(async () => {
    if (!editingCell) return;

    const { rowIndex, columnKey } = editingCell;
    const escola = escolas[rowIndex];
    
    // Só salvar se o valor mudou
    if (editValue !== originalValue) {
      const updatedEscola = {
        ...escola,
        [columnKey]: editValue
      };
      
      // Encontrar o label da coluna
      const column = columns.find(col => col.key === columnKey);
      const label = column ? column.label : columnKey;
      
      // Preparar informação do campo alterado para o modal de metadados
      const campoAlterado = {
        campo: columnKey,
        valorAntigo: originalValue,
        valorNovo: editValue,
        label: label
      };
      
      await onSave(updatedEscola, campoAlterado);
    }
    
    cancelEditing();
  }, [editingCell, editValue, originalValue, escolas, onSave, cancelEditing, columns]);

  // Lidar com tecla Enter para salvar
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEditing();
    }
  }, [saveEdit, cancelEditing]);

  // Renderizar célula editável
  const renderCell = (escola, column, rowIndex) => {
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnKey === column.key;
    const value = escola[column.key] || '';

    if (column.key === 'actions') {
      return (
        <div className="flex items-center justify-center">
          <div className="text-gray-500 text-xs">
            {isEditing ? 'Editando...' : 'Editar'}
          </div>
        </div>
      );
    }

    if (isEditing) {
      // Determinar o tipo de input baseado na coluna
      let inputType = 'text';
      let inputProps = {};
      
      if (column.key === 'Numero de alunos') {
        inputType = 'number';
        inputProps = { min: 0, step: 1 };
      } else if (column.key === 'Modalidade de Ensino/turnos de funcionamento') {
        inputType = 'textarea';
      }

      if (inputType === 'textarea') {
        return (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveEdit}
            className="w-full px-2 py-1 text-sm bg-gray-800 border border-blue-400 rounded text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
            autoFocus
          />
        );
      }

      return (
        <input
          type={inputType}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={saveEdit}
          className="w-full px-2 py-1 text-sm bg-gray-800 border border-blue-400 rounded text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          autoFocus
          {...inputProps}
        />
      );
    }

    return (
      <div 
        className="cursor-pointer hover:bg-gray-700/50 px-2 py-1.5 rounded transition-colors group relative"
        onClick={() => startEditing(rowIndex, column.key, value)}
        title="Clique para editar"
      >
        <div className="flex items-center gap-1.5">
          <span className="text-gray-300 group-hover:text-white text-xs flex-1 truncate">
            {value && value.length > 30 
              ? `${value.substring(0, 30)}...` 
              : value || <span className="text-gray-500">-</span>}
          </span>
          <Edit2 size={12} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Status Bar - mais discreto */}
      {(loading || error) && (
        <div className="flex-shrink-0 bg-gray-800/50 px-4 py-2 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            {loading && (
              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-400"></div>
                <span>Salvando alterações...</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabela */}
      <div 
        ref={scrollRef}
        className={`editable-table-scroll flex-1 relative ${canScroll ? 'can-scroll' : ''}`}
        style={{ overflow: 'auto' }}
      >
        <table className="w-full min-w-[3000px]">
          <thead className="bg-gray-800/80 sticky top-0 z-10">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${column.width} px-3 py-3 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider border-b border-gray-700`}
                >
                  <div className="truncate" title={column.label}>
                    {column.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {escolas.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">
                  Nenhuma escola encontrada
                </td>
              </tr>
            ) : (
              escolas.map((escola, rowIndex) => (
                <tr 
                  key={escola.id || rowIndex} 
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-3 py-2.5 text-xs"
                    >
                      {renderCell(escola, column, rowIndex)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditableTable;
