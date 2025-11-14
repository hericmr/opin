import React, { useRef, useCallback, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './QuillEditor.css';
import { uploadImage } from '../../services/uploadService';

const QuillEditor = ({ value, onChange, placeholder, label, style = {} }) => {
  const quillRef = useRef(null);
  const quillInstanceRef = useRef(null);
  const isInternalChange = useRef(false);
  
  // Callback ref para obter a instância do Quill quando o componente é montado
  const quillRefCallback = useCallback((node) => {
    if (node) {
      quillRef.current = node;
      const editor = node.getEditor();
      if (editor) {
        quillInstanceRef.current = editor;
      }
    }
  }, []);
  
  // Atualizar a instância quando o ref mudar (executa após cada render para garantir que temos a instância)
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      if (editor && !quillInstanceRef.current) {
        quillInstanceRef.current = editor;
      }
    }
  });

  // Handler customizado para upload de imagens
  const imageHandler = useCallback(async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const editor = quillInstanceRef.current;
      if (file && editor) {
        try {
          // Mostrar loading
          const range = editor.getSelection();
          
          // Inserir placeholder de loading
          editor.insertEmbed(range.index, 'image', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
          
          // Fazer upload da imagem
          const imageUrl = await uploadImage(file);
          
          // Substituir placeholder pela imagem real
          editor.deleteText(range.index, 1);
          editor.insertEmbed(range.index, 'image', imageUrl);
          
          // Mover cursor para depois da imagem
          editor.setSelection(range.index + 1);
        } catch (error) {
          console.error('Erro ao fazer upload da imagem:', error);
          alert('Erro ao fazer upload da imagem. Tente novamente.');
        }
      }
    };
  }, []);

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
    isInternalChange.current = true;
    if (onChange) {
      onChange(content, delta, source, editor);
    }
    // Reset flag after a short delay to allow React to process the update
    setTimeout(() => {
      isInternalChange.current = false;
    }, 0);
  }, [onChange]);

  // Atualizar o conteúdo do editor quando o value muda externamente
  useEffect(() => {
    // Pequeno delay para garantir que o editor está pronto
    const timeoutId = setTimeout(() => {
      let editor = quillInstanceRef.current;
      
      // Se não temos a instância ainda, tentar obter do ref
      if (!editor && quillRef.current) {
        editor = quillRef.current.getEditor();
        if (editor) {
          quillInstanceRef.current = editor;
        }
      }
      
      if (editor && !isInternalChange.current) {
        const currentContent = editor.root.innerHTML.trim();
        const newValue = (value || '').trim();
        
        // Só atualizar se o conteúdo for diferente
        // Comparar também com <p><br></p> que é o conteúdo vazio do Quill
        const isEmptyContent = currentContent === '' || currentContent === '<p><br></p>' || currentContent === '<p></p>';
        const isEmptyValue = newValue === '' || newValue === '<p><br></p>' || newValue === '<p></p>';
        
        if (currentContent !== newValue && !(isEmptyContent && isEmptyValue)) {
          // Usar setContents para atualizar o editor de forma mais confiável
          try {
            const delta = editor.clipboard.convert({ html: newValue });
            editor.setContents(delta, 'silent');
          } catch (error) {
            // Fallback: usar innerHTML diretamente se setContents falhar
            console.warn('Erro ao atualizar editor com setContents, usando fallback:', error);
            editor.root.innerHTML = newValue;
          }
        }
      }
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [value]);

  return (
    <div className="rich-text-editor">
      {label && (
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          {label}
        </label>
      )}
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <ReactQuill
          ref={quillRefCallback}
          theme="snow"
          value={value || ''}
          onChange={handleEditorChange}
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
