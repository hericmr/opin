import React, { useRef, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './QuillEditor.css';
import { uploadImage } from '../../services/uploadService';

const QuillEditor = ({ value, onChange, placeholder, label, style = {} }) => {
  const quillRef = useRef(null);
  const [quillInstance, setQuillInstance] = React.useState(null);

  // Handler customizado para upload de imagens
  const imageHandler = useCallback(async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file && quillInstance) {
        try {
          // Mostrar loading
          const range = quillInstance.getSelection();
          
          // Inserir placeholder de loading
          quillInstance.insertEmbed(range.index, 'image', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
          
          // Fazer upload da imagem
          const imageUrl = await uploadImage(file);
          
          // Substituir placeholder pela imagem real
          quillInstance.deleteText(range.index, 1);
          quillInstance.insertEmbed(range.index, 'image', imageUrl);
          
          // Mover cursor para depois da imagem
          quillInstance.setSelection(range.index + 1);
        } catch (error) {
          console.error('Erro ao fazer upload da imagem:', error);
          alert('Erro ao fazer upload da imagem. Tente novamente.');
        }
      }
    };
  }, [quillInstance]);

  // Configuração dos módulos do Quill
  const modules = React.useMemo(() => ({
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
  }), [imageHandler]);

  // Configuração dos formatos permitidos
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image'
  ];

  // Callback quando o editor é montado
  const handleEditorChange = useCallback((content, delta, source, editor) => {
    if (onChange) {
      onChange(content, delta, source, editor);
    }
  }, [onChange]);

  // Callback quando o editor é montado
  const handleEditorReady = useCallback((quill) => {
    setQuillInstance(quill);
  }, []);

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
          onChange={handleEditorChange}
          onEditorReady={handleEditorReady}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{
            height: '300px',
            backgroundColor: '#1f2937', // bg-gray-800
            color: '#f3f4f6', // text-gray-100
            ...style
          }}
        />
      </div>
    </div>
  );
};

export default QuillEditor;
