// Usar Quill diretamente em vez de react-quill para compatibilidade com React 19
// Isso evita problemas com findDOMNode que foi removido no React 19
import QuillEditorDirect from './QuillEditorDirect';

// Re-exportar como QuillEditor para manter compatibilidade com código existente
const QuillEditor = (props) => {
  return <QuillEditorDirect {...props} />;
};

export default QuillEditor;
