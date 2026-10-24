import React, { memo } from 'react';
import { Check, X } from 'lucide-react';

/**
 * Ficha da escola: seções com título e uma lista de dados (rótulo acima, valor abaixo).
 * Dados curtos ficam em 2 colunas; textos longos e listas ocupam a linha inteira.
 */

// Marcadores usados na planilha para "não preenchido"; "Sim/Não/Parcial" é o
// texto-modelo do formulário que ficou sem resposta
const MARCADORES_VAZIO = new Set(['-', '–', '—', 'n/a', 'sim/não/parcial', 'sim/nao/parcial']);

// Valor ausente: não vira linha na ficha (0 e false são valores válidos)
export const isVazio = (valor) =>
  valor === null || valor === undefined ||
  (typeof valor === 'string' && (valor.trim() === '' || MARCADORES_VAZIO.has(valor.trim().toLowerCase()))) ||
  (typeof valor === 'number' && Number.isNaN(valor));

// Só texto realmente longo ocupa a linha inteira; o resto se encaixa na grade
const isLongo = (valor) =>
  typeof valor === 'string' && (valor.trim().length > 60 || valor.includes('\n'));

// "Sim"/"Não" (string ou booleano) como selo; outros valores voltam como texto
export const SimNao = memo(function SimNao({ valor }) {
  const texto = typeof valor === 'boolean' ? (valor ? 'sim' : 'não') : String(valor).trim().toLowerCase();
  const sim = texto === 'sim' || texto === 'true';
  const nao = texto === 'não' || texto === 'nao' || texto === 'false';
  if (!sim && !nao) return String(valor);
  const Icone = sim ? Check : X;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium ring-1 ring-inset ${
        sim ? 'bg-green-50 text-green-800 ring-green-600/20' : 'bg-gray-100 text-gray-700 ring-gray-500/20'
      }`}
    >
      <Icone className="w-3.5 h-3.5" aria-hidden="true" />
      {sim ? 'Sim' : 'Não'}
    </span>
  );
});

// Subtítulo pequeno para grupos de dados e blocos dentro da ficha; `extra` à direita
export const TituloDiscreto = ({ children, extra = null }) => (
  <div className="not-prose flex items-baseline gap-3 pt-6 mb-3 border-t border-gray-200">
    <h3 className="text-sm font-semibold text-gray-900">{children}</h3>
    {extra && <span className="ml-auto text-sm text-gray-600 whitespace-nowrap">{extra}</span>}
  </div>
);

export const FichaSecao = memo(function FichaSecao({ titulo, children, semTitulo = false }) {
  // not-prose: o painel envolve o conteúdo em .prose, que restilizaria h3, dl e ul
  return (
    <section aria-label={titulo} className="not-prose">
      {/* Sem título visível quando o contexto já basta (ex.: dados logo abaixo do nome da escola) */}
      {titulo && !semTitulo && <TituloDiscreto>{titulo}</TituloDiscreto>}
      {children}
    </section>
  );
});

/**
 * @param {Array<{rotulo: string, valor: any, tipo?: 'simnao'|'numero', inteiro?: boolean, detalhe?: string}>} itens
 */
export const FichaLista = memo(function FichaLista({ itens }) {
  const visiveis = itens.filter((item) => item && !isVazio(item.valor));
  if (visiveis.length === 0) return null;
  return (
    // dense: itens curtos preenchem os buracos deixados pelos de linha inteira
    <dl className="grid grid-cols-2 lg:grid-cols-3 grid-flow-row-dense gap-x-6 gap-y-5">
      {visiveis.map(({ rotulo, valor, tipo, inteiro, detalhe }) => {
        const linhaInteira = inteiro ?? (React.isValidElement(valor) ? false : isLongo(valor));
        return (
          <div key={rotulo} className={`min-w-0 ${linhaInteira ? 'col-span-full' : ''}`}>
            <dt className="text-sm text-gray-600">{rotulo}</dt>
            <dd className="mt-1 text-base text-gray-900 leading-relaxed whitespace-pre-line break-words">
              {tipo === 'simnao' ? <SimNao valor={valor} />
                : tipo === 'numero' && !Number.isNaN(Number(valor)) ? <span className="text-xl font-semibold tabular-nums">{Number(valor).toLocaleString('pt-BR')}</span>
                : valor}
              {detalhe && <p className="mt-1 text-sm text-gray-600">{detalhe}</p>}
            </dd>
          </div>
        );
      })}
    </dl>
  );
});

// Lista com marcadores para valores com vários itens (ex.: modalidades)
export const ListaItens = ({ itens }) => (
  <ul className="list-disc pl-5 space-y-1 marker:text-green-700">
    {itens.map((item) => <li key={item}>{item}</li>)}
  </ul>
);
