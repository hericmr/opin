import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const jogosPath = path.join(__dirname, '../public/jogos_arquivos/todos_os_jogos.json');
  const professoresPath = path.join(__dirname, '../src/data/professores.json');

  const jogos = JSON.parse(fs.readFileSync(jogosPath, 'utf8'));
  const professores = JSON.parse(fs.readFileSync(professoresPath, 'utf8'));

  // Fetch escolas
  const response = await fetch('https://opin.unifesp.br/opin/rest/v1/escolas_completa?select=id,Escola,"Terra%20Indigena%20(TI)"');
  const escolas = await response.json();

  const normalizar = (str) => {
    if (!str) return '';
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
  };

  const acharEscolaPorNomeOuTI = (aldeiaStr) => {
    if (!aldeiaStr) return null;
    const normAldeia = normalizar(aldeiaStr);
    
    // Exact or contains match on Escola
    for (const esc of escolas) {
      if (normalizar(esc.Escola).includes(normAldeia) || normAldeia.includes(normalizar(esc.Escola))) return esc;
    }
    // Exact or contains match on TI
    for (const esc of escolas) {
      if (esc['Terra Indigena (TI)'] && (normalizar(esc['Terra Indigena (TI)']).includes(normAldeia) || normAldeia.includes(normalizar(esc['Terra Indigena (TI)'])))) return esc;
    }
    
    // Try word intersection
    let maxIntersection = 0;
    let bestMatch = null;
    const aldeiaWords = normalizar(aldeiaStr).replace(/aldeia|terra|indigena/g, '').split('').filter(x=>x.length>3);
    
    return null; // keep simple
  };

  console.log('-- SQL gerado para inserir os jogos nas escolas correspondentes');
  console.log('BEGIN;');

  for (const jogo of jogos) {
    const autores = jogo.titulo_autores_cabecalho.join(' ');
    let matchProfessor = null;

    // Achar professor cujo nome esteja em 'autores'
    for (const prof of professores) {
      if (prof.nome) {
        // Tenta achar nomes/sobrenomes
        const parts = prof.nome.split(' ').filter(p => p.length > 2);
        let matchCount = 0;
        for (const p of parts) {
          if (normalizar(autores).includes(normalizar(p))) {
            matchCount++;
          }
        }
        // Se bateu mais da metade dos nomes, é ele
        if (matchCount >= parts.length - 1 && parts.length > 1) {
          matchProfessor = prof;
          break;
        }
      }
    }

    if (matchProfessor) {
      const termoBusca = matchProfessor.aldeia || matchProfessor.terra_indigena || matchProfessor.povo;
      const escolaMatch = acharEscolaPorNomeOuTI(matchProfessor.aldeia) || acharEscolaPorNomeOuTI(matchProfessor.terra_indigena);
      
      if (escolaMatch) {
        console.log(`-- Jogo: ${jogo.title_primary} | Autor: ${matchProfessor.nome} | Aldeia/TI: ${termoBusca} -> Escola: ${escolaMatch.Escola} (ID: ${escolaMatch.id})`);
        console.log(`INSERT INTO public.escola_jogos (escola_id, jogo_global_id) VALUES (${escolaMatch.id}, '${jogo.global_id}') ON CONFLICT DO NOTHING;`);
      } else {
        console.log(`-- [NÃO ENCONTRADA] Escola não encontrada para Jogo: ${jogo.title_primary} | Autor: ${matchProfessor.nome} | Aldeia: ${termoBusca}`);
      }
    } else {
      console.log(`-- [SEM AUTOR] Professor não encontrado para o jogo: ${jogo.title_primary}`);
    }
  }

  console.log('COMMIT;');
}

run();
