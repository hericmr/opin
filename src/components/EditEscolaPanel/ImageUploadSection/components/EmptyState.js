import React from 'react';
import PropTypes from 'prop-types';
import { Image as ImageIcon } from 'lucide-react';

/**
 * Empty state component when there are no images
 * @param {Object} props
 * @param {string} [props.message] - Custom message
 * @param {ReactNode} [props.icon] - Custom icon
 */
const EmptyState = ({ message, icon }) => {
  return (
    <div className="text-center py-8 text-gray-400">
      {icon || <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-500" />}
      <p>{message || 'Nenhuma imagem adicionada ainda.'}</p>
      <p className="text-sm">Adicione imagens para mostrar a escola.</p>
    </div>
  );
};

EmptyState.propTypes = {
  message: PropTypes.string,
  icon: PropTypes.node,
};

export default EmptyState;

