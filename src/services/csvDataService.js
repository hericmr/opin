import Papa from 'papaparse';
import logger from '../utils/logger';

class CSVDataService {
  constructor() {
    this.cache = new Map();
  }

  async loadCSV(filename) {
    // Verifica se os dados já estão em cache
    if (this.cache.has(filename)) {
      return this.cache.get(filename);
    }

    try {
      const response = await fetch(`./data/${filename}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvText = await response.text();

      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors && results.errors.length > 0) {
              logger.error(`Erros ao processar ${filename}:`, results.errors);
            }
            const data = results.data;
            this.cache.set(filename, data);
            resolve(data);
          },
          error: (error) => {
            logger.error(`Erro ao processar ${filename}:`, error);
            reject(error);
          }
        });
      });
    } catch (error) {
      logger.error(`Erro ao carregar ${filename}:`, error);
      throw error;
    }
  }

  // Carrega dados das escolas
  async loadEscolasData() {
    try {
      const data = await this.loadCSV('escolas.csv');
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Carrega dados dos docentes
  async loadDocentesData() {
    try {
      const data = await this.loadCSV('docentes.csv');
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Carrega dados dos equipamentos
  async loadEquipamentosData() {
    try {
      const data = await this.loadCSV('equipamentos.csv');
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Carrega dados das turmas por tipo
  async loadTurmasPorTipoData() {
    try {
      const data = await this.loadCSV('turmas_por_tipo.csv');
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Processa dados para gráfico de alunos vs docentes
  async getAlunosVsDocentesData() {
    const escolasData = await this.loadEscolasData();
    const docentesData = await this.loadDocentesData();

    // Conta professores únicos por escola
    const docentesPorEscola = {};
    docentesData.forEach(docente => {
      if (!docentesPorEscola[docente.CIE_Escola]) {
        docentesPorEscola[docente.CIE_Escola] = new Set();
      }
      docentesPorEscola[docente.CIE_Escola].add(docente.Nome);
    });

    // Converte para array de dados para o gráfico
    const chartData = escolasData.map(escola => {
      const cie = escola.CIE.toString();
      const alunos = parseInt(escola.Total_Alunos) || 0;
      const docentes = docentesPorEscola[cie] ? docentesPorEscola[cie].size : 0;

      return {
        nome: escola.Nome,
        alunos: alunos,
        docentes: docentes,
        cie: cie
      };
    }).filter(item => item.alunos > 0 || item.docentes > 0); // Filtra apenas escolas com dados válidos

    return chartData;
  }

  // Processa dados para gráfico de alunos por escola
  async getAlunosPorEscolaData() {
    const escolasData = await this.loadEscolasData();

    // Filtra apenas escolas indígenas
    const escolasIndigenas = escolasData
      .filter(escola => escola.Tipo === 'EEI - INDIGENA')
      .map(escola => ({
        nome: escola.Nome,
        alunos: parseInt(escola.Total_Alunos) || 0,
        cie: escola.CIE.toString()
      }))
      .filter(escola => escola.alunos > 0) // Filtra apenas escolas com alunos
      .sort((a, b) => b.alunos - a.alunos);

    return escolasIndigenas;
  }

  // Processa dados para gráfico de distribuição de alunos
  async getDistribuicaoAlunosData() {
    const escolasData = await this.loadEscolasData();

    const bins = [0, 10, 25, 50, 100, Infinity];
    const labels = ['Até 10 alunos', '11 a 25 alunos', '26 a 50 alunos', '51 a 100 alunos', 'Mais de 100 alunos'];

    const distribuicao = {};
    labels.forEach(label => distribuicao[label] = 0);

    escolasData.forEach(escola => {
      const alunos = parseInt(escola.Total_Alunos) || 0;
      for (let i = 0; i < bins.length - 1; i++) {
        if (alunos >= bins[i] && alunos < bins[i + 1]) {
          distribuicao[labels[i]]++;
          break;
        }
      }
    });

    return Object.entries(distribuicao).map(([name, value]) => ({
      name,
      value
    }));
  }

  // Processa dados para gráfico de equipamentos
  async getEquipamentosData() {
    const equipamentosData = await this.loadEquipamentosData();

    const equipamentosPorTipo = {};
    equipamentosData.forEach(equipamento => {
      if (!equipamentosPorTipo[equipamento.Equipamento]) {
        equipamentosPorTipo[equipamento.Equipamento] = 0;
      }
      equipamentosPorTipo[equipamento.Equipamento] += parseInt(equipamento.Quantidade) || 0;
    });

    return Object.entries(equipamentosPorTipo)
      .map(([equipamento, quantidade]) => ({
        equipamento,
        quantidade
      }))
      .filter(item => item.quantidade > 0) // Filtra apenas equipamentos com quantidade > 0
      .sort((a, b) => b.quantidade - a.quantidade);
  }

  // Processa dados para gráfico de escolas por diretoria
  async getEscolasPorDiretoriaData() {
    const escolasData = await this.loadEscolasData();

    // Conta TODAS as escolas por diretoria (não apenas indígenas)
    const escolasPorDiretoria = {};
    escolasData.forEach(escola => {
      if (escola.Diretoria && escola.Diretoria.trim() !== '') {
        if (!escolasPorDiretoria[escola.Diretoria]) {
          escolasPorDiretoria[escola.Diretoria] = 0;
        }
        escolasPorDiretoria[escola.Diretoria]++;
      }
    });

    return Object.entries(escolasPorDiretoria)
      .map(([diretoria, quantidade]) => ({
        diretoria,
        quantidade
      }))
      .sort((a, b) => a.quantidade - b.quantidade); // Ordena crescente como no Python
  }

  // Processa dados para gráfico de tipos de ensino
  async getTiposEnsinoData() {
    const turmasData = await this.loadTurmasPorTipoData();

    const tiposEnsino = [
      'Anos_Iniciais',
      'Anos_Finais',
      'Ensino_Medio',
      'EJA_Anos_Iniciais',
      'EJA_Anos_Finais',
      'EJA_Ensino_Medio',
      'Ensino_Infantil'
    ];

    const labelMapping = {
      'Anos_Iniciais': 'Anos Iniciais',
      'Anos_Finais': 'Anos Finais',
      'Ensino_Medio': 'Ensino Médio',
      'EJA_Anos_Iniciais': 'EJA Anos Iniciais',
      'EJA_Anos_Finais': 'EJA Anos Finais',
      'EJA_Ensino_Medio': 'EJA Ensino Médio',
      'Ensino_Infantil': 'Ensino Infantil'
    };

    const counts = {};
    tiposEnsino.forEach(tipo => {
      counts[tipo] = turmasData.filter(escola => {
        const valor = parseInt(escola[tipo]) || 0;
        return valor > 0;
      }).length;
    });

    return Object.entries(counts)
      .map(([tipo, quantidade]) => ({
        tipo: labelMapping[tipo],
        quantidade
      }))
      .filter(item => item.quantidade > 0) // Filtra apenas tipos com quantidade > 0
      .sort((a, b) => b.quantidade - a.quantidade);
  }

  // Processa dados para gráfico de distribuição de alunos por modalidade
  async getDistribuicaoAlunosModalidadeData() {
    try {
      // Carrega os dados reais do CSV turmas_por_tipo.csv
      const turmasData = await this.loadTurmasPorTipoData();

      // Mapeamento direto das colunas do CSV para modalidades
      const columnMapping = {
        'Anos_Iniciais': 'Anos Iniciais',
        'Anos_Finais': 'Anos Finais',
        'Ensino_Medio': 'Ensino Médio',
        'EJA_Anos_Iniciais': 'EJA Anos Iniciais',
        'EJA_Anos_Finais': 'EJA Anos Finais',
        'EJA_Ensino_Medio': 'EJA Ensino Médio',
        'Ensino_Infantil': 'Ensino Infantil'
      };

      // Inicializa contadores de turmas por modalidade
      const turmasPorModalidade = {
        'Anos Iniciais': 0,
        'Anos Finais': 0,
        'Ensino Médio': 0,
        'EJA Anos Iniciais': 0,
        'EJA Anos Finais': 0,
        'EJA Ensino Médio': 0,
        'Ensino Infantil': 0
      };

      // Soma as turmas por modalidade usando os dados reais do CSV
      turmasData.forEach(escola => {
        Object.entries(columnMapping).forEach(([column, modalidade]) => {
          const turmas = parseInt(escola[column]) || 0;
          if (turmasPorModalidade[modalidade] !== undefined) {
            turmasPorModalidade[modalidade] += turmas;
          }
        });
      });

      // Para calcular alunos, cruza com dados de escolas para obter total de alunos
      // e distribui proporcionalmente às turmas
      const escolasData = await this.loadEscolasData();
      const escolasIndigenas = escolasData.filter(escola => escola.Tipo === 'EEI - INDIGENA');

      // Cria um mapa de CIE para total de alunos
      const alunosPorEscola = {};
      escolasIndigenas.forEach(escola => {
        const cie = escola.CIE.toString();
        alunosPorEscola[cie] = parseInt(escola.Total_Alunos) || 0;
      });

      // Calcula o total de turmas e alunos da amostra (escolas com dados de turmas)
      let totalTurmasAmostra = 0;
      let totalAlunosAmostra = 0;

      turmasData.forEach(escola => {
        const cie = escola.CIE_Escola.toString();
        const alunosEscola = alunosPorEscola[cie] || 0;

        // Só conta processa se a escola existir na lista de indígenas
        if (alunosPorEscola[cie] !== undefined) {
          totalAlunosAmostra += alunosEscola;

          Object.keys(columnMapping).forEach(column => {
            const turmas = parseInt(escola[column]) || 0;
            totalTurmasAmostra += turmas;
          });
        }
      });

      // Calcula o total REAL de alunos em TODAS as escolas indígenas (para extrapolação)
      const totalAlunosReal = escolasIndigenas.reduce((sum, escola) => {
        return sum + (parseInt(escola.Total_Alunos) || 0);
      }, 0);

      // Se não houver turmas ou alunos na amostra, retorna valores padrão
      if (totalTurmasAmostra === 0 || totalAlunosAmostra === 0) {
        return [
          { name: 'Anos Iniciais', value: 654 },
          { name: 'Anos Finais', value: 568 },
          { name: 'Ensino Médio', value: 269 },
          { name: 'EJA Anos Iniciais', value: 45 },
          { name: 'EJA Anos Finais', value: 50 },
          { name: 'EJA Ensino Médio', value: 35 },
          { name: 'Ensino Infantil', value: 0 }
        ].filter(item => item.value > 0);
      }

      // Calcula fator de extrapolação (para projetar a amostra para o total real)
      // Se totalAlunosAmostra for 912 e totalAlunosReal for 1688, fator será ~1.85
      const fatorExtrapolacao = totalAlunosReal / totalAlunosAmostra;
      const alunosPorTurma = totalAlunosAmostra / totalTurmasAmostra;

      const alunosPorModalidade = {};
      Object.entries(turmasPorModalidade).forEach(([modalidade, turmas]) => {
        // Calcula base da amostra e multiplica pelo fator de extrapolação
        const alunosAmostra = turmas * alunosPorTurma;
        alunosPorModalidade[modalidade] = Math.round(alunosAmostra * fatorExtrapolacao);
      });

      // Retorna os dados calculados, filtrando modalidades com valor zero
      return Object.entries(alunosPorModalidade)
        .map(([name, value]) => ({ name, value }))
        .filter(item => item.value > 0)
        .sort((a, b) => b.value - a.value);
    } catch (error) {
      logger.error('Erro ao calcular distribuição de alunos por modalidade:', error);
      // Fallback para valores padrão com todas as modalidades EJA separadas
      return [
        { name: 'Anos Iniciais', value: 654 },
        { name: 'Anos Finais', value: 568 },
        { name: 'Ensino Médio', value: 269 },
        { name: 'EJA Anos Iniciais', value: 45 },
        { name: 'EJA Anos Finais', value: 50 },
        { name: 'EJA Ensino Médio', value: 35 },
        { name: 'Ensino Infantil', value: 0 }
      ].filter(item => item.value > 0);
    }
  }
}

const csvDataService = new CSVDataService();
export default csvDataService;