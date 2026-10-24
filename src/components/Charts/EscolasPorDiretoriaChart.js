import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-gray-300 rounded shadow-lg" style={{
        fontFamily: '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <p className="font-semibold mb-1 text-base sm:text-lg leading-relaxed max-w-4xl mx-auto" >{data.diretoria}</p>
        <p className="text-sm text-gray-600 leading-relaxed">Escolas: {data.quantidade}</p>
      </div>
    );
  }
  return null;
};

const EscolasPorDiretoriaChart = ({ data }) => {
  // Se não há dados, mostra mensagem
  if (!data || data.length === 0) {
    return (
      <div className="p-6">
        <h3 className="text-lg sm:text-xl font-medium text-gray-500 uppercase tracking-wide mb-6 text-center">
          Gráfico 7: Número de Escolas por Diretoria de Ensino
        </h3>
        <div className="h-96 flex items-center justify-center">
          <p className="text-gray-500">Nenhum dado disponível</p>
        </div>
        <p className="mt-6 text-xs text-gray-400 text-center uppercase tracking-wider">
          Fonte: SEDUC 2026
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      
      <h3 className="text-lg sm:text-xl font-medium text-gray-500 uppercase tracking-wide mb-6 text-center">
        Gráfico 7: Número de Escolas por Diretoria de Ensino
      </h3>
      <div className="h-96" style={{ minWidth: '300px', minHeight: '384px', width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={384}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 80,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="diretoria"
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
            <Bar isAnimationActive={false} dataKey="quantidade">
              {data.map((entry, index) => {
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

export default EscolasPorDiretoriaChart;