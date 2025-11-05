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
      <div className="flex items-center gap-1 text-green-700">
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

const GestaoProfessores = memo(({ escola }) => {
  if (!escola) return null;

  const formacao = formatarFormacaoProfessores(escola.formacao_professores);
  const continuada = formatarFormacaoContinuada(escola.formacao_continuada);

  return (
    <InfoSection title="Gestores" icon={UsersRound}>
      <div className="space-y-4 mt-1">
        {/* Cards em grid de 2 colunas em mobile, 3 em desktop */}
        <div className="grid grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3 items-stretch overflow-visible" style={{ paddingTop: '12px', paddingLeft: '12px' }}>
          <NativeLandCard
            icon={UserCheck}
            label="Professores Indígenas"
            value={escola.professores_indigenas}
            type="number"
            showIconCircle={true}
          />
          <NativeLandCard
            icon={UserMinus}
            label="Professores Não Indígenas"
            value={escola.professores_nao_indigenas}
            type="number"
            showIconCircle={true}
          />
          <NativeLandCard
            icon={MessageCircle}
            label="Professores que falam língua indígena"
            value={renderBooleanStatus(escola.professores_falam_lingua)}
            showIconCircle={true}
          />
        </div>
        
        {/* Card de Formação em linha inteira */}
        {formacao?.status && (
          <div style={{ paddingTop: '12px', paddingLeft: '12px' }}>
            <NativeLandCard
              icon={Star}
              label="Formação dos Professores"
              value={renderBooleanStatus(formacao.status)}
              description={formacao.descricao}
              showIconCircle={true}
              className="h-auto min-h-[140px]"
            />
          </div>
        )}
      </div>

      <div className="space-y-4 mt-4">
        <div style={{ paddingTop: '12px', paddingLeft: '12px' }}>
          <NativeLandCard
            icon={User}
            label="Gestão/Nome"
            value={escola.gestao}
            showIconCircle={true}
          />
        </div>
        <div style={{ paddingTop: '12px', paddingLeft: '12px' }}>
          <NativeLandCard
            icon={UsersRound}
            label="Outros Funcionários"
            value={escola.outros_funcionarios}
            showIconCircle={true}
          />
        </div>
        {continuada?.status && (
          <div style={{ paddingTop: '12px', paddingLeft: '12px' }}>
            <NativeLandCard
              icon={NotebookPen}
              label="Visitas de Supervisores e Formação Continuada"
              value={renderBooleanStatus(continuada.status)}
              description={continuada.descricao}
              showIconCircle={true}
              className="h-auto min-h-[140px]"
            />
          </div>
        )}
      </div>
    </InfoSection>
  );
});

export default GestaoProfessores;
