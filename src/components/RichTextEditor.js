import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PropTypes from 'prop-types';

const RichTextEditor = ({ value, onChange, placeholder = 'Digite aqui...', height = '200px' }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'blockquote'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'align',
    'link', 'blockquote'
  ];

  return (
    <div className="rich-text-editor">
      <style>
        {`
          .rich-text-editor .ql-editor {
            min-height: ${height};
            font-size: 14px;
            line-height: 1.6;
            color: #374151;
          }
          
          .rich-text-editor .ql-toolbar {
            border-top: 1px solid #d1d5db;
            border-left: 1px solid #d1d5db;
            border-right: 1px solid #d1d5db;
            border-radius: 6px 6px 0 0;
            background-color: #f9fafb;
          }
          
          .rich-text-editor .ql-container {
            border-bottom: 1px solid #d1d5db;
            border-left: 1px solid #d1d5db;
            border-right: 1px solid #d1d5db;
            border-radius: 0 0 6px 6px;
            background-color: white;
          }
          
          .rich-text-editor .ql-editor:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
          }
          
          .rich-text-editor .ql-toolbar button:hover,
          .rich-text-editor .ql-toolbar .ql-picker-label:hover {
            color: #3b82f6;
          }
          
          .rich-text-editor .ql-toolbar button.ql-active,
          .rich-text-editor .ql-toolbar .ql-picker-label.ql-active {
            color: #3b82f6;
          }
        `}
      </style>
      
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white"
      />
    </div>
  );
};

RichTextEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  height: PropTypes.string
};

export default RichTextEditor; 