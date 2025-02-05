import React from "react";

// Este componente exibe  as referencias de cada texto exibido no painel se houver

const PainelLinks = ({ links }) => (
  links?.length > 0 && (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Referências:</h3>
      <ul className="list-disc pl-6 space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-blue-800 hover:underline">
              {link.texto}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
);

export default PainelLinks;