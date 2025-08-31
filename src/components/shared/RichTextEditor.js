import React from 'react';
import QuillEditor from './QuillEditor';

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