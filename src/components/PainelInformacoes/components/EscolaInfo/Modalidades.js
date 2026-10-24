import React, { memo } from 'react';
import { FichaSecao, FichaLista, ListaItens, isVazio } from '../Ficha';
import { parseModalidades } from '../../../AdminPanel/utils/modalidadeParser';

const Modalidades = memo(({ escola }) => {
  if (!escola) return null;

  const modalidades = parseModalidades(escola.modalidade_ensino);

  const itens = [
    modalidades.length > 0 && {
      rotulo: 'Modalidades de ensino',
      valor: <ListaItens itens={modalidades} />,
      inteiro: modalidades.join(', ').length > 60,
    },
    { rotulo: 'Número de alunos', valor: escola.numero_alunos },
    { rotulo: 'Turnos de funcionamento', valor: escola.turnos_funcionamento },
    { rotulo: 'Línguas faladas', valor: escola.linguas_faladas },
    { rotulo: 'Material pedagógico indígena', valor: escola.material_indigena, tipo: 'simnao' },
    { rotulo: 'Material pedagógico não indígena', valor: escola.material_nao_indigena },
    { rotulo: 'PPP com a comunidade', valor: escola.ppp_comunidade, tipo: 'simnao' },
  ].filter(Boolean);

  if (itens.every((item) => isVazio(item.valor))) return null;

  return (
    <FichaSecao titulo="Ensino">
      <FichaLista itens={itens} />
    </FichaSecao>
  );
});

export default Modalidades;
