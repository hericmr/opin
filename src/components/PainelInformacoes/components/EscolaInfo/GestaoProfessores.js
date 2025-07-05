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
import InfoSection from '../InfoSection';

const MiniCard = ({ icon: Icon, label, value, description }) => (
  <div className="flex items-start gap-2 rounded-lg p-2 text-sm">
    <Icon className="w-6 h-6 text-gray-600 mt-0.5 flex-shrink-0" />
    <div className="flex-1">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-gray-800 font-medium mt-0.5">{value}</div>
      {description && (
        <div className="text-xs text-gray-600 mt-1 whitespace-pre-line">
          {description}
        </div>
      )}
    </div>
  </div>
);

const formatarNomeProfessor = (nome) => {
  if (!nome) return nome;

  const padroesIndigenas = [
    /^([A-Z][a-z]+)\s+([A-Z][a-z]+)\s+\(([^)]+)\)/,
    /^([A-Z][a-z]+)\s+([A-Z][a-z]+)\s+-\s+([^)]+)/,
    /^([A-Z][a-z]+)\s+([A-Z][a-z]+)\s+ou\s+([^)]+)/,
  ];

  for (const padrao of padroesIndigenas) {
    const match = nome.match(padrao);
    if (match) {
      const nomeIndigena = `${match[1]} ${match[2]}`;
      const nomePortugues = match[3];
      return `${nomeIndigena} (${nomePortugues})`;
    }
  }

  return nome.includes('(') && nome.includes(')') ? nome : nome;
};

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 [&>*]:bg-green-100">
        <MiniCard
          icon={UserCheck}
          label="Professores Indígenas"
          value={escola.professores_indigenas}
        />
        <MiniCard
          icon={UserMinus}
          label="Professores Não Indígenas"
          value={escola.professores_nao_indigenas}
        />
        <MiniCard
          icon={MessageCircle}
          label="Professores que falam língua indígena"
          value={renderBooleanStatus(escola.professores_falam_lingua)}
        />
        {formacao?.status && (
          <MiniCard
            icon={Star}
            label="Formação dos Professores"
            value={renderBooleanStatus(formacao.status)}
            description={formacao.descricao}
          />
        )}
      </div>

      <div className="space-y-2 mt-4 [&>*]:bg-green-100">
        <MiniCard
          icon={User}
          label="Gestão/Nome"
          value={escola.gestao}
        />
        <MiniCard
          icon={UsersRound}
          label="Outros Funcionários"
          value={escola.outros_funcionarios}
        />
        {continuada?.status && (
          <MiniCard
            icon={NotebookPen}
            label="Visitas de Supervisores e Formação Continuada"
            value={renderBooleanStatus(continuada.status)}
            description={continuada.descricao}
          />
        )}
      </div>
    </InfoSection>
  );
});

export default GestaoProfessores;
