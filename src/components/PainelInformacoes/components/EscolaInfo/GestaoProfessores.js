import React, { memo } from 'react';
import {
  UsersRound,
  Star,
  User,
  UserCheck,
  UserMinus,
  MessageCircle,
  NotebookPen,
  Check,
  X,
} from 'lucide-react';
// Import Check from lucide-react for boolean status rendering
import InfoSection from '../InfoSection';
import NativeLandCard from '../NativeLandCard';

// const formatarNomeProfessor = (nome) => { // Removido - não utilizado
//   if (!nome) return nome;

//   const padroesIndigenas = [
//     /^([A-Z][a-z]+)\s+([A-Z][a-z]+)\s+\(([^)]+)\)/,
//     /^([A-Z][a-z]+)\s+([A-Z][a-z]+)\s+-\s+([^)]+)/,
//     /^([A-Z][a-z]+)\s+([A-Z][a-z]+)\s+ou\s+([^)]+)/,
//   ];

//   for (const padrao of padroesIndigenas) {
//     const match = nome.match(padrao);
//     if (match) {
//       const nomeIndigena = `${match[1]} ${match[2]}`;
//       const nomePortugues = match[3];
//       return `${nomeIndigena} (${nomePortugues})`;
//     }
//   }

//   return nome.includes('(') && nome.includes(')') ? nome : nome;
// };

const formatarFormacaoProfessores = (formacao) => {
  if (!formacao) return null;

  const [status, ...resto] = formacao.split('/');
  const descricao = resto.join('/').trim();

  return {
    status: status.trim().toLowerCase() === 'sim' ? 'Sim' : status.trim(),
    descricao: descricao || null,
  };
};

const formatarFormacaoContinuada = (valor) => {
  if (!valor) return null;

  const [status, ...resto] = valor.split('/');
  const descricao = resto.join('/').trim();

  return {
    status: status.trim().toLowerCase() === 'sim' ? 'Sim' : status.trim(),
    descricao: descricao || null,
  };
};

const renderBooleanStatus = (valor) => {
  const normalizado = String(valor).trim().toLowerCase();
  if (normalizado === 'sim') {
    return (
      <div className="flex items-center gap-1 text-gray-900">
        <Check className="w-5 h-5" />
        Sim
      </div>
    );
  } else if (normalizado === 'não' || normalizado === 'nao') {
    return (
      <div className="flex items-center gap-1 text-gray-500">
        <X className="w-5 h-5" />
        Não
      </div>
    );
  }
  return valor;
};

// Helper function to check if a value is empty
const isEmptyValue = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (typeof value === 'number' && isNaN(value)) return true;
  // Keep 0, false, and React elements as valid
  if (typeof value === 'number') return false;
  if (typeof value === 'boolean') return false;
  if (React.isValidElement(value)) return false;
  return false;
};

// Helper function to check if a card has long content
const hasLongContent = (value) => {
  if (!value) return false;
  if (React.isValidElement(value)) return false; // React elements are not long text
  if (typeof value === 'string') {
    const trimmed = value.trim();
    // Verifica se tem mais de 30 caracteres OU se tem vírgulas (lista de itens)
    return trimmed.length > 30 || (trimmed.includes(',') && trimmed.length > 20);
  }
  return false;
};

// Helper function to get grid columns based on item count
const getGridCols = (count) => {
  if (count === 0) return 'grid-cols-1';
  if (count === 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-2';
  return 'grid-cols-3 lg:grid-cols-3';
};

const GestaoProfessores = memo(({ escola }) => {
  if (!escola) return null;

  const formacao = formatarFormacaoProfessores(escola.formacao_professores);
  const continuada = formatarFormacaoContinuada(escola.formacao_continuada);

  // Filter empty values
  const professoresCards = [
    !isEmptyValue(escola.professores_indigenas) && {
      icon: UserCheck,
      label: "Professores Indígenas",
      value: escola.professores_indigenas,
      type: "number",
    },
    !isEmptyValue(escola.professores_nao_indigenas) && {
      icon: UserMinus,
      label: "Professores Não Indígenas",
      value: escola.professores_nao_indigenas,
      type: "number",
    },
    !isEmptyValue(escola.professores_falam_lingua) && {
      icon: MessageCircle,
      label: "Professores que falam língua indígena",
      value: renderBooleanStatus(escola.professores_falam_lingua),
    },
  ].filter(Boolean);

  return (
    <InfoSection>
      <div className="space-y-3">
        {/* Separar cards com muito conteúdo dos cards normais */}
        {(() => {
          const longContentCards = professoresCards.filter(item => hasLongContent(item.value));
          const normalCards = professoresCards.filter(item => !hasLongContent(item.value));
          
          return (
            <>
              {/* Cards com muito conteúdo - linha inteira (1 coluna) */}
              {longContentCards.length > 0 && (
                <div className="space-y-3">
                  {longContentCards.map((item, idx) => (
                    <NativeLandCard
                      key={`long-${idx}`}
                      icon={item.icon}
                      label={item.label}
                      value={item.value}
                      type={item.type}
                      showIconCircle={true}
                    />
                  ))}
                </div>
              )}
              
              {/* Cards normais - grid de 3 colunas */}
              {normalCards.length > 0 && (
                <div className={`grid ${getGridCols(normalCards.length)} gap-3 ${longContentCards.length > 0 ? 'mt-3' : ''} items-stretch overflow-visible`}>
                  {normalCards.map((item, idx) => (
                    <NativeLandCard
                      key={`normal-${idx}`}
                      icon={item.icon}
                      label={item.label}
                      value={item.value}
                      type={item.type}
                      showIconCircle={true}
                    />
                  ))}
                </div>
              )}
            </>
          );
        })()}
        
        {/* Cards adicionais - cada um ocupa uma linha inteira */}
        {(() => {
          const additionalCards = [
            formacao?.status && {
              icon: Star,
              label: "Formação dos Professores",
              value: renderBooleanStatus(formacao.status),
              description: formacao.descricao,
              className: "h-auto min-h-[140px]"
            },
            !isEmptyValue(escola.gestao) && {
              icon: User,
              label: "Tem vice-diretor; COE?",
              value: escola.gestao
            },
            !isEmptyValue(escola.outros_funcionarios) && {
              icon: UsersRound,
              label: "Outros Funcionários",
              value: escola.outros_funcionarios
            },
            continuada?.status && {
              icon: NotebookPen,
              label: "Visitas de Supervisores e Formação Continuada",
              value: renderBooleanStatus(continuada.status),
              description: continuada.descricao,
              className: "h-auto min-h-[140px]"
            }
          ].filter(Boolean);

          if (additionalCards.length === 0) return null;

          // Cada card ocupa uma linha inteira (1 coluna)
          return (
            <div className="space-y-3 mt-3">
              {additionalCards.map((item, idx) => (
                <NativeLandCard
                  key={`additional-${idx}`}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                  description={item.description}
                  showIconCircle={true}
                  className={item.className || ''}
                />
              ))}
            </div>
          );
        })()}
      </div>
    </InfoSection>
  );
});

export default GestaoProfessores;
