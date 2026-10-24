import React from 'react';

const rawBaseUrl = import.meta.env.BASE_URL || '/';
const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
const fotoPadrao = `${baseUrl}/fotos/default.webp`;

const TAMANHOS = {
  grande: { foto: 'w-28 h-28', sobreposicao: '-ml-8' },
  pequena: { foto: 'w-7 h-7', sobreposicao: '-ml-2' },
};

// Fotos sobrepostas dos professores do Lindiflix citados nos créditos de uma história
const MiniaturasProfessores = ({ professores, tamanho = 'grande' }) => {
  const estilo = TAMANHOS[tamanho] || TAMANHOS.grande;
  return (
    <div className="flex shrink-0">
      {professores.map((prof, idx) => {
        const nome = prof.nome || prof.professor || prof.professora;
        return (
          <img
            key={nome}
            src={prof.imagem ? `${baseUrl}/${prof.imagem}` : fotoPadrao}
            alt={`Foto de ${nome}`}
            title={nome}
            loading="lazy"
            className={`${estilo.foto} rounded-full object-cover bg-white ${idx > 0 ? estilo.sobreposicao : ''}`}
            style={{ zIndex: professores.length - idx }}
            onError={(e) => { e.target.src = fotoPadrao; }}
          />
        );
      })}
    </div>
  );
};

export default MiniaturasProfessores;
