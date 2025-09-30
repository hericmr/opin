import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import ScrollAnimatedWrapper from '../ScrollAnimatedWrapper';

const DistribuicaoAlunosModalidadeChart = ({ data }) => {
  // Cores específicas para cada modalidade
  const MODALIDADE_COLORS = {
    'Anos Iniciais': '#1B5E20',    // Verde escuro
    'Anos Finais': '#1565C0',       // Azul escuro
    'Ensino Médio': '#00695C',      // Verde esmeralda escuro
    'EJA': '#2E7D32'                // Verde médio
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">Alunos: {data.value.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Percentual: {data.percentual}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">Alunos: {data.value.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Percentual: {data.percentual}%</p>
        </div>
      );
    }
    return null;
  };

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

  // Calcula o total para percentuais
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentual = data.map(item => ({ 
    ...item, 
    percentual: ((item.value / total) * 100).toFixed(1)
  }));

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        Distribuição de Alunos por Modalidade de Ensino
      </h3>
      
      {/* Texto introdutório */}
      <div className="mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
          Existem 42 Escolas Estaduais Indígenas no estado de São Paulo, distribuídas entre a capital, o interior e o litoral, atendendo 1.621 estudantes. Essas escolas oferecem os anos iniciais e finais do Ensino Fundamental, o Ensino Médio e a Educação de Jovens e Adultos (EJA). A maior parte das matrículas está no Ensino Fundamental, que reúne 75,3% dos alunos. Os anos iniciais concentram 654 estudantes (40,3%), seguidos pelos anos finais, com 568 alunos (35,0%). O Ensino Médio responde por 269 matrículas (16,6%), enquanto a EJA conta com 130 estudantes (8,0%).
        </p>
      </div>
      
      {/* Informações gerais */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">
            Total de Alunos: <span className="text-green-700">{total.toLocaleString()}</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Escolas Indígenas do Estado de São Paulo
          </p>
        </div>
      </div>

      {/* Grid de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Gráfico de Barras */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-700 text-center">
            Distribuição por Quantidade
          </h4>
          <ScrollAnimatedWrapper animationType="fadeInLeft" delay={0.2}>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dataWithPercentual}
                  margin={{
                    top: 20,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Número de Alunos', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    radius={[4, 4, 0, 0]}
                  >
                    {dataWithPercentual.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={MODALIDADE_COLORS[entry.name]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ScrollAnimatedWrapper>
        </div>

        {/* Gráfico de Pizza */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-700 text-center">
            Distribuição Percentual
          </h4>
          <ScrollAnimatedWrapper animationType="fadeInRight" delay={0.4}>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataWithPercentual}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={CustomLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dataWithPercentual.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={MODALIDADE_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ScrollAnimatedWrapper>
        </div>
      </div>

      {/* Estatísticas detalhadas */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dataWithPercentual.map((item, index) => (
          <div key={index} className="text-center p-2 rounded-lg border" style={{ 
            borderColor: MODALIDADE_COLORS[item.name]
          }}>
            <div 
              className="w-4 h-4 rounded-full mx-auto mb-2" 
              style={{ backgroundColor: MODALIDADE_COLORS[item.name] }}
            ></div>
            <p className="font-semibold text-sm text-gray-800">{item.name}</p>
            <p className="text-lg font-bold text-gray-800">
              {item.value.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">{item.percentual}%</p>
          </div>
        ))}
      </div>


      <p className="text-sm text-gray-500 mt-4 text-center">
        Fonte: Héric Moura LINDI(UNIFESP), a partir de dados da SEDUC 2025
      </p>
    </div>
  );
};

export default DistribuicaoAlunosModalidadeChart;