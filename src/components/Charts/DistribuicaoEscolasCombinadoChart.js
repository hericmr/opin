import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// Tooltip para o gráfico de pizza
const PieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-gray-300 rounded shadow-lg" style={{
        fontFamily: '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <p className="font-semibold mb-1 text-base sm:text-lg leading-relaxed max-w-4xl mx-auto" >{data.name}</p>
        <p className="text-sm text-gray-600 leading-relaxed">Escolas: {data.value}</p>
        <p className="text-sm text-gray-600 leading-relaxed">Percentual: {((data.value / data.total) * 100).toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

// Tooltip para o gráfico de barras
const BarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-gray-300 rounded shadow-lg" style={{
        fontFamily: '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <p className="font-semibold mb-1 text-base sm:text-lg leading-relaxed max-w-4xl mx-auto" >{data.nome}</p>
        <p className="text-sm text-gray-600 leading-relaxed">CIE: {data.cie}</p>
        <p className="text-sm text-gray-600 leading-relaxed">Alunos: {data.alunos}</p>
      </div>
    );
  }
  return null;
};

// Label customizado para o gráfico de pizza
const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const DistribuicaoEscolasCombinadoChart = ({ distribuicaoData, alunosPorEscolaData }) => {
  // Paleta de cores variada e harmoniosa
  const CHART_COLORS = ['#FF805A', '#234B73', '#FFA000', '#783CA0', '#14512D', '#4C1D95', '#2C5530', '#0EA5E9', '#F43F5E', '#10B981'];

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
  const normalizedAlunosData = alunosPorEscolaData.map(item => ({
    ...item,
    nome: normalizeSchoolName(item.nome)
  }));

  // Calcula o total para percentuais do gráfico de pizza
  const total = distribuicaoData.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = distribuicaoData.map(item => ({ ...item, total }));

  // Contagens por faixa de alunos (dinâmicas, derivadas de distribuicaoData) para o texto abaixo
  const faixaEscolas = (nome) => distribuicaoData.find(item => item.name === nome)?.value || 0;
  const fmtPct = (valor) => total
    ? ((valor / total) * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    : '0,0';
  const escAte10 = faixaEscolas('Até 10 alunos');
  const esc11a25 = faixaEscolas('11 a 25 alunos');
  const esc26a50 = faixaEscolas('26 a 50 alunos');
  const esc51a100 = faixaEscolas('51 a 100 alunos');
  const escMais100 = faixaEscolas('Mais de 100 alunos');
  const escPequenas = escAte10 + esc11a25 + esc26a50;

  return (
    <div className="p-4 sm:p-6">
      {/* Título principal */}
      

      {/* Texto introdutório */}
      <div className="mb-6 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-800 text-left mb-5 text-base sm:text-lg leading-relaxed max-w-4xl mx-auto" >
            As EEIs, em sua grande parte, funcionam com turmas de número reduzido a moderado, o que garante um cuidado individualizado e um acompanhamento pedagógico mais próximo dos estudantes.
          </p>
          <p className="text-gray-800 text-left mb-5 text-base sm:text-lg leading-relaxed max-w-4xl mx-auto" >
            {escAte10} escolas ({fmtPct(escAte10)}%) possuem até 10 alunos, {esc11a25} escolas ({fmtPct(esc11a25)}%) atendem entre 11 e 25 alunos, e {esc26a50} escolas ({fmtPct(esc26a50)}%) concentram de 26 a 50 alunos. Juntas, essas {escPequenas} unidades de porte reduzido representam {fmtPct(escPequenas)}% da rede, evidenciando o predomínio de escolas pequenas.
          </p>
          <p className="text-gray-800 text-left text-base sm:text-lg leading-relaxed max-w-4xl mx-auto" >
            Em contraste, apenas {esc51a100} escolas ({fmtPct(esc51a100)}%) atendem entre 51 e 100 alunos, e outras {escMais100} ({fmtPct(escMais100)}%) possuem mais de 100 alunos, indicando que poucas unidades concentram grandes contingentes estudantis.
          </p>
        </div>
      </div>

      {/* Primeiro gráfico - Distribuição Geral (Pizza) */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-medium text-gray-500 uppercase tracking-wide mb-6 text-center">Gráfico 4: Visão Geral da Distribuição</h3>
        
          <div className="h-96 w-full" style={{ minWidth: '300px', minHeight: '384px', width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={384}>
              <PieChart>
                <Pie isAnimationActive={false} data={dataWithTotal}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomLabel}
                  outerRadius={120}
                  fill="#FF805A"
                  dataKey="value"
                >
                    {dataWithTotal.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        
      </div>

      {/* Texto adicional */}
      <div className="mb-6 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-800 text-left mb-4 text-base sm:text-lg leading-relaxed max-w-4xl mx-auto" >
            Entre as escolas de maior porte estão a EEI Guarani Gwyra Pepo, com 296 alunos, e a EEI Djekupe Amba Arandy, com 249 alunos. Ambas ficam na capital de São Paulo. Já a EEI Txeru Ba'e Kua-i, no litoral de São Paulo, na cidade de Bertioga, atende 111 alunos.
          </p>
          <p className="text-gray-800 text-left text-base sm:text-lg leading-relaxed max-w-4xl mx-auto" >
            No extremo oposto, algumas escolas atendem menos de 10 alunos, como a Aldeia Uru'ity, com 4 estudantes, e a Aldeia Santa Cruz, com apenas 3.
          </p>
        </div>
      </div>

      {/* Segundo gráfico - Detalhamento por Escola (Barras) */}
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-medium text-gray-500 uppercase tracking-wide mb-6 text-center">Gráfico 5: Detalhamento por Escola Indígena</h3>

        
          <div className="h-96 w-full" style={{ minWidth: '300px', minHeight: '384px', width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={384}>
              <BarChart
                data={normalizedAlunosData}
                margin={{
                  top: 20,
                  right: 10,
                  left: 10,
                  bottom: 80,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="nome" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                  tick={{ fontSize: 12, fill: '#374151' }}
                />
                <YAxis 
                  label={{ value: 'Número de Alunos', angle: -90, position: 'insideLeft', style: { fontSize: '0.875rem', fill: '#374151' } }}
                  tick={{ fontSize: 12, fill: '#374151' }}
                />
                <Tooltip content={<BarTooltip />} />
                <Bar isAnimationActive={false} dataKey="alunos">
                  {normalizedAlunosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        
      </div>

      {/* Fonte */}
      <p className="mt-6 text-xs text-gray-400 text-center uppercase tracking-wider">
        Fonte: Héric Moura LINDI(UNIFESP), a partir de dados da SEDUC 2026
      </p>
    </div>
  );
};

export default DistribuicaoEscolasCombinadoChart;