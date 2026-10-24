import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold">{data.nome}</p>
        <p className="text-sm text-gray-600">CIE: {data.cie}</p>
        <p className="text-sm">Alunos: {data.alunos}</p>
      </div>
    );
  }
  return null;
};

const AlunosPorEscolaChart = ({ data }) => {
  // Função para normalizar nomes das escolas
  const normalizeSchoolName = (name) => {
    if (!name) return '';
    
    return name
      .toLowerCase()
      .split(' ')
      .map(word => {
        // Palavras que devem permanecer em maiúscula
        const uppercaseWords = ['ee', 'eei', 'eja', 'sp', 'unifesp', 'lindi'];
        if (uppercaseWords.includes(word)) {
          return word.toUpperCase();
        }
        // Primeira letra de cada palavra em maiúscula
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  };

  // Normaliza os dados antes de renderizar
  const normalizedData = data.map(item => ({
    ...item,
    nome: normalizeSchoolName(item.nome)
  }));

  // Distribuição por faixa de alunos (dinâmica) para o texto abaixo
  const totalEscolas = data.length;
  const contarFaixa = (predicado) => data.filter(item => predicado(item.alunos)).length;
  const fmtPct = (valor) => totalEscolas
    ? ((valor / totalEscolas) * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    : '0,0';
  const escAte10 = contarFaixa((a) => a < 10);
  const esc11a25 = contarFaixa((a) => a >= 10 && a < 25);
  const esc26a50 = contarFaixa((a) => a >= 25 && a < 50);
  const esc51a100 = contarFaixa((a) => a >= 50 && a < 100);
  const escMais100 = contarFaixa((a) => a >= 100);
  const escPequenas = escAte10 + esc11a25 + esc26a50;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl sm:text-3xl font-bold mb-8 pb-4 border-b border-gray-100 text-gray-900">
        Número de Alunos por Escola Indígena
      </h3>
      
      {/* Texto introdutório */}
      <div className="mb-6 p-4 max-w-4xl mx-auto">
        <p className="text-gray-700 leading-relaxed text-left">
          A maioria das EEIs atende a um pequeno contingente de alunos. {escAte10} escolas ({fmtPct(escAte10)}%) possuem até 10 alunos, {esc11a25} escolas ({fmtPct(esc11a25)}%) atendem entre 11 e 25 alunos, e {esc26a50} escolas ({fmtPct(esc26a50)}%) concentram de 26 a 50 alunos. Juntas, essas {escPequenas} unidades de porte reduzido representam {fmtPct(escPequenas)}% da rede, evidenciando o predomínio de escolas pequenas. Em contraste, apenas {esc51a100} escolas ({fmtPct(esc51a100)}%) atendem entre 51 e 100 alunos, e outras {escMais100} ({fmtPct(escMais100)}%) possuem mais de 100 alunos, indicando que poucas unidades concentram grandes contingentes estudantis.
        </p>
        
        <p className="text-gray-700 leading-relaxed mt-4 text-left">
          Entre as escolas de maior porte, destacam-se a EEI Guarani Gwyra Pepo, com 296 alunos, a EEI Djekupe Amba Arandy, com 249 alunos, e a EEI Txeru Ba'e Kua-i, com 111 alunos. No extremo oposto, algumas escolas atendem menos de 10 alunos, como a Aldeia Uru'ity, com 4 estudantes, e a Aldeia Santa Cruz, com apenas 3. Essa distribuição evidencia a grande heterogeneidade no tamanho das turmas, o que impacta diretamente a gestão, a oferta de recursos e a qualidade do ensino.
        </p>
      </div>
      <div className="h-96" style={{ minWidth: '300px', minHeight: '384px', width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={384}>
          <BarChart
            data={normalizedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="nome" 
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
            />
            <YAxis 
              label={{ value: 'Número de Alunos', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Renderiza as barras com cores alternadas */}
            <Bar isAnimationActive={false} dataKey="alunos">
              {normalizedData.map((entry, index) => {
                const colors = ['#FF805A', '#234B73', '#FFA000', '#783CA0', '#14512D', '#4C1D95', '#2C5530', '#0EA5E9', '#F43F5E', '#10B981'];
                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-6 text-xs text-gray-400 text-center uppercase tracking-wider">
        Fonte: Héric Moura LINDI(UNIFESP), a partir de dados da SEDUC 2026
      </p>
    </div>
  );
};

export default AlunosPorEscolaChart;