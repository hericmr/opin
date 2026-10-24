import React, { memo } from 'react';
import { FichaSecao, FichaLista, isVazio } from '../Ficha';

// "Sim/descrição da formação" -> { status: 'Sim', descricao: '...' }
const formatarFormacaoProfessores = (formacao) => {
  if (!formacao) return null;
  const [status, ...resto] = formacao.split('/');
  const descricao = resto.join('/').trim();
  return {
    status: status.trim().toLowerCase() === 'sim' ? 'Sim' : status.trim(),
    descricao: descricao || null,
  };
};

const GestaoProfessores = memo(({ escola }) => {
  if (!escola) return null;

  const formacao = formatarFormacaoProfessores(escola.formacao_professores);

  const itens = [
    { rotulo: 'Professores indígenas', valor: escola.professores_indigenas, tipo: 'numero' },
    { rotulo: 'Professores não indígenas', valor: escola.professores_nao_indigenas, tipo: 'numero' },
    formacao?.status && {
      rotulo: 'Formação dos professores',
      valor: formacao.status,
      tipo: 'simnao',
      detalhe: formacao.descricao,
      inteiro: formacao.descricao ? true : undefined,
    },
    { rotulo: 'Tem vice-diretor ou COE?', valor: escola.gestao, tipo: 'simnao' },
    { rotulo: 'Outros funcionários', valor: escola.outros_funcionarios },
  ].filter(Boolean);

  if (itens.every((item) => isVazio(item.valor))) return null;

  return (
    <FichaSecao titulo="Equipe">
      <FichaLista itens={itens} />
    </FichaSecao>
  );
});

export default GestaoProfessores;
