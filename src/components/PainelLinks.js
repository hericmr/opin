import React from "react";
import PropTypes from "prop-types";

/**
 * Componente PainelLinks - Exibe uma lista de referências (links) no painel.
 * Segue as melhores práticas de segurança, acessibilidade e desempenho.
 *
 * @param {Array} links - Lista de objetos contendo `url` e `texto` para cada link.
 */
const PainelLinks = ({ links }) => {

  if (!links || links.length === 0) {
    return null; 
  }

  return (
    <div className="mt-6" role="region" aria-label="Referências">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Referências:</h3>
      <ul className="list-disc pl-6 space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 hover:text-blue-800 hover:underline"
              aria-label={`Abrir referência: ${link.texto}`}
            >
              {link.texto}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Validação das props com PropTypes
PainelLinks.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      texto: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default React.memo(PainelLinks); // Otimiza renderizações desnecessárias