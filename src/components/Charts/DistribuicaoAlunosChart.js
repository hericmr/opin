import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
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

const DistribuicaoAlunosChart = ({ data }) => {
  const NATURAL_GREEN_COLORS = ['#FF805A', '#234B73', '#FFA000', '#783CA0', '#14512D', '#4C1D95', '#2C5530', '#0EA5E9', '#F43F5E', '#10B981'];

  // Calcula o total para percentuais
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map(item => ({ ...item, total }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      
      <h3 className="text-2xl sm:text-3xl font-bold mb-8 pb-4 border-b border-gray-100 text-gray-900">
        Distribuição de Escolas por Número de Alunos
      </h3>
      <div className="h-96" style={{ minWidth: '300px', minHeight: '384px', width: '100%', height: '100%' }}>
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
                <Cell key={`cell-${index}`} fill={NATURAL_GREEN_COLORS[index % NATURAL_GREEN_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-6 text-xs text-gray-400 text-center uppercase tracking-wider">
        Fonte: Héric Moura LINDI(UNIFESP), a partir de dados da SEDUC 2026
      </p>
    </div>
  );
};

export default DistribuicaoAlunosChart;