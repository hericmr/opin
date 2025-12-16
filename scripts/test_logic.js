
// Mock Logger
const logger = { error: console.error };

// Logic extracted from CSVDataService
async function getDistribuicaoAlunosModalidadeData(turmasData, escolasData) {
    try {
        // Mapeamento direto das colunas do CSV para modalidades
        const columnMapping = {
            'Anos_Iniciais': 'Anos Iniciais',
            'Anos_Finais': 'Anos Finais',
            'Ensino_Medio': 'Ensino Médio', // The Fix
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

        console.log('Turmas por Modalidade:', turmasPorModalidade);

        // Para calcular alunos, cruza com dados de escolas para obter total de alunos
        // e distribui proporcionalmente às turmas
        const escolasIndigenas = escolasData.filter(escola => escola.Tipo === 'EEI - INDIGENA');

        // Cria um mapa de CIE para total de alunos
        const alunosPorEscola = {};
        escolasIndigenas.forEach(escola => {
            const cie = escola.CIE.toString();
            alunosPorEscola[cie] = parseInt(escola.Total_Alunos) || 0;
        });

        // Calcula o total de turmas por escola e o total de alunos
        let totalTurmas = 0;
        let totalAlunos = 0;

        turmasData.forEach(escola => {
            const cie = escola.CIE_Escola.toString();
            const alunosEscola = alunosPorEscola[cie] || 0;
            totalAlunos += alunosEscola; // Note: This might sum alunos for schools not in turmasData if we iterated differently, but here it matches logic

            // Correction in reading logic: In the real app, we iterate turmasData.
            // We only sum alunos from schools present in turmasData? 
            // Logic check: The original code iterates turmasData.

            Object.keys(columnMapping).forEach(column => {
                const turmas = parseInt(escola[column]) || 0;
                totalTurmas += turmas;
            });
        });

        console.log('Total Turmas:', totalTurmas);
        console.log('Total Alunos (Matched):', totalAlunos);

        if (totalTurmas === 0 || totalAlunos === 0) {
            return [];
        }

        // Calcula alunos por modalidade proporcionalmente às turmas
        const alunosPorModalidade = {};
        const alunosPorTurma = totalAlunos / totalTurmas;

        Object.entries(turmasPorModalidade).forEach(([modalidade, turmas]) => {
            alunosPorModalidade[modalidade] = Math.round(turmas * alunosPorTurma);
        });

        return Object.entries(alunosPorModalidade)
            .map(([name, value]) => ({ name, value }))
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value);

    } catch (error) {
        console.error(error);
        return [];
    }
}

// Mock Data
const mockTurmasData = [
    { CIE_Escola: '306526', Anos_Iniciais: '2', Anos_Finais: '2', Ensino_Medio: '5', EJA_Anos_Iniciais: '1', EJA_Anos_Finais: '1', EJA_Ensino_Medio: '1', Ensino_Infantil: '1' },
    { CIE_Escola: '434000', Anos_Iniciais: '3', Anos_Finais: '1', Ensino_Medio: '2', EJA_Anos_Iniciais: '0', EJA_Anos_Finais: '0', EJA_Ensino_Medio: '0', Ensino_Infantil: '0' }
];

const mockEscolasData = [
    { CIE: '306526', Tipo: 'EEI - INDIGENA', Total_Alunos: '100' },
    { CIE: '434000', Tipo: 'EEI - INDIGENA', Total_Alunos: '50' }
];
// Total Alunos = 150
// Turmas School 1: 2+2+5+1+1+1+1 = 13
// Turmas School 2: 3+1+2 = 6
// Total Turmas = 19
// Alunos per Turma = 150 / 19 = 7.89
// Ensino Médio Turmas = 5 + 2 = 7
// Ensino Médio Alunos = 7 * 7.89 = 55.23 -> 55

// Logic extracted from getTiposEnsinoData
function getTiposEnsinoData(turmasData) {
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
        .filter(item => item.quantidade > 0)
        .sort((a, b) => b.quantidade - a.quantidade);
}

async function run() {
    const result = await getDistribuicaoAlunosModalidadeData(mockTurmasData, mockEscolasData);
    console.log('Distribuicao Result:', JSON.stringify(result, null, 2));

    const tiposResult = getTiposEnsinoData(mockTurmasData);
    console.log('Tipos Result:', JSON.stringify(tiposResult, null, 2));
}

run();
