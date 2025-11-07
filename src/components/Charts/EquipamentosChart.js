import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ScrollAnimatedWrapper from '../ScrollAnimatedWrapper';

const EquipamentosChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{data.equipamento}</p>
          <p className="text-sm">Quantidade: {data.quantidade}</p>
        </div>
      );
    }
    return null;
  };

  // Se não há dados, mostra mensagem
  if (!data || data.length === 0) {
    return (
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Distribuição de Equipamentos nas Escolas
        </h3>
        <div className="h-96 flex items-center justify-center">
          <p className="text-gray-600">Nenhum dado disponível</p>
        </div>
        <p className="text-sm text-gray-600 mt-2 text-center">
          Fonte: SEDUC 2025
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Texto sobre infraestrutura tecnológica */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 sm:mb-4 text-gray-800 text-center">
          Infraestrutura Tecnológica
        </h4>
        
        <div className="p-3 sm:p-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-800 leading-loose text-sm sm:text-base text-left mb-4">
              A infraestrutura tecnológica das escolas estaduais indígenas evidencia desigualdades significativas no acesso a equipamentos e conectividade. O recurso mais presente é o tablet para alunos, disponível em 653 unidades, seguido por computadores portáteis (110) e computadores destinados aos alunos (98).
            </p>
            <p className="text-gray-800 leading-loose text-sm sm:text-base text-left mb-4">
              Outros recursos, como aparelhos de TV (57), computadores para uso administrativo (56), aparelhos de Wi-Fi/access points (33) e rede local (18), estão presentes em proporções muito inferiores.
            </p>
            <p className="text-gray-800 leading-loose text-sm sm:text-base text-left mb-4">
              O acesso à internet é muito restrito. Para uso pedagógico e administrativo, está disponível em apenas 22 escolas. Para uso pelos alunos, são apenas 19 escolas. Isso mostra que a maior parte das escolas ainda não dispõe de conectividade adequada para práticas digitais.
            </p>
            <p className="text-gray-800 leading-loose text-sm sm:text-base text-left">
              Embora a tecnologia esteja presente em diversas escolas, seu uso pedagógico efetivo continua limitado. Essa limitação compromete a qualidade do ensino e dificulta a inclusão digital de professores e estudantes.
            </p>
          </div>
        </div>
      </div>
      
      <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 text-center">
        Distribuição de Equipamentos nas Escolas
      </h3>
      <ScrollAnimatedWrapper animationType="fadeInUp" delay={0.2}>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 10,
                left: 10,
                bottom: 80,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="equipamento"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                label={{ value: 'Quantidade Total', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="quantidade">
                {data.map((entry, index) => {
                  const colors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7', '#14b8a6', '#ec4899', '#6366f1'];
                  return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ScrollAnimatedWrapper>
      <p className="text-sm text-gray-600 mt-2 text-center">
        Fonte: Héric Moura LINDI(UNIFESP), a partir de dados da SEDUC 2025
      </p>
    </div>
  );
};

export default EquipamentosChart;