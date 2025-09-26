import React, { useEffect, useRef } from 'react';

// Skip Link para navegação por teclado
export const SkipLink = ({ targetId, children = 'Pular para o conteúdo principal' }) => {
  const linkRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        linkRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      ref={linkRef}
      href={`#${targetId}`}
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-green-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
    >
      {children}
    </a>
  );
};

// Hook para gerenciar foco
export const useFocusManagement = () => {
  const focusableElements = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ');

  const trapFocus = (containerRef) => {
    const container = containerRef.current;
    if (!container) return;

    const focusableContent = container.querySelectorAll(focusableElements);
    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  };

  return { trapFocus };
};

// Componente para indicadores de foco visíveis
export const FocusIndicator = ({ children, className = '' }) => {
  return (
    <div className={`focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 focus-within:outline-none ${className}`}>
      {children}
    </div>
  );
};

// Hook para detectar se o usuário prefere movimento reduzido
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Componente para melhorar contraste
export const HighContrastText = ({ children, className = '' }) => {
  return (
    <span className={`text-gray-900 dark:text-white font-medium ${className}`}>
      {children}
    </span>
  );
};

// Hook para navegação por teclado em listas
export const useKeyboardNavigation = (items, onSelect) => {
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < items.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : items.length - 1
        );
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && items[focusedIndex]) {
          onSelect(items[focusedIndex]);
        }
        break;
      case 'Escape':
        setFocusedIndex(-1);
        break;
      default:
        // Não fazer nada para outras teclas
        break;
    }
  };

  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown
  };
};

// Componente para melhorar acessibilidade de botões
export const AccessibleButton = ({ 
  children, 
  onClick, 
  disabled = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  className = '',
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      className={`focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading && (
        <span className="sr-only">Carregando...</span>
      )}
      {children}
    </button>
  );
};

// Componente para melhorar acessibilidade de links
export const AccessibleLink = ({ 
  children, 
  href, 
  external = false,
  ariaLabel,
  className = '',
  ...props 
}) => {
  const externalProps = external ? {
    target: '_blank',
    rel: 'noopener noreferrer',
    'aria-label': `${ariaLabel || children} (abre em nova aba)`
  } : {};

  return (
    <a
      href={href}
      className={`focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${className}`}
      aria-label={ariaLabel}
      {...externalProps}
      {...props}
    >
      {children}
      {external && (
        <span className="sr-only"> (abre em nova aba)</span>
      )}
    </a>
  );
};

// Componente para melhorar acessibilidade de imagens
export const AccessibleImage = ({ 
  src, 
  alt, 
  decorative = false,
  className = '',
  ...props 
}) => {
  return (
    <img
      src={src}
      alt={decorative ? '' : alt}
      role={decorative ? 'presentation' : undefined}
      className={className}
      {...props}
    />
  );
};

// Hook para melhorar acessibilidade de modais
export const useModalAccessibility = (isOpen, onClose) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Salvar o elemento que tinha foco antes de abrir o modal
      previousFocusRef.current = document.activeElement;
      
      // Focar no modal
      modalRef.current?.focus();
      
      // Prevenir scroll do body
      document.body.style.overflow = 'hidden';
      
      // Adicionar listener para ESC
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
        
        // Restaurar foco
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  return modalRef;
};

// Componente para melhorar acessibilidade de formulários
export const AccessibleFormField = ({ 
  id,
  label,
  error,
  required = false,
  children,
  className = ''
}) => {
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="obrigatório">*</span>}
      </label>
      <div>
        {React.cloneElement(children, {
          id,
          'aria-describedby': error ? errorId : descriptionId,
          'aria-invalid': error ? 'true' : 'false',
          required
        })}
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

const AccessibilityComponents = {
  SkipLink,
  useFocusManagement,
  FocusIndicator,
  useReducedMotion,
  HighContrastText,
  useKeyboardNavigation,
  AccessibleButton,
  AccessibleLink,
  AccessibleImage,
  useModalAccessibility,
  AccessibleFormField
};

export default AccessibilityComponents; 