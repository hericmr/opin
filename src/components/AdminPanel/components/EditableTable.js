import React, { useState, useCallback, useMemo, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { NAME_COLUMN } from '../constants/tabelaColumns';

const paraTexto = (value) => (value === null || value === undefined ? '' : String(value));

const EditableTable = ({
  escolas,
  columns,
  onSave,
  onOpenEscola
}) => {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [originalValue, setOriginalValue] = useState('');
  // Evita salvar duas vezes: Enter salva e, logo depois, o blur dispararia de novo
  const salvandoRef = useRef(false);

  // Em telas estreitas a coluna fixa do nome não pode ocupar metade da largura
  const nameColumn = useMemo(() => (
    typeof window !== 'undefined' && window.innerWidth < 640
      ? { ...NAME_COLUMN, width: 150 }
      : NAME_COLUMN
  ), []);
  const allColumns = useMemo(() => [nameColumn, ...columns], [nameColumn, columns]);
  const tableWidth = allColumns.reduce((total, column) => total + column.width, 0);

  // Iniciar edição de uma célula
  const startEditing = useCallback((escolaId, columnKey, value) => {
    setEditingCell({ escolaId, columnKey });
    setEditValue(paraTexto(value));
    setOriginalValue(paraTexto(value));
  }, []);

  // Cancelar edição
  const cancelEditing = useCallback(() => {
    setEditingCell(null);
    setEditValue('');
    setOriginalValue('');
  }, []);

  // Salvar edição
  const saveEdit = useCallback(async () => {
    if (!editingCell || salvandoRef.current) return;

    const { escolaId, columnKey } = editingCell;
    const escola = escolas.find(e => e.id === escolaId);

    // Só salvar se o valor mudou
    if (escola && editValue !== originalValue) {
      salvandoRef.current = true;
      const column = allColumns.find(col => col.key === columnKey);

      // Informação do campo alterado para o modal de metadados
      const campoAlterado = {
        campo: columnKey,
        valorAntigo: originalValue,
        valorNovo: editValue,
        label: column ? column.label : columnKey
      };

      try {
        await onSave({ ...escola, [columnKey]: editValue }, campoAlterado);
      } finally {
        salvandoRef.current = false;
      }
    }

    cancelEditing();
  }, [editingCell, editValue, originalValue, escolas, onSave, cancelEditing, allColumns]);

  // Enter salva (Ctrl+Enter em textos longos, onde Enter quebra linha); Esc cancela
  const handleKeyDown = useCallback((e, isLong) => {
    if (e.key === 'Enter' && (!isLong || e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEditing();
    }
  }, [saveEdit, cancelEditing]);

  const renderEditor = (column) => {
    const isLong = column.type === 'long';

    if (isLong) {
      return (
        <div className="absolute left-0 top-0 z-30 w-full min-w-[320px] p-1.5 bg-gray-900 border border-emerald-500 rounded-lg shadow-2xl shadow-black/50">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, true)}
            onBlur={saveEdit}
            className="block w-full px-2 py-1.5 text-sm bg-gray-950 rounded text-gray-100 focus:outline-none resize-y"
            rows={6}
            autoFocus
          />
          <p className="px-1 pt-1 text-[11px] text-gray-500">
            Ctrl+Enter salva · Esc cancela
          </p>
        </div>
      );
    }

    return (
      <input
        type={column.type === 'number' ? 'number' : 'text'}
        min={column.type === 'number' ? 0 : undefined}
        step={column.type === 'number' ? 1 : undefined}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, false)}
        onBlur={saveEdit}
        className="w-full px-2 py-1.5 text-sm bg-gray-950 border border-emerald-500 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        autoFocus
      />
    );
  };

  const renderCell = (escola, column) => {
    const isEditing = editingCell?.escolaId === escola.id && editingCell?.columnKey === column.key;
    const value = paraTexto(escola[column.key]);

    if (isEditing) return renderEditor(column);

    return (
      <button
        type="button"
        className="block w-full text-left px-2 py-1.5 rounded hover:bg-gray-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        onClick={() => startEditing(escola.id, column.key, escola[column.key])}
        title={value || 'Clique para preencher'}
      >
        {value ? (
          <span className="line-clamp-2 break-words text-gray-200">{value}</span>
        ) : (
          <span className="text-gray-600">—</span>
        )}
      </button>
    );
  };

  return (
    <div className="h-full overflow-auto scrollbar-thin">
      <table
        className="table-fixed border-separate border-spacing-0 text-xs"
        style={{ width: tableWidth }}
      >
        <colgroup>
          {allColumns.map(column => (
            <col key={column.key} style={{ width: column.width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {allColumns.map((column, index) => (
              <th
                key={column.key}
                scope="col"
                className={`sticky top-0 px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400 bg-gray-900 border-b border-gray-700 ${index === 0 ? 'left-0 z-20 border-r' : 'z-10'
                  }`}
              >
                <div className="truncate" title={column.label}>{column.label}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {escolas.length === 0 ? (
            <tr>
              <td colSpan={allColumns.length} className="sticky left-0 px-4 py-12 text-center text-sm text-gray-400">
                Nenhuma escola encontrada
              </td>
            </tr>
          ) : (
            escolas.map(escola => (
              <tr key={escola.id} className="group">
                {/* Coluna fixa com o nome da escola */}
                <th
                  scope="row"
                  className="sticky left-0 z-[5] p-1.5 text-left font-normal align-top bg-gray-900 group-hover:bg-gray-800 border-b border-r border-gray-800"
                >
                  <div className="flex items-start gap-1">
                    <div className="flex-1 min-w-0 relative">
                      {renderCell(escola, nameColumn)}
                    </div>
                    {onOpenEscola && (
                      <button
                        type="button"
                        onClick={() => onOpenEscola(escola)}
                        className="flex-shrink-0 mt-0.5 p-1 rounded text-gray-500 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-emerald-300 hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        title="Abrir no editor completo"
                        aria-label={`Abrir ${escola.Escola} no editor completo`}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </th>
                {columns.map(column => (
                  <td
                    key={column.key}
                    className="relative p-1.5 align-top bg-gray-900 group-hover:bg-gray-800 border-b border-gray-800"
                  >
                    {renderCell(escola, column)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EditableTable;
