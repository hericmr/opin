import React from 'react';
import PropTypes from 'prop-types';

const RichTextEditor = ({ value, onChange, error }) => {
  return (
    <div>
      <label className="block font-medium text-gray-800">
        Descrição Detalhada <span className="text-red-500">*</span>
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        rows={6}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

RichTextEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default RichTextEditor; 