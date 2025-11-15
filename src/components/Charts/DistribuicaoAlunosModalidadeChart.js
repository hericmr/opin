import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import ScrollAnimatedWrapper from '../ScrollAnimatedWrapper';

const DistribuicaoAlunosModalidadeChart = ({ data }) => {
  // Paleta de cores harmoniosa e variada para todas as modalidades
  const MODALIDADE_COLORS = {
    'Anos Iniciais': '#0ea5e9',        // Azul Sky
    'Anos Finais': '#8b5cf6',          // Roxo Violeta
    'Ensino Médio': '#10b981',         // Verde Esmeralda
    'EJA': '#f59e0b',                  // Âmbar/Laranja
    'EJA Anos Iniciais': '#ef4444',    // Vermelho
    'EJA Anos Finais': '#06b6d4',      // Ciano
    'EJA Ensino Médio': '#a855f7',     // Roxo
    'Ensino Infantil': '#14b8a6'       // Turquesa
  };

  // Função para obter cor da modalidade, com fallback para paleta padrão
  const getColorForModalidade = (name, index = 0) => {
    if (MODALIDADE_COLORS[name]) {
      return MODALIDADE_COLORS[name];
    }
    // Fallback para cores variadas se houver modalidades não mapeadas
    const fallbackColors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7', '#14b8a6', '#ec4899', '#6366f1'];
    return fallbackColors[index % fallbackColors.length];
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg" style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}>
          <p className="font-semibold mb-1" style={{ fontSize: '1rem', lineHeight: '1.5', color: '#111827' }}>{data.name}</p>
          <p style={{ fontSize: '0.9375rem', lineHeight: '1.5', color: '#374151' }}>Alunos: {data.value.toLocaleString()}</p>
          <p style={{ fontSize: '0.9375rem', lineHeight: '1.5', color: '#374151' }}>Percentual: {data.percentual}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg" style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}>
          <p className="font-semibold mb-1" style={{ fontSize: '1rem', lineHeight: '1.5', color: '#111827' }}>{data.name}</p>
          <p style={{ fontSize: '0.9375rem', lineHeight: '1.5', color: '#374151' }}>Alunos: {data.value.toLocaleString()}</p>
          <p style={{ fontSize: '0.9375rem', lineHeight: '1.5', color: '#374151' }}>Percentual: {data.percentual}%</p>
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
        fill="#1f2937" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="normal"
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

  // Calcula valores para o texto dinâmico
  const anosIniciais = data.find(item => item.name === 'Anos Iniciais')?.value || 0;
  const anosFinais = data.find(item => item.name === 'Anos Finais')?.value || 0;
  const ensinoMedio = data.find(item => item.name === 'Ensino Médio')?.value || 0;
  const ejaAnosIniciais = data.find(item => item.name === 'EJA Anos Iniciais')?.value || 0;
  const ejaAnosFinais = data.find(item => item.name === 'EJA Anos Finais')?.value || 0;
  const ejaEnsinoMedio = data.find(item => item.name === 'EJA Ensino Médio')?.value || 0;
  
  const totalEJA = ejaAnosIniciais + ejaAnosFinais + ejaEnsinoMedio;
  const totalFundamental = anosIniciais + anosFinais;
  const percentualFundamental = total > 0 ? ((totalFundamental / total) * 100).toFixed(1) : '0.0';
  const percentualAnosIniciais = total > 0 ? ((anosIniciais / total) * 100).toFixed(1) : '0.0';
  const percentualAnosFinais = total > 0 ? ((anosFinais / total) * 100).toFixed(1) : '0.0';
  const percentualEnsinoMedio = total > 0 ? ((ensinoMedio / total) * 100).toFixed(1) : '0.0';
  const percentualEJA = total > 0 ? ((totalEJA / total) * 100).toFixed(1) : '0.0';

  return (
    <div className="p-4 sm:p-6">
      <h3 className="font-bold mb-6 text-gray-800 text-center" style={{
        fontSize: '1.5rem',
        lineHeight: '1.75',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        letterSpacing: '-0.01em'
      }}>
        Distribuição de Alunos por Modalidade de Ensino
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
            Segundo os dados da SEDUC, em 2025, existem 42 escolas estaduais indígenas no estado de São Paulo, distribuídas entre a capital, o interior e o litoral, atendendo {total.toLocaleString()} estudantes. Essas escolas oferecem os anos iniciais e finais do Ensino Fundamental, o Ensino Médio e a Educação de Jovens e Adultos (EJA).
          </p>
          <p className="text-gray-800 text-left" style={{
            fontSize: '1.125rem',
            lineHeight: '1.75',
            color: '#374151',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            letterSpacing: '0.01em'
          }}>
            {totalFundamental > 0 && (
              <>
                A maior parte das matrículas está no Ensino Fundamental, que reúne {percentualFundamental}% dos alunos. Os anos iniciais concentram {anosIniciais.toLocaleString()} estudantes ({percentualAnosIniciais}%), seguidos pelos anos finais, com {anosFinais.toLocaleString()} alunos ({percentualAnosFinais}%).
              </>
            )}
            {ensinoMedio > 0 && (
              <> O Ensino Médio responde por {ensinoMedio.toLocaleString()} matrículas ({percentualEnsinoMedio}%).</>
            )}
            {totalEJA > 0 && (
              <> A EJA conta com {totalEJA.toLocaleString()} estudantes ({percentualEJA}%).</>
            )}
          </p>
        </div>
      </div>
      
      {/* Informações gerais */}
      <div className="mb-6 p-4">
        <div className="text-center">
          <p className="font-semibold text-gray-800" style={{
            fontSize: '1.25rem',
            lineHeight: '1.75',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}>
            Total de Alunos: <span className="text-teal-700">{total.toLocaleString()}</span>
          </p>
          <p className="mt-2" style={{
            fontSize: '0.9375rem',
            lineHeight: '1.5',
            color: '#4b5563',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}>
            Escolas Indígenas do Estado de São Paulo
          </p>
        </div>
      </div>

      {/* Grid de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Gráfico de Barras */}
        <div>
          <h4 className="font-semibold mb-4 text-gray-700 text-center" style={{
            fontSize: '1.125rem',
            lineHeight: '1.75',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}>
            Distribuição por Quantidade
          </h4>
          <ScrollAnimatedWrapper animationType="fadeInLeft" delay={0.2}>
            <div className="h-80 w-full" style={{ minWidth: '300px', minHeight: '320px', width: '100%', height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={320}>
                <BarChart
                  data={dataWithPercentual}
                  margin={{
                    top: 20,
                    right: 10,
                    left: 10,
                    bottom: 100,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: '#374151' }}
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    interval={0}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#374151' }}
                    label={{ value: 'Número de Alunos', angle: -90, position: 'insideLeft', style: { fontSize: '0.875rem', fill: '#374151' } }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    radius={[4, 4, 0, 0]}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {dataWithPercentual.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getColorForModalidade(entry.name, index)}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ScrollAnimatedWrapper>
        </div>

        {/* Gráfico de Pizza */}
        <div>
          <h4 className="font-semibold mb-4 text-gray-700 text-center" style={{
            fontSize: '1.125rem',
            lineHeight: '1.75',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}>
            Distribuição Percentual
          </h4>
          <ScrollAnimatedWrapper animationType="fadeInRight" delay={0.4}>
            <div className="h-80 w-full" style={{ minWidth: '300px', minHeight: '320px', width: '100%', height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={320}>
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
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getColorForModalidade(entry.name, index)}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => (
                      <span style={{ color: '#374151' }}>
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
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {dataWithPercentual.map((item, index) => (
          <div key={index} className="text-center p-2">
            <div 
              className="w-4 h-4 rounded-full mx-auto mb-2 border-2 border-white" 
              style={{ backgroundColor: getColorForModalidade(item.name, index) }}
            ></div>
            <p className="font-semibold text-gray-800" style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>{item.name}</p>
            <p className="font-bold text-gray-800" style={{ fontSize: '1rem', lineHeight: '1.5' }}>
              {item.value.toLocaleString()}
            </p>
            <p style={{ fontSize: '0.8125rem', lineHeight: '1.5', color: '#4b5563' }}>{item.percentual}%</p>
          </div>
        ))}
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

export default DistribuicaoAlunosModalidadeChart;