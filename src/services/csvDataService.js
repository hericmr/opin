import Papa from 'papaparse';

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
              console.error(`Erros ao processar ${filename}:`, results.errors);
            }
            const data = results.data;
            this.cache.set(filename, data);
            resolve(data);
          },
          error: (error) => {
            console.error(`Erro ao processar ${filename}:`, error);
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error(`Erro ao carregar ${filename}:`, error);
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
      'EJA_Anos_Iniciais',
      'EJA_Anos_Finais',
      'EJA_Ensino_Medio',
      'Ensino_Infantil'
    ];

    const labelMapping = {
      'Anos_Iniciais': 'Anos Iniciais',
      'Anos_Finais': 'Anos Finais',
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
    // Dados específicos fornecidos pelo usuário
    const dadosModalidade = [
      { name: 'Anos Iniciais', value: 654 },
      { name: 'Anos Finais', value: 568 },
      { name: 'Ensino Médio', value: 269 },
      { name: 'EJA', value: 130 }
    ];

    return dadosModalidade;
  }
}

const csvDataService = new CSVDataService();
export default csvDataService;