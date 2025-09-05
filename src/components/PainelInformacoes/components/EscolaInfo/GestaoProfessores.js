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
  <div className="bg-green-50 hover:bg-green-100 rounded-lg p-3 transition-all duration-200 hover:shadow-sm h-full flex flex-col">
    {/* Header com ícone e label */}
    <div className="flex items-center gap-2 mb-2 flex-shrink-0">
      <Icon className="w-5 h-5 text-green-600 flex-shrink-0" />
      <span className="text-xs text-gray-600 font-medium">{label}</span>
    </div>
    {/* Conteúdo do valor */}
    <div className="flex-1 flex flex-col">
      <div className="text-sm text-gray-800 font-medium mb-2 break-words">{value}</div>
      {description && (
        <div className="text-xs text-gray-600 whitespace-pre-line leading-relaxed break-words">
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
      <div className="space-y-4 mt-1">
        {/* Cards em grid de 2 colunas em mobile, 3 em desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
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
        </div>
        
        {/* Card de Formação em linha inteira */}
        {formacao?.status && (
          <MiniCard
            icon={Star}
            label="Formação dos Professores"
            value={renderBooleanStatus(formacao.status)}
            description={formacao.descricao}
          />
        )}
      </div>

      <div className="space-y-4 mt-4">
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
