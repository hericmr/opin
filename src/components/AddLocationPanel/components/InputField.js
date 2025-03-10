import React from 'react';
import PropTypes from 'prop-types';

const InputField = ({ label, id, type, value, onChange, placeholder, error, required }) => (
  <div>
    <label className="block font-medium" htmlFor={id}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {error && <p className="text-red-500 text-sm">{error}</p>}
    <input
      id={id}
      type={type}
      className="w-full border rounded p-2 text-black"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool
};

InputField.defaultProps = {
  type: 'text',
  required: false
};

export default InputField; 