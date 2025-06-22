import React, { memo } from 'react';
import { UsersRound, Star } from 'lucide-react';
import InfoSection from '../InfoSection';
import InfoItem from '../InfoItem';
import BooleanValue from '../BooleanValue';

const GestaoProfessores = memo(({ escola }) => {
  if (!escola) return null;

  // Função para formatar a formação dos professores
  const formatarFormacaoProfessores = (formacao) => {
    if (!formacao) return null;

    // Se já estiver formatado como lista, retornar como está
    if (formacao.includes('•') || formacao.includes('-')) {
      return formacao;
    }

    // Tentar identificar professores individuais
    const professores = formacao.split(/[,;]/).map(p => p.trim()).filter(p => p);
    
    if (professores.length === 1) {
      // Se há apenas um professor, formatar com nome indígena primeiro
      const professor = professores[0];
      return formatarNomeProfessor(professor);
    }

    // Se há múltiplos professores, formatar como lista
    return professores.map(professor => 
      `• ${formatarNomeProfessor(professor)}`
    ).join('\n');
  };

  // Função para formatar nome do professor (nome indígena primeiro)
  const formatarNomeProfessor = (nome) => {
    if (!nome) return nome;

    // Padrões comuns para nomes indígenas
    const padroesIndigenas = [
      /^([A-Z][a-z]+)\s+([A-Z][a-z]+)\s+\(([^)]+)\)/, // Nome Indígena (Nome Português)
      /^([A-Z][a-z]+)\s+([A-Z][a-z]+)\s+-\s+([^)]+)/, // Nome Indígena - Nome Português
      /^([A-Z][a-z]+)\s+([A-Z][a-z]+)\s+ou\s+([^)]+)/, // Nome Indígena ou Nome Português
    ];

    for (const padrao of padroesIndigenas) {
      const match = nome.match(padrao);
      if (match) {
        const nomeIndigena = `${match[1]} ${match[2]}`;
        const nomePortugues = match[3];
        return `${nomeIndigena} (${nomePortugues})`;
      }
    }

    // Se não encontrar padrão específico, verificar se há parênteses
    if (nome.includes('(') && nome.includes(')')) {
      return nome; // Já está formatado
    }

    // Se não há formatação específica, retornar como está
    return nome;
  };

  return (
    <InfoSection title="Gestores" icon={UsersRound} secondaryIcon={Star}>
      <InfoItem label="Gestão/Nome" value={escola.gestao} />
      <InfoItem label="Professores Indígenas" value={escola.professores_indigenas} />
      <InfoItem label="Outros Funcionários" value={escola.outros_funcionarios} />
      <InfoItem label="Professores Não Indígenas" value={escola.professores_nao_indigenas} />
      <InfoItem 
        label="Professores Falantes da Língua Indígena" 
        value={escola.professores_falam_lingua} 
      />
      <InfoItem 
        label="Formação dos Professores" 
        value={formatarFormacaoProfessores(escola.formacao_professores)} 
      />
      <InfoItem 
        label="Visitas de Supervisores e Formação Continuada" 
        value={escola.formacao_continuada}
        isTextArea={true}
      />
    </InfoSection>
  );
});

export default GestaoProfessores; 