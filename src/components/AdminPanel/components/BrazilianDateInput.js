import React, { useState, useEffect } from 'react';
import { formatDateToBrazilian, formatDateToISO } from '../../../utils/dateUtils';

/**
 * Componente de input de data no formato brasileiro (DD/MM/YYYY)
 * Permite entrada pelo teclado e converte automaticamente entre formato brasileiro e ISO
 */
const BrazilianDateInput = ({ value, onChange, className = '', placeholder = 'DD/MM/AAAA', ...props }) => {

  // Estado local para o valor exibido (formato brasileiro)
  const [displayValue, setDisplayValue] = useState(() => formatDateToBrazilian(value));

  // Atualiza o valor exibido quando o valor prop muda
  useEffect(() => {
    setDisplayValue(formatDateToBrazilian(value));
  }, [value]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    
    // Permite apagar completamente
    if (inputValue === '') {
      setDisplayValue('');
      onChange({ target: { value: '' } });
      return;
    }

    // Remove caracteres não numéricos exceto barras
    let cleaned = inputValue.replace(/[^\d/]/g, '');
    
    // Adiciona barras automaticamente enquanto digita
    if (cleaned.length > 2 && !cleaned.includes('/')) {
      cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }
    if (cleaned.length > 5 && cleaned.split('/').length === 2) {
      cleaned = cleaned.substring(0, 5) + '/' + cleaned.substring(5, 9);
    }
    
    // Limita o tamanho máximo
    if (cleaned.length > 10) {
      cleaned = cleaned.substring(0, 10);
    }
    
    setDisplayValue(cleaned);
    
    // Converte para ISO e chama onChange se a data estiver completa e válida
    if (cleaned.length === 10 && cleaned.includes('/')) {
      const isoDate = formatDateToISO(cleaned);
      if (isoDate) {
        onChange({ target: { value: isoDate } });
      } else {
        // Se não é válida, ainda atualiza o display mas não chama onChange
        // Isso permite que o usuário corrija
      }
    } else if (cleaned.length < 10) {
      // Se ainda não está completa, não chama onChange
      // Mas permite continuar digitando
    }
  };

  const handleBlur = () => {
    // Ao perder o foco, valida e formata
    if (displayValue && displayValue.length > 0) {
      const isoDate = formatDateToISO(displayValue);
      if (isoDate) {
        setDisplayValue(formatDateToBrazilian(isoDate));
        onChange({ target: { value: isoDate } });
      } else {
        // Se inválida, tenta corrigir ou limpa
        if (displayValue.length === 10) {
          // Data completa mas inválida - limpa
          setDisplayValue('');
          onChange({ target: { value: '' } });
        }
      }
    }
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
      maxLength={10}
      {...props}
    />
  );
};

export default BrazilianDateInput;

