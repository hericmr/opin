import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md', // sm, md, lg, xl
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  icon,
  theme = 'default' // default, success, warning, error
}) => {
  const modalRef = useRef(null);

  // Configurações de tamanho
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  // Configurações de tema
  const themes = {
    default: {
      header: 'border-gray-200',
      icon: 'bg-gray-100 text-gray-600'
    },
    success: {
      header: 'border-green-200',
      icon: 'bg-green-100 text-green-600'
    },
    warning: {
      header: 'border-yellow-200',
      icon: 'bg-yellow-100 text-yellow-600'
    },
    error: {
      header: 'border-red-200',
      icon: 'bg-red-100 text-red-600'
    }
  };

  const currentTheme = themes[theme] || themes.default;
  const currentSize = sizes[size] || sizes.md;

  // Focar no modal quando abrir
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Fechar com ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && closeOnEscape && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll do body
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div 
        ref={modalRef}
        className={`bg-white rounded-xl shadow-2xl w-full ${currentSize} transform transition-all duration-300 scale-100 ${className}`}
        tabIndex={-1}
      >
        {/* Header */}
        {(title || subtitle || icon) && (
          <div className={`flex items-center justify-between p-6 border-b ${currentTheme.header} ${headerClassName}`}>
            <div className="flex items-center gap-3">
              {icon && (
                <div className={`p-2 ${currentTheme.icon} rounded-lg`}>
                  {icon}
                </div>
              )}
              <div>
                {title && (
                  <h2 className="text-xl font-semibold text-gray-900">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-500">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Fechar modal"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className={`p-6 ${bodyClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
