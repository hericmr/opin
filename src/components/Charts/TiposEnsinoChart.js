import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TiposEnsinoChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 rounded shadow-lg" style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}>
          <p className="font-semibold mb-1" style={{ fontSize: '1rem', lineHeight: '1.5', color: '#111827' }}>{data.tipo}</p>
          <p style={{ fontSize: '0.9375rem', lineHeight: '1.5', color: '#374151' }}>Escolas: {data.quantidade}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6">
      
      <h3 className="font-bold mb-6 text-gray-800 text-center" style={{
        fontSize: '1.5rem',
        lineHeight: '1.75',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        letterSpacing: '-0.01em'
      }}>
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
              tick={{ fontSize: 12, fill: '#374151' }}
            />
            <YAxis 
              label={{ value: 'Número de Escolas', angle: -90, position: 'insideLeft', style: { fontSize: '0.875rem', fill: '#374151' } }}
              tick={{ fontSize: 12, fill: '#374151' }}
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

export default TiposEnsinoChart;