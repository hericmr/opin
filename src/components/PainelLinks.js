// PainelLinks.js
import React from "react";
import PropTypes from "prop-types";
import { ExternalLink } from 'lucide-react';

const PainelLinks = ({ links }) => {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Links Relacionados</h3>
      <div className="rounded-lg divide-y divide-green-100/30">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 hover:bg-green-100/30 transition-colors duration-200 group rounded-lg"
          >
            <span className="text-gray-700 group-hover:text-gray-900 flex-1 mr-4">
              {link.texto}
            </span>
            <ExternalLink 
              className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors duration-200" 
              aria-hidden="true"
            />
            <span className="sr-only">Abrir em nova aba</span>
          </a>
        ))}
      </div>
    </div>
  );
};

PainelLinks.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      texto: PropTypes.string.isRequired,
    })
  ).isRequired,
};

PainelLinks.defaultProps = {
  links: [],
};

export default React.memo(PainelLinks);
