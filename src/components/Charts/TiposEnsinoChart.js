import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TiposEnsinoChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{data.tipo}</p>
          <p className="text-sm">Escolas: {data.quantidade}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6">
      
      <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
        Número de Escolas por Tipo de Ensino Oferecido
      </h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="tipo" 
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
            />
            <YAxis 
              label={{ value: 'Número de Escolas', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="quantidade">
              {data.map((entry, index) => {
                const colors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7', '#14b8a6'];
                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-gray-600 mt-2 text-center">
        Fonte: Héric Moura LINDI(UNIFESP), a partir de dados da SEDUC 2025
      </p>
    </div>
  );
};

export default TiposEnsinoChart;