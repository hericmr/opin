// Importar react-dom via default import para permitir patching de propriedades (se objeto não estiver congelado)
import ReactDOM from 'react-dom';

/**
 * Polyfill para findDOMNode que foi removido no React 19
 * Necessário para compatibilidade com react-quill 2.0.0
 * 
 * Este polyfill patcheia react-dom para adicionar findDOMNode de volta
 * usando uma implementação baseada em refs e propriedades internas do ReactQuill
 */
export const setupFindDOMNodePolyfill = () => {
  // Se findDOMNode já existe, não fazer nada
  if (ReactDOM.findDOMNode) {
    return;
  }

  // Implementação de findDOMNode usando refs
  // Esta é uma aproximação que funciona para react-quill
  const findDOMNodeImpl = function findDOMNode(componentOrElement) {
    // Se já é um elemento DOM, retornar diretamente
    if (componentOrElement && typeof componentOrElement.nodeType === 'number') {
      return componentOrElement;
    }

    // Se é null ou undefined
    if (!componentOrElement) {
      return null;
    }

    // Se é um componente React, tentar encontrar o elemento DOM
    if (componentOrElement) {
      // PRIMEIRO: Tentar encontrar através das referências que armazenamos no QuillEditor
      // Estas são as mais confiáveis porque são definidas explicitamente
      if (componentOrElement._domNode && typeof componentOrElement._domNode.nodeType === 'number') {
        return componentOrElement._domNode;
      }
      if (componentOrElement._quillRootElement && typeof componentOrElement._quillRootElement.nodeType === 'number') {
        return componentOrElement._quillRootElement;
      }
      if (componentOrElement._element && typeof componentOrElement._element.nodeType === 'number') {
        return componentOrElement._element;
      }

      // Tentar encontrar através de propriedades comuns do ReactQuill
      // ReactQuill geralmente armazena referências ao elemento DOM

      // Verificar se tem uma propriedade que é um elemento DOM
      const possibleProps = ['element', 'el', '_node', 'domNode', 'node'];
      for (const prop of possibleProps) {
        if (componentOrElement[prop] && typeof componentOrElement[prop].nodeType === 'number') {
          return componentOrElement[prop];
        }
      }

      // Se tem ref
      if (componentOrElement.ref) {
        if (typeof componentOrElement.ref === 'object' && componentOrElement.ref.current) {
          const current = componentOrElement.ref.current;
          if (current && typeof current.nodeType === 'number') {
            return current;
          }
          // Se o ref.current é um componente, tentar recursivamente
          if (current) {
            const found = findDOMNodeImpl(current);
            if (found) return found;
          }
        } else if (typeof componentOrElement.ref === 'function') {
          // Se ref é uma função, não podemos acessar diretamente
          // Mas podemos tentar outras propriedades
        }
      }

      // Tentar encontrar através do ReactQuill internals
      // ReactQuill pode ter uma referência ao editor que tem uma referência ao DOM
      if (componentOrElement.editor) {
        const editor = componentOrElement.editor;
        if (editor.root && typeof editor.root.nodeType === 'number') {
          return editor.root;
        }
        if (editor.container && typeof editor.container.nodeType === 'number') {
          return editor.container;
        }
      }

      // Tentar acessar através do getEditor() se disponível (método do ReactQuill)
      if (typeof componentOrElement.getEditor === 'function') {
        try {
          const editor = componentOrElement.getEditor();
          if (editor && editor.root && typeof editor.root.nodeType === 'number') {
            return editor.root;
          }
        } catch (e) {
          // Ignorar erros
        }
      }

      // IMPORTANTE: Para ReactQuill, tentar encontrar através do elemento raiz
      // ReactQuill renderiza um div com classe "quill" que contém o editor
      if (componentOrElement._reactInternalFiber || componentOrElement._reactInternalInstance) {
        // Tentar encontrar através do fiber
        let fiber = componentOrElement._reactInternalFiber || componentOrElement._reactInternalInstance;
        let depth = 0;
        const maxDepth = 10; // Limitar profundidade para evitar loops infinitos

        while (fiber && depth < maxDepth) {
          if (fiber.stateNode) {
            // Se stateNode é um elemento DOM, retornar
            if (typeof fiber.stateNode.nodeType === 'number') {
              return fiber.stateNode;
            }
            // Se stateNode tem um elemento DOM dentro (como ReactQuill)
            if (fiber.stateNode && typeof fiber.stateNode === 'object') {
              // Tentar encontrar elemento com classe "quill" (ReactQuill)
              if (typeof document !== 'undefined') {
                const quillElement = document.querySelector('.quill');
                if (quillElement && quillElement.parentElement === fiber.stateNode) {
                  return quillElement;
                }
              }
            }
          }

          // Navegar pela árvore de fiber
          if (fiber.child) {
            fiber = fiber.child;
            depth++;
          } else if (fiber.sibling) {
            fiber = fiber.sibling;
          } else {
            fiber = fiber.return;
            depth++;
          }
        }
      }

      // Para ReactQuill especificamente: tentar encontrar através do elemento raiz
      // ReactQuill armazena o elemento em this.quill ou this.editor
      if (componentOrElement.quill && componentOrElement.quill.root) {
        return componentOrElement.quill.root;
      }

      // Tentar encontrar através do editor se disponível
      if (componentOrElement.editor && componentOrElement.editor.root) {
        return componentOrElement.editor.root;
      }

      // Tentar encontrar através do elemento raiz do ReactQuill
      // ReactQuill pode ter uma referência ao elemento DOM em _element ou similar
      if (componentOrElement._element && typeof componentOrElement._element.nodeType === 'number') {
        return componentOrElement._element;
      }

      // Tentar encontrar através de _domNode (armazenado pelo QuillEditor)
      if (componentOrElement._domNode && typeof componentOrElement._domNode.nodeType === 'number') {
        return componentOrElement._domNode;
      }

      // Tentar encontrar através da referência _quillRootElement que adicionamos no QuillEditor
      if (componentOrElement._quillRootElement && typeof componentOrElement._quillRootElement.nodeType === 'number') {
        return componentOrElement._quillRootElement;
      }

      // Tentar encontrar através do editor.root se disponível
      if (componentOrElement.getEditor && typeof componentOrElement.getEditor === 'function') {
        try {
          const editor = componentOrElement.getEditor();
          if (editor && editor.root) {
            // Retornar o elemento pai do root (o container .quill)
            const parent = editor.root.parentElement;
            if (parent && parent.classList && parent.classList.contains('quill')) {
              return parent;
            }
            return editor.root;
          }
        } catch (e) {
          // Ignorar erros
        }
      }

      // Para ReactQuill: tentar encontrar o elemento .quill no DOM
      // Isso funciona quando o componente já foi renderizado
      if (typeof document !== 'undefined') {
        // Primeiro, tentar encontrar através das referências armazenadas
        // Se temos _domNode, _quillRootElement ou _element, usar eles
        if (componentOrElement._domNode || componentOrElement._quillRootElement || componentOrElement._element) {
          const element = componentOrElement._domNode || componentOrElement._quillRootElement || componentOrElement._element;
          if (element && typeof element.nodeType === 'number') {
            return element;
          }
        }

        // Se não encontramos através das referências, buscar no DOM
        // Buscar elementos quill que foram criados recentemente
        const quillElements = Array.from(document.querySelectorAll('.quill'));
        if (quillElements.length > 0) {
          // Tentar encontrar o elemento quill que está dentro do container mais próximo
          // ou retornar o último elemento quill (provavelmente o mais recente)
          const lastQuill = quillElements[quillElements.length - 1];

          // Verificar se este elemento quill está relacionado ao componente
          // procurando por um container pai que possa estar relacionado
          return lastQuill;
        }
      }
    }

    // Fallback: retornar null (comportamento padrão)
    return null;
  };

  // Patchear react-dom
  try {
    // Tentar definir diretamente se possível
    ReactDOM.findDOMNode = findDOMNodeImpl;
  } catch (e) {
    console.warn('Falha ao definir ReactDOM.findDOMNode diretamente:', e);
    // Tentar Object.defineProperty como fallback
    try {
      Object.defineProperty(ReactDOM, 'findDOMNode', {
        value: findDOMNodeImpl,
        writable: true,
        configurable: true,
      });
    } catch (e2) {
      console.warn('Não foi possível patchear ReactDOM.findDOMNode:', e2);
    }
  }

  // Patchear no módulo global também (para garantir que todas as importações vejam)
  if (typeof window !== 'undefined') {
    window.__REACT_DOM_FIND_DOM_NODE__ = findDOMNodeImpl;
  }
};

// Executar o polyfill imediatamente quando o módulo for carregado
// Isso garante que o patch aconteça antes de qualquer outro código executar
setupFindDOMNodePolyfill();

