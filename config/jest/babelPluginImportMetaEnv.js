// Plugin Babel usado só nos testes: troca `import.meta` por `{ env: process.env }`,
// já que o Jest roda em CommonJS e o Vite não está presente para resolver import.meta.env.
module.exports = function babelPluginImportMetaEnv({ types: t }) {
  return {
    visitor: {
      MetaProperty(path) {
        if (path.node.meta.name !== 'import' || path.node.property.name !== 'meta') return;
        path.replaceWith(
          t.objectExpression([
            t.objectProperty(t.identifier('env'), t.memberExpression(t.identifier('process'), t.identifier('env'))),
          ])
        );
      },
    },
  };
};
