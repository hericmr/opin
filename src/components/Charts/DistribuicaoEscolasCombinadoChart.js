import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import ScrollAnimatedWrapper from '../ScrollAnimatedWrapper';

const DistribuicaoEscolasCombinadoChart = ({ distribuicaoData, alunosPorEscolaData }) => {
  // Paleta de cores variada e harmoniosa
  const CHART_COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7', '#14b8a6', '#ec4899', '#6366f1'];

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

  // Tooltip para o gráfico de pizza
  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 rounded shadow-lg" style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}>
          <p className="font-semibold mb-1" style={{ fontSize: '1rem', lineHeight: '1.5', color: '#111827' }}>{data.name}</p>
          <p style={{ fontSize: '0.9375rem', lineHeight: '1.5', color: '#374151' }}>Escolas: {data.value}</p>
          <p style={{ fontSize: '0.9375rem', lineHeight: '1.5', color: '#374151' }}>Percentual: {((data.value / data.total) * 100).toFixed(1)}%</p>
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
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}>
          <p className="font-semibold mb-1" style={{ fontSize: '1rem', lineHeight: '1.5', color: '#111827' }}>{data.nome}</p>
          <p style={{ fontSize: '0.9375rem', lineHeight: '1.5', color: '#374151' }}>CIE: {data.cie}</p>
          <p style={{ fontSize: '0.9375rem', lineHeight: '1.5', color: '#374151' }}>Alunos: {data.alunos}</p>
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

  // Calcula o total para percentuais do gráfico de pizza
  const total = distribuicaoData.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = distribuicaoData.map(item => ({ ...item, total }));

  return (
    <div className="p-4 sm:p-6">
      {/* Título principal */}
      <h3 className="font-bold mb-6 text-gray-800 text-center" style={{
        fontSize: '1.5rem',
        lineHeight: '1.75',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        letterSpacing: '-0.01em'
      }}>
        Distribuição de Escolas por Número de Alunos
      </h3>

      {/* Texto introdutório */}
      <div className="mb-6 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-800 text-left mb-5" style={{
            fontSize: '1.125rem',
            lineHeight: '1.75',
            color: '#374151',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            letterSpacing: '0.01em'
          }}>
            As EEIs, em sua grande parte, funcionam com turmas de número reduzido a moderado, o que garante um cuidado individualizado e um acompanhamento pedagógico mais próximo dos estudantes.
          </p>
          <p className="text-gray-800 text-left mb-5" style={{
            fontSize: '1.125rem',
            lineHeight: '1.75',
            color: '#374151',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            letterSpacing: '0.01em'
          }}>
            Dez escolas (24,4%) possuem até 10 alunos, 11 escolas (26,8%) atendem entre 11 e 25 alunos, e 12 escolas (29,3%) concentram de 26 a 50 alunos. Juntas, essas pequenas unidades representam 80,5% da rede, evidenciando o predomínio de escolas de porte reduzido.
          </p>
          <p className="text-gray-800 text-left" style={{
            fontSize: '1.125rem',
            lineHeight: '1.75',
            color: '#374151',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            letterSpacing: '0.01em'
          }}>
            Em contraste, apenas quatro escolas (9,8%) atendem entre 51 e 100 alunos, e outras quatro (9,8%) possuem mais de 100 alunos, indicando que poucas unidades concentram grandes contingentes estudantis.
          </p>
        </div>
      </div>

      {/* Primeiro gráfico - Distribuição Geral (Pizza) */}
      <div className="mb-6 sm:mb-8">
        <h4 className="font-semibold mb-4 text-gray-700 text-center" style={{
          fontSize: '1.125rem',
          lineHeight: '1.75',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}>
          Visão Geral da Distribuição
        </h4>
        <ScrollAnimatedWrapper animationType="scaleIn" delay={0.2}>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataWithTotal}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomLabel}
                  outerRadius={120}
                  fill="#8884d8"
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
        </ScrollAnimatedWrapper>
      </div>

      {/* Texto adicional */}
      <div className="mb-6 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-800 text-left mb-4" style={{
            fontSize: '1.125rem',
            lineHeight: '1.75',
            color: '#374151',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            letterSpacing: '0.01em'
          }}>
            Entre as escolas de maior porte estão a EEI Guarani Gwyra Pepo, com 296 alunos, e a EEI Djekupe Amba Arandy, com 249 alunos. Ambas ficam na capital de São Paulo. Já a EEI Txeru Ba'e Kua-i, no litoral de São Paulo, na cidade de Bertioga, atende 111 alunos.
          </p>
          <p className="text-gray-800 text-left" style={{
            fontSize: '1.125rem',
            lineHeight: '1.75',
            color: '#374151',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            letterSpacing: '0.01em'
          }}>
            No extremo oposto, algumas escolas atendem menos de 10 alunos, como a Aldeia Uru'ity, com 4 estudantes, e a Aldeia Santa Cruz, com apenas 3.
          </p>
        </div>
      </div>

      {/* Segundo gráfico - Detalhamento por Escola (Barras) */}
      <div className="mb-6">
        <h4 className="font-semibold mb-4 text-gray-700 text-center" style={{
          fontSize: '1.125rem',
          lineHeight: '1.75',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}>
          Detalhamento por Escola Indígena
        </h4>

        <ScrollAnimatedWrapper animationType="fadeInUp" delay={0.4}>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
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
                <Bar dataKey="alunos">
                  {normalizedAlunosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ScrollAnimatedWrapper>
      </div>

      {/* Fonte */}
      <p className="mt-4 text-center" style={{
        fontSize: '0.9375rem',
        lineHeight: '1.5',
        color: '#4b5563',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        Fonte: Héric Moura LINDI(UNIFESP), a partir de dados da SEDUC 2025
      </p>
    </div>
  );
};

export default DistribuicaoEscolasCombinadoChart;