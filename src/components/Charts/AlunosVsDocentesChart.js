import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AlunosVsDocentesChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{data.nome}</p>
          <p className="text-sm text-gray-600">CIE: {data.cie}</p>
          <p className="text-sm">Alunos: {data.alunos}</p>
          <p className="text-sm">Docentes: {data.docentes}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        Relação entre Número de Alunos e Docentes por Escola
      </h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="alunos" 
              name="Alunos"
              label={{ value: 'Número Total de Alunos', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              type="number" 
              dataKey="docentes" 
              name="Docentes"
              label={{ value: 'Número Total de Docentes', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={data} fill="#10b981" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-gray-500 mt-2 text-center">
        Fonte: SEDUC 2025
      </p>
    </div>
  );
};

export default AlunosVsDocentesChart;