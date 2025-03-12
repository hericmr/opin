import React from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, error }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];

  return (
    <div className="w-full">
      <label className="block font-medium text-gray-800 mb-1">
        Descrição Detalhada <span className="text-red-500">*</span>
      </label>
      <div className={`border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}>
        <ReactQuill
          theme="snow"
          value={value || ''}
          onChange={onChange}
          modules={modules}
          formats={formats}
          className="bg-white text-gray-800"
          style={{ height: '200px' }}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

RichTextEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default RichTextEditor; 