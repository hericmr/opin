import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PropTypes from 'prop-types';

const RichTextEditor = ({ value, onChange, error }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  return (
    <div className="space-y-2">
      <label className="block font-medium text-gray-800">
        Descrição Detalhada <span className="text-red-500">*</span>
      </label>
      <div className={`border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}>
        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          theme="snow"
          className="h-64"
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

RichTextEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default RichTextEditor; 