import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.css';
import { uploadImage } from '../../../services/uploadService';

const RichTextEditor = ({ value, onChange, placeholder, label }) => {
  // Handler customizado para upload de imagens
  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          // Mostrar loading
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          
          // Inserir placeholder de loading
          quill.insertEmbed(range.index, 'image', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
          
          // Fazer upload da imagem
          const imageUrl = await uploadImage(file);
          
          // Substituir placeholder pela imagem real
          quill.deleteText(range.index, 1);
          quill.insertEmbed(range.index, 'image', imageUrl);
          
          // Mover cursor para depois da imagem
          quill.setSelection(range.index + 1);
        } catch (error) {
          console.error('Erro ao fazer upload da imagem:', error);
          alert('Erro ao fazer upload da imagem. Tente novamente.');
        }
      }
    };
  };

  // Referência para o editor Quill
  const quillRef = React.useRef();

  // Configuração dos módulos do Quill
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link'],
        ['image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
  };

  // Configuração dos formatos permitidos
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image'
  ];

  return (
    <div className="rich-text-editor">
      {label && (
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          {label}
        </label>
      )}
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value || ''}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{
            height: '300px',
            backgroundColor: '#1f2937', // bg-gray-800
            color: '#f3f4f6', // text-gray-100
          }}
        />
      </div>
    </div>
  );
};

export default RichTextEditor; 