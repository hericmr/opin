import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const DistribuicaoEscolasCombinadoChart = ({ distribuicaoData, alunosPorEscolaData }) => {
  const NATURAL_GREEN_COLORS = ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#365314', '#3f6212', '#4ade80'];

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
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm">Escolas: {data.value}</p>
          <p className="text-sm">Percentual: {((data.value / data.total) * 100).toFixed(1)}%</p>
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
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{data.nome}</p>
          <p className="text-sm text-gray-600">CIE: {data.cie}</p>
          <p className="text-sm">Alunos: {data.alunos}</p>
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
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Título principal */}
      <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Distribuição de Escolas por Número de Alunos
      </h3>

      {/* Primeiro gráfico - Distribuição Geral (Pizza) */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-4 text-gray-700 text-center">
          Visão Geral da Distribuição
        </h4>
        
        {/* Texto introdutório antes do gráfico */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 leading-relaxed">
            As EEIs, em sua grande parte, funcionam com turmas de número reduzido a moderado, o que garante um cuidado individualizado e um acompanhamento pedagógico mais próximo dos estudantes. Dez escolas (24,4%) possuem até 10 alunos, 11 escolas (26,8%) atendem entre 11 e 25 alunos, e 12 escolas (29,3%) concentram de 26 a 50 alunos. Juntas, essas pequenas unidades representam 80,5% da rede, evidenciando o predomínio de escolas de porte reduzido. Em contraste, apenas quatro escolas (9,8%) atendem entre 51 e 100 alunos, e outras quatro (9,8%) possuem mais de 100 alunos, indicando que poucas unidades concentram grandes contingentes estudantis.
          </p>
        </div>
        <div className="h-96">
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
                  <Cell key={`cell-${index}`} fill={NATURAL_GREEN_COLORS[index % NATURAL_GREEN_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Segundo gráfico - Detalhamento por Escola (Barras) */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-700 text-center">
          Detalhamento por Escola Indígena
        </h4>
        
        {/* Texto introdutório */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 leading-relaxed">
            Entre as escolas de maior porte, destacam-se a Indígena Guarani Gwyra Pepo, com 296 alunos, a E.E.I. Djekupe Amba Arandy, com 249 alunos, a E.E.I. Txeru Ba'e Kua-i, com 111 alunos, e a CECI Krukutu, com 101 alunos. No extremo oposto, algumas escolas atendem menos de 10 alunos, como a Aldeia Uru'ity, com 4 estudantes, e a Aldeia Santa Cruz, com apenas 3. Essa distribuição evidencia a grande heterogeneidade no tamanho das turmas, o que impacta diretamente a gestão, a oferta de recursos e a qualidade do ensino.
          </p>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={normalizedAlunosData}
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
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="alunos" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fonte */}
      <p className="text-sm text-gray-500 mt-4 text-center">
        Fonte: Héric Moura LINDI(UNIFESP), a partir de dados da SEDUC 2025
      </p>
    </div>
  );
};

export default DistribuicaoEscolasCombinadoChart;