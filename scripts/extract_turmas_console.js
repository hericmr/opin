// Copie e cole este código no console do navegador na página que contém a tabela de turmas (ex: Consulta de Escolas da SEDUC)

function extractData() {
    // Encontra a tabela. O seletor pode precisar de ajuste dependendo da página específica.
    // Tentativa 1: Procurar por uma tabela que tenha 'Total de Turmas' em algum lugar ou estrutura conhecida
    const tables = document.querySelectorAll('table');
    let targetTable = null;

    // Estratégia: Encontrar a tabela que tem cabeçalhos compatíveis com o que esperamos
    for (const table of tables) {
        const headers = Array.from(table.querySelectorAll('th')).map(th => th.innerText.trim());
        if (headers.some(h => h.includes('Anos Iniciais') || h.includes('Ensino Médio') || h.includes('EJA'))) {
            targetTable = table;
            break;
        }
    }

    if (!targetTable) {
        console.error("Tabela alvo não encontrada! Verifique o seletor.");
        return;
    }

    const rows = Array.from(targetTable.querySelectorAll('tr'));

    // Assumindo que a primeira linha com THs é o cabeçalho
    const headerRow = rows.find(row => row.querySelector('th'));
    if (!headerRow) {
        console.error("Linha de cabeçalho não encontrada.");
        return;
    }

    const headers = Array.from(headerRow.querySelectorAll('th')).map(th => th.innerText.trim());

    // Mapeamento dos índices
    const headerMap = {};
    headers.forEach((h, index) => {
        headerMap[h] = index;
    });

    console.log("Cabeçalhos detectados:", headers);

    const dataRows = rows.filter(row => row.querySelector('td')); // Apenas linhas com dados
    const results = [];

    dataRows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('td')).map(td => td.innerText.trim());

        // Função auxiliar para pegar valor seguro
        const getVal = (key) => {
            // Procura por correspondência parcial ou exata no cabeçalho
            const headerKey = Object.keys(headerMap).find(k => k.includes(key));
            if (headerKey && cells[headerMap[headerKey]] !== undefined) {
                return cells[headerMap[headerKey]];
            }
            return '0';
        };

        // Identificadores da escola (Assumindo que existem e estão na mesma tabela ou contexto)
        // Se a tabela for apenas de "Totais", talvez precisemos de lógica para pegar o CIE da linha anterior ou similar.
        // ADAPTAÇÃO: O código original provavelmente iterava sobre VÁRIAS páginas de escolas.
        // Se este script for para rodar EM UMA LISTA, a lógica muda.
        // Assumindo estrutura: Cada linha é uma escola? Ou é uma tabela DETALHE de uma escola?

        // Pelo CSV original (CIE, Anos_Iniciais...), parece que cada linha tem um CIE.
        // Se a tabela da tela tem o CIE, podemos pegar. Se não, precisamos adaptar.

        // TENTATIVA GENÉRICA BASEADA NA SOLUÇÃO PROPOSTA:
        // Criar objeto com as chaves normalizadas

        const rowData = {
            'CIE_Escola': getVal('CIE') || getVal('Código') || '0', // Tenta achar coluna de ID
            // Se não tiver coluna CIE na tabela de totais, talvez precise pegar de outro lugar.
            // Para simplificar a solução pedida: Focar na extração dos totais.

            'Anos_Iniciais': getVal('Anos Iniciais'),
            'Anos_Finais': getVal('Anos Finais'),
            'Ensino_Medio': getVal('Ensino Médio'),
            'EJA_Anos_Iniciais': getVal('EJA - Anos Iniciais'),
            'EJA_Anos_Finais': getVal('EJA - Anos Finais'),
            'EJA_Ensino_Medio': getVal('EJA - Ensino Médio'),
            'Ensino_Infantil': getVal('Infantil') || getVal('Ensino Infantil')
        };

        results.push(rowData);
    });

    // Converter para CSV
    const csvHeaders = ['CIE_Escola', 'Anos_Iniciais', 'Anos_Finais', 'Ensino_Medio', 'EJA_Anos_Iniciais', 'EJA_Anos_Finais', 'EJA_Ensino_Medio', 'Ensino_Infantil'];
    let csvContent = csvHeaders.join(',') + '\n';

    results.forEach(row => {
        const line = csvHeaders.map(header => {
            const val = row[header] || '0';
            return `"${val}"`;
        }).join(',');
        csvContent += line + '\n';
    });

    console.log("CSV Gerado:\n");
    console.log(csvContent);

    // Download automático (opcional)
    // const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    // const url = URL.createObjectURL(blob);
    // const link = document.createElement("a");
    // link.setAttribute("href", url);
    // link.setAttribute("download", "turmas_por_tipo_corrigido.csv");
    // document.body.appendChild(link);
    // link.click();
}

extractData();
