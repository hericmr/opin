import React, { memo } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { FichaSecao, FichaLista, isVazio } from '../Ficha';
import { getPovoIndigenaLabel } from '../../../../utils/povoIndigenaLabel';

// Texto todo em maiúsculas (ex.: "SÃO PAULO, SP") vira "São Paulo, SP";
// siglas de 2 letras ficam em maiúsculas e preposições em minúsculas
const PREPOSICOES = new Set(['de', 'da', 'do', 'das', 'dos', 'e']);
const formatarEndereco = (str) => {
  if (!str || str !== str.toUpperCase()) return str || '';
  return str.toLowerCase().replace(/[\p{L}]+/gu, (palavra, i) => {
    if (palavra.length === 2 && !PREPOSICOES.has(palavra)) return palavra.toUpperCase();
    if (i > 0 && PREPOSICOES.has(palavra)) return palavra;
    return palavra.charAt(0).toUpperCase() + palavra.slice(1);
  });
};

const linkClasse = 'inline-flex items-center gap-1.5 text-green-800 font-medium underline decoration-green-700/30 underline-offset-4 hover:decoration-green-700';

// 11850000 -> 11850-000
const formatarCep = (cep) => {
  const digitos = String(cep || '').replace(/\D/g, '');
  return digitos.length === 8 ? `${digitos.slice(0, 5)}-${digitos.slice(5)}` : cep;
};

// Uma linha corrida; com coordenadas, o próprio endereço abre o mapa
const Endereco = ({ escola }) => {
  const cidade = [escola.municipio, escola.estado].filter(Boolean).join(' – ');
  const texto = escola.logradouro || escola.bairro || escola.cep
    ? [escola.logradouro, escola.bairro, cidade, formatarCep(escola.cep)].filter(Boolean).join(', ')
    : formatarEndereco(escola.endereco);
  if (!(escola.Latitude && escola.Longitude)) return texto;
  return (
    <a
      href={`https://www.google.com/maps?q=${escola.Latitude},${escola.Longitude}`}
      target="_blank"
      rel="noopener noreferrer"
      title="Ver no Google Maps"
      className="text-gray-900 underline decoration-green-700/30 underline-offset-4 hover:decoration-green-700"
    >
      {texto}
      <MapPin className="inline-block w-4 h-4 ml-1 -mt-0.5 text-green-700" aria-label="(abre o Google Maps)" />
    </a>
  );
};

const RedesSociais = ({ links }) => (
  <ul className="space-y-1">
    {links.map((link) => (
      <li key={link} className="min-w-0">
        <a href={link} target="_blank" rel="noopener noreferrer" className={`${linkClasse} max-w-full`}>
          <span className="truncate">{link.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span>
          <ExternalLink className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        </a>
      </li>
    ))}
  </ul>
);

const BasicInfo = memo(({ escola }) => {
  if (!escola) return null;

  // Só o que parece endereço (a planilha usa "-" para vazio); sem protocolo ganha https://
  const links = (escola.links_redes_sociais || '').split(',')
    .map((url) => url.trim())
    .filter((url) => !isVazio(url) && /^(https?:\/\/)?[^\s/]+\.[^\s]+/.test(url))
    .map((url) => (/^https?:\/\//.test(url) ? url : `https://${url}`));

  const itens = [
    escola.povos_indigenas && {
      rotulo: getPovoIndigenaLabel(escola.povos_indigenas),
      valor: escola.povos_indigenas,
    },
    { rotulo: 'Município', valor: escola.municipio },
    { rotulo: 'Diretoria de ensino', valor: escola.diretoria_ensino },
    { rotulo: 'Ano de criação', valor: escola.ano_criacao },
    // Links quando houver; sem links, só um "Sim" informa algo ("Não" não aparece)
    links.length > 0
      ? { rotulo: 'Redes sociais', valor: <RedesSociais links={links} /> }
      : /^\s*sim/i.test(String(escola.usa_redes_sociais ?? '')) && { rotulo: 'Usa redes sociais', valor: 'Sim', tipo: 'simnao' },
    escola.endereco && { rotulo: 'Endereço', valor: <Endereco escola={escola} />, inteiro: true },
  ];

  return (
    <FichaSecao titulo="Sobre a escola" semTitulo>
      <FichaLista itens={itens} />
    </FichaSecao>
  );
});

export default BasicInfo;
