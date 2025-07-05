import React from 'react';
import { Check, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import './styles.css';

interface InfoStatProps {
  icon: React.ComponentType<{ className?: string; size?: number; 'aria-hidden'?: boolean }>;
  label: string;
  value: string | number | boolean;
  variant?: 'default' | 'highlight' | 'success' | 'warning' | 'error';
  className?: string;
  description?: string;
}

/**
 * Componente InfoStat - Exibe uma informação estatística com ícone
 * 
 * @example
 * ```jsx
 * <InfoStat
 *   icon={Users}
 *   label="Total de Alunos"
 *   value="150"
 *   variant="highlight"
 * />
 * ```
 */
const InfoStat: React.FC<InfoStatProps> = ({
  icon: Icon,
  label,
  value,
  variant = 'default',
  className,
  description
}) => {
  // Determina se o valor é booleano
  const isBoolean = typeof value === 'boolean';
  
  // Classes base do componente
  const baseClasses = clsx(
    'info-stat',
    `info-stat--${variant}`,
    className
  );

  // Classes do ícone
  const iconClasses = clsx(
    'info-stat__icon',
    `info-stat__icon--${variant}`
  );

  // Classes do valor
  const valueClasses = clsx(
    'info-stat__value',
    `info-stat__value--${variant}`,
    isBoolean && 'info-stat__value--boolean',
    isBoolean && `info-stat__value--boolean-${value}`
  );

  // Renderiza o valor baseado no tipo
  const renderValue = () => {
    if (isBoolean) {
      return (
        <>
          {value ? (
            <Check className="w-5 h-5" aria-hidden="true" />
          ) : (
            <X className="w-5 h-5" aria-hidden="true" />
          )}
          <span>{value ? 'Sim' : 'Não'}</span>
        </>
      );
    }
    return value;
  };

  return (
    <div 
      className={twMerge(baseClasses)}
      role="group"
      aria-labelledby={`info-stat-label-${label}`}
      tabIndex={0}
    >
      <div className="info-stat__content">
        <Icon 
          className={iconClasses}
          size={24}
          aria-hidden={true}
        />
        <div className="info-stat__text">
          <span 
            id={`info-stat-label-${label}`}
            className="info-stat__label"
          >
            {label}
          </span>
          <div 
            className={valueClasses}
            aria-label={description || `${label}: ${isBoolean ? (value ? 'Sim' : 'Não') : value}`}
          >
            {renderValue()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoStat; 