import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

/**
 * Autocomplete input component with memory/suggestions
 * @param {Object} props
 * @param {string} props.value - Current value
 * @param {Function} props.onChange - Change handler (value: string) => void
 * @param {Function} props.onSave - Save handler (called when value is saved, to store in memory)
 * @param {Array<string>} props.suggestions - Array of suggestion strings
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.type - Input type (default: 'text')
 * @param {number} props.rows - Number of rows (for textarea)
 */
const AutocompleteInput = ({
  value = '',
  onChange,
  onSave,
  suggestions = [],
  placeholder = '',
  className = '',
  type = 'text',
  rows = null
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Filter suggestions based on current value
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes((value || '').toLowerCase())
  );

  // Show suggestions when input is focused and has suggestions
  useEffect(() => {
    if (value && filteredSuggestions.length > 0 && document.activeElement === inputRef.current) {
      setShowSuggestions(true);
    }
  }, [value, filteredSuggestions.length]);

  // Handle input change
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
    setHighlightedIndex(-1);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredSuggestions.length === 0) {
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(filteredSuggestions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  // Handle blur - hide suggestions after a delay to allow clicks
  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }, 200);
  };

  // Handle focus
  const handleFocus = () => {
    if (filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Clear input
  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const baseClassName = `w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-100 ${className}`;
  const InputComponent = rows ? 'textarea' : 'input';
  const inputProps = {
    ref: inputRef,
    type: rows ? undefined : type,
    value: value || '',
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
    onBlur: handleBlur,
    placeholder,
    className: baseClassName,
    ...(rows && { rows })
  };

  return (
    <div className="relative">
      <div className="relative">
        <InputComponent {...inputProps} />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-200 transition-colors"
            title="Limpar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className={`w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors ${
                index === highlightedIndex ? 'bg-gray-700' : ''
              }`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

AutocompleteInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  suggestions: PropTypes.arrayOf(PropTypes.string),
  placeholder: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  rows: PropTypes.number
};

export default AutocompleteInput;




