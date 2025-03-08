// PainelLinks.js
import React from "react";
import PropTypes from "prop-types";

const PainelLinks = ({ links }) => {
  return (
    <div>
      {links.length > 0 ? (
        links.map((link, index) => (
          <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
            {link.texto}
          </a>
        ))
      ) : (
        <p>Nenhum link disponível</p>
      )}
    </div>
  );
};

PainelLinks.propTypes = {
  links: PropTypes.array.isRequired,
};

PainelLinks.defaultProps = {
  links: [],
};

export default PainelLinks;
