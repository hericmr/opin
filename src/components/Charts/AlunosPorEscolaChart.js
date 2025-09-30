import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AlunosPorEscolaChart = ({ data }) => {
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
  const normalizedData = data.map(item => ({
    ...item,
    nome: normalizeSchoolName(item.nome)
  }));

  const CustomTooltip = ({ active, payload }) => {
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        Número de Alunos por Escola Indígena
      </h3>
      
      {/* Texto introdutório */}
      <div className="mb-6 p-4">
        <p className="text-gray-700 leading-relaxed">
          A distribuição de alunos entre as escolas estaduais indígenas apresenta grande variabilidade, refletindo as diferentes realidades demográficas e geográficas das comunidades atendidas. Algumas escolas concentram um número significativo de estudantes, enquanto outras atendem grupos menores, muitas vezes devido à localização em áreas mais isoladas ou ao tamanho reduzido das comunidades indígenas. Essa diversidade evidencia a necessidade de políticas educacionais flexíveis que considerem as especificidades de cada contexto. A maioria das EEIs atende a um pequeno contingente de alunos. Dez escolas (24,4%) possuem até 10 alunos, 11 escolas (26,8%) atendem entre 11 e 25 alunos, e 12 escolas (29,3%) concentram de 26 a 50 alunos. Juntas, essas pequenas unidades representam 80,5% da rede, evidenciando o predomínio de escolas de porte reduzido. Em contraste, apenas quatro escolas (9,8%) atendem entre 51 e 100 alunos, e outras quatro (9,8%) possuem mais de 100 alunos, indicando que poucas unidades concentram grandes contingentes estudantis.
        </p>
        <p className="text-gray-700 leading-relaxed mt-4">
          Entre as escolas de maior porte, destacam-se a Indígena Guarani Gwyra Pepo, com 296 alunos, a E.E.I. Djekupe Amba Arandy, com 249 alunos, a E.E.I. Txeru Ba'e Kua-i, com 111 alunos, e a CECI Krukutu, com 101 alunos. No extremo oposto, algumas escolas atendem menos de 10 alunos, como a Aldeia Uruity, com 4 estudantes, e a Aldeia Santa Cruz, com apenas 3. Essa distribuição evidencia a grande heterogeneidade no tamanho das turmas, o que impacta diretamente a gestão, a oferta de recursos e a qualidade do ensino.
        </p>
      </div>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={normalizedData}
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
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="alunos" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-gray-500 mt-2 text-center">
        Fonte: Héric Moura LINDI(UNIFESP), a partir de dados da SEDUC 2025
      </p>
    </div>
  );
};

export default AlunosPorEscolaChart;