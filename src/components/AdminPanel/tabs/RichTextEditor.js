import React from 'react';
import QuillEditor from '../../shared/QuillEditor';
import './RichTextEditor.css';

const RichTextEditor = ({ value, onChange, placeholder, label }) => {
  return (
    <QuillEditor
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      label={label}
    />
  );
};

export default RichTextEditor; 