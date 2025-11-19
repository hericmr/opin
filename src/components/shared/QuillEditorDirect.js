import React, { useRef, useEffect, useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './QuillEditor.css';
import { uploadImage } from '../../services/uploadService';

/**
 * Editor Quill direto sem o wrapper react-quill
 * Compatível com React 19 e não depende de findDOMNode
 */
const QuillEditorDirect = ({ value, onChange, placeholder, label, style = {} }) => {
  const editorRef = useRef(null);
  const quillInstanceRef = useRef(null);
  const isInternalChange = useRef(false);
  const isInitializingRef = useRef(false); // Flag para prevenir inicialização duplicada
  const [isEditorReady, setIsEditorReady] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  // Handler customizado para upload de imagens
  const imageHandler = useCallback(async () => {
    if (!quillInstanceRef.current) {
      console.warn('Editor não está pronto ainda');
      return;
    }

    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      
      if (file && quillInstanceRef.current) {
        try {
          const range = quillInstanceRef.current.getSelection(true);
          
          if (range) {
            // Inserir placeholder de loading
            quillInstanceRef.current.insertEmbed(range.index, 'image', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
            
            // Fazer upload da imagem
            const imageUrl = await uploadImage(file);
            
            // Substituir placeholder pela imagem real
            quillInstanceRef.current.deleteText(range.index, 1);
            quillInstanceRef.current.insertEmbed(range.index, 'image', imageUrl);
            
            // Mover cursor para depois da imagem
            quillInstanceRef.current.setSelection(range.index + 1);
          }
        } catch (error) {
          console.error('Erro ao fazer upload da imagem:', error);
          alert('Erro ao fazer upload da imagem. Tente novamente.');
        }
      }
    };
  }, []);

  // Inicializar Quill quando o componente montar
  useEffect(() => {
    if (!editorRef.current) return;

    // Verificar se já está inicializando (previne duplicação em StrictMode)
    if (isInitializingRef.current) {
      return;
    }

    // Verificar se já existe uma instância do Quill neste elemento
    // Isso previne inicialização duplicada em React.StrictMode
    if (quillInstanceRef.current) {
      // Já existe uma instância, não criar outra
      return;
    }

    // Verificar se o elemento já tem uma instância do Quill (de uma renderização anterior)
    if (editorRef.current.__quill) {
      quillInstanceRef.current = editorRef.current.__quill;
      setIsEditorReady(true);
      return;
    }

    // Verificar se já existe uma toolbar do Quill no elemento (indica que já foi inicializado)
    if (editorRef.current.querySelector('.ql-toolbar')) {
      // Quill já foi inicializado neste elemento, não criar outra instância
      return;
    }

    // Marcar como inicializando
    isInitializingRef.current = true;

    try {
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
        'list',
        'align',
        'link', 'image'
      ];

      // Verificar novamente se não foi criado enquanto estávamos configurando
      if (editorRef.current.__quill) {
        quillInstanceRef.current = editorRef.current.__quill;
        setIsEditorReady(true);
        return;
      }

      // Criar instância do Quill
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules,
        formats,
        placeholder: placeholder || 'Digite aqui...'
      });

      // Armazenar referência tanto no ref quanto no elemento DOM
      quillInstanceRef.current = quill;
      editorRef.current.__quill = quill; // Armazenar também no elemento para evitar duplicação
      setIsEditorReady(true);
      isInitializingRef.current = false; // Marcar como inicializado

      // Handler para mudanças no editor
      quill.on('text-change', () => {
        if (!isInternalChange.current) {
          const content = quill.root.innerHTML;
          if (onChange) {
            // Chamar onChange com a mesma assinatura que react-quill usa
            onChange(content);
          }
        }
      });

      // Definir valor inicial se fornecido
      if (value) {
        isInternalChange.current = true;
        try {
          quill.clipboard.dangerouslyPasteHTML(value);
        } catch (e) {
          // Se falhar, tentar usar setContents
          try {
            const delta = quill.clipboard.convert({ html: value });
            quill.setContents(delta, 'silent');
          } catch (e2) {
            console.warn('Erro ao definir valor inicial:', e2);
          }
        }
        setTimeout(() => {
          isInternalChange.current = false;
        }, 0);
      }

    } catch (error) {
      console.error('Erro ao inicializar Quill:', error);
      setHasError(true);
      isInitializingRef.current = false; // Resetar flag em caso de erro
    }

    // Cleanup - apenas limpar referências, não destruir o Quill
    // O Quill será destruído quando o elemento DOM for removido
    return () => {
      // Não destruir o Quill aqui porque pode ser chamado duas vezes em StrictMode
      // Apenas limpar a referência se o elemento ainda existir
      if (editorRef.current && editorRef.current.__quill === quillInstanceRef.current) {
        // Manter a referência no elemento para reutilização
      } else {
        quillInstanceRef.current = null;
        setIsEditorReady(false);
      }
    };
  }, []); // Executar apenas uma vez quando o componente monta

  // Atualizar conteúdo quando value mudar externamente
  useEffect(() => {
    if (!quillInstanceRef.current || !isEditorReady) return;

    const currentContent = quillInstanceRef.current.root.innerHTML.trim();
    const newValue = (value || '').trim();
    
    // Só atualizar se o conteúdo for diferente
    const isEmptyContent = currentContent === '' || currentContent === '<p><br></p>' || currentContent === '<p></p>';
    const isEmptyValue = newValue === '' || newValue === '<p><br></p>' || newValue === '<p></p>';
    
    if (currentContent !== newValue && !(isEmptyContent && isEmptyValue) && !isInternalChange.current) {
      try {
        isInternalChange.current = true;
        // Usar setContents que é mais confiável
        try {
          const delta = quillInstanceRef.current.clipboard.convert({ html: newValue });
          quillInstanceRef.current.setContents(delta, 'silent');
        } catch (e) {
          // Fallback para dangerouslyPasteHTML
          quillInstanceRef.current.clipboard.dangerouslyPasteHTML(newValue);
        }
        setTimeout(() => {
          isInternalChange.current = false;
        }, 0);
      } catch (error) {
        console.warn('Erro ao atualizar conteúdo do editor:', error);
        isInternalChange.current = false;
      }
    }
  }, [value, isEditorReady]);

  if (hasError) {
    return (
      <div className="rich-text-editor">
        {label && (
          <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
            {label}
          </label>
        )}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="text-red-400 text-sm">
            Erro ao carregar o editor. Por favor, recarregue a página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rich-text-editor">
      {label && (
        <label className="block text-sm font-medium text-gray-200 mb-2 text-base">
          {label}
        </label>
      )}
      
      <div 
        className="bg-gray-800 border border-gray-700 rounded-lg" 
        style={{ minHeight: '300px', ...style }}
      >
        <div 
          ref={editorRef}
          style={{
            height: '300px',
            backgroundColor: '#1f2937',
            color: '#f3f4f6'
          }}
        />
      </div>
    </div>
  );
};

export default QuillEditorDirect;

