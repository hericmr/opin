import React from 'react';
import PropTypes from 'prop-types';
import useBlobURL from '../../hooks/useBlobURL';

/**
 * Componente para preview de arquivos usando blob URLs
 * Gerencia automaticamente criação e revogação de URLs
 * Compatível com React 19 Strict Mode
 */
const FilePreview = ({ file, alt, className = '', ...props }) => {
  const blobURL = useBlobURL(file);

  if (!file || !blobURL) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <span className="text-xs text-gray-400">Sem preview</span>
      </div>
    );
  }

  return (
    <img
      src={blobURL}
      alt={alt || file.name || 'Preview'}
      className={className}
      {...props}
    />
  );
};

FilePreview.propTypes = {
  file: PropTypes.instanceOf(File),
  alt: PropTypes.string,
  className: PropTypes.string,
};

export default FilePreview;








