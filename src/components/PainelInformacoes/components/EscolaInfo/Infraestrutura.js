import React, { memo } from 'react';
import { FichaSecao, FichaLista, isVazio } from '../Ficha';

const Infraestrutura = memo(({ escola }) => {
  if (!escola) return null;

  const itens = [
    { rotulo: 'Espaço escolar e estrutura', valor: escola.espaco_escolar, inteiro: true },
    { rotulo: 'Salas vinculadas', valor: escola.salas_vinculadas },
    { rotulo: 'Acesso à internet', valor: escola.acesso_internet, tipo: 'simnao' },
    { rotulo: 'Equipamentos tecnológicos', valor: escola.equipamentos },
  ];

  if (itens.every((item) => isVazio(item.valor))) return null;

  return (
    <FichaSecao titulo="Infraestrutura">
      <FichaLista itens={itens} />
    </FichaSecao>
  );
});

export default Infraestrutura;
