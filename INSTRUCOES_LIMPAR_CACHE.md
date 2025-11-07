# Instruções para Limpar Cache do Service Worker

## Problema
Se você ainda estiver vendo erros de `ChunkLoadError` após o deploy, pode ser necessário limpar o cache do Service Worker no navegador.

## Solução Automática
O Service Worker foi atualizado para a versão v3, que deve se atualizar automaticamente. Se o problema persistir, siga as instruções abaixo.

## Limpar Cache Manualmente

### Chrome/Edge:
1. Abra as Ferramentas de Desenvolvedor (F12)
2. Vá para a aba **Application**
3. No menu lateral, expanda **Service Workers**
4. Clique em **Unregister** para cada Service Worker listado
5. No menu lateral, expanda **Cache Storage**
6. Clique com o botão direito em cada cache e selecione **Delete**
7. Recarregue a página (Ctrl+Shift+R ou Cmd+Shift+R)

### Firefox:
1. Abra as Ferramentas de Desenvolvedor (F12)
2. Vá para a aba **Application** (ou **Armazenamento**)
3. No menu lateral, expanda **Service Workers**
4. Clique em **Unregister** para cada Service Worker
5. No menu lateral, expanda **Cache Storage**
6. Clique com o botão direito em cada cache e selecione **Delete All**
7. Recarregue a página (Ctrl+Shift+R ou Cmd+Shift+R)

### Safari:
1. Ative o menu Desenvolvedor: Preferências > Avançado > Mostrar menu Desenvolvedor
2. Abra as Ferramentas de Desenvolvedor (Cmd+Option+I)
3. Vá para a aba **Storage**
4. Limpe os caches manualmente
5. Recarregue a página (Cmd+Shift+R)

## Limpar Cache de Forma Simples (Todos os Navegadores)
1. Abra o site em uma janela anônima/privada
2. Ou limpe os dados do site:
   - Chrome: Configurações > Privacidade > Limpar dados de navegação > Selecionar o site
   - Firefox: Configurações > Privacidade > Limpar dados > Selecionar o site
   - Safari: Preferências > Privacidade > Gerenciar dados do site

## O que foi corrigido no Service Worker v3:
- ✅ Garante que sempre retorna uma Response válida (nunca undefined)
- ✅ Não cacheia arquivos com hash (JS/CSS) porque mudam a cada build
- ✅ Melhora tratamento de erros 404
- ✅ Limpa automaticamente caches antigos ao atualizar
- ✅ Atualiza versão do cache para forçar limpeza

