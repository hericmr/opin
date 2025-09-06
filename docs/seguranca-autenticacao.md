# 🔐 Sistema de Segurança e Autenticação - OPIN

## 📋 Visão Geral

O sistema de autenticação do OPIN foi completamente reformulado para usar **JWT (JSON Web Tokens)** com criptografia segura, substituindo o sistema anterior baseado apenas em senha simples.

## 🛡️ Melhorias de Segurança Implementadas

### 1. **Autenticação JWT**
- ✅ Tokens criptografados com algoritmo HS256
- ✅ Expiração automática (24 horas)
- ✅ Renovação automática quando próximo do vencimento
- ✅ Verificação de integridade e autenticidade

### 2. **Interface de Login Segura**
- ✅ Modal dedicado com validação
- ✅ Campo de senha com opção de mostrar/ocultar
- ✅ Feedback visual de erro/sucesso
- ✅ Prevenção de ataques de força bruta

### 3. **Proteção de Rotas**
- ✅ Componente `ProtectedRoute` para áreas restritas
- ✅ Verificação automática de autenticação
- ✅ Redirecionamento seguro para login
- ✅ Estado de loading durante verificação

### 4. **Gerenciamento de Estado**
- ✅ Hook `useAuth` para controle centralizado
- ✅ Verificação periódica de autenticação
- ✅ Logout automático em caso de token inválido
- ✅ Persistência segura no localStorage

## 🔧 Configuração

### Variáveis de Ambiente Necessárias

Crie um arquivo `.env.local` na raiz do projeto com:

```env
# Senha de administrador (obrigatória)
REACT_APP_ADMIN_PASSWORD=sua_senha_segura_aqui

# Chave secreta para JWT (obrigatória)
# Use uma chave forte de pelo menos 32 caracteres
REACT_APP_JWT_SECRET=sua_chave_jwt_super_secreta_de_pelo_menos_32_caracteres
```

### Exemplo de Configuração Segura

```env
REACT_APP_ADMIN_PASSWORD=MinhaSenh@SuperSegura2024!
REACT_APP_JWT_SECRET=opin-jwt-secret-key-2024-ultra-secure-32-chars-minimum
```

## 📁 Arquivos Criados/Modificados

### Novos Arquivos
- `src/services/authService.js` - Serviço de autenticação JWT
- `src/components/Auth/LoginModal.js` - Modal de login seguro
- `src/components/Auth/ProtectedRoute.js` - Proteção de rotas
- `src/hooks/useAuth.js` - Hook de gerenciamento de autenticação

### Arquivos Modificados
- `src/components/Navbar/index.js` - Integração com novo sistema
- `src/components/AdminPanel/index.js` - Proteção com ProtectedRoute

## 🚀 Como Usar

### 1. **Primeiro Acesso**
1. Configure as variáveis de ambiente
2. Acesse o site
3. Clique no ícone de folha (🌿) na navbar
4. Digite a senha configurada
5. Será redirecionado automaticamente para o painel admin

### 2. **Sessão Ativa**
- Token válido por 24 horas
- Renovação automática nas últimas 2 horas
- Botão "Sair" disponível na navbar
- Verificação automática a cada 5 minutos

### 3. **Proteção Automática**
- Todas as rotas `/admin` são protegidas
- Redirecionamento automático para login
- Verificação de token em tempo real

## 🔒 Recursos de Segurança

### Criptografia
- **Algoritmo**: HS256 (HMAC com SHA-256)
- **Chave**: Configurável via variável de ambiente
- **Expiração**: 24 horas (configurável)
- **Audience/Issuer**: Validação adicional

### Validação
- Verificação de integridade do token
- Validação de expiração
- Verificação de audience e issuer
- Tratamento de erros robusto

### UX Segura
- Feedback visual claro
- Prevenção de múltiplas tentativas
- Logout automático em caso de erro
- Interface responsiva e acessível

## ⚠️ Considerações de Segurança

### Em Produção
1. **Use senhas fortes** (mínimo 12 caracteres, números, símbolos)
2. **Configure JWT_SECRET forte** (mínimo 32 caracteres aleatórios)
3. **Use HTTPS** em produção
4. **Monitore tentativas de login** suspeitas
5. **Implemente rate limiting** se necessário

### Backup e Recuperação
- Mantenha backup seguro das variáveis de ambiente
- Documente o processo de recuperação de acesso
- Considere implementar múltiplos administradores

## 🐛 Troubleshooting

### Problemas Comuns

**Token expirado**
- Solução: Faça login novamente
- O sistema detecta automaticamente e solicita reautenticação

**Erro de autenticação**
- Verifique as variáveis de ambiente
- Confirme se a senha está correta
- Verifique o console para erros detalhados

**Problemas de localStorage**
- Limpe o localStorage do navegador
- Verifique se cookies estão habilitados
- Teste em modo incógnito

## 📈 Próximos Passos

### Melhorias Futuras
- [ ] Implementar múltiplos usuários/roles
- [ ] Adicionar autenticação de dois fatores (2FA)
- [ ] Implementar rate limiting
- [ ] Adicionar logs de auditoria
- [ ] Integração com OAuth (Google, Microsoft)

### Monitoramento
- [ ] Logs de tentativas de login
- [ ] Alertas de segurança
- [ ] Métricas de uso
- [ ] Dashboard de administração

---

**⚠️ IMPORTANTE**: Mantenha as variáveis de ambiente seguras e nunca as commite no repositório!
