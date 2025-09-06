# 🔐 Componentes de Modal de Login - OPIN

## 📋 Visão Geral

Criados componentes modulares e reutilizáveis para autenticação segura com diferentes níveis de personalização.

## 🧩 Componentes Criados

### 1. **Modal Base** (`src/components/shared/Modal.js`)
Componente base reutilizável para todos os tipos de modal.

**Características:**
- ✅ Suporte a diferentes tamanhos (sm, md, lg, xl)
- ✅ Temas configuráveis (default, success, warning, error)
- ✅ Fechamento por ESC ou clique no overlay
- ✅ Ícone personalizável no header
- ✅ Acessibilidade completa

### 2. **LoginForm** (`src/components/Auth/LoginForm.js`)
Formulário de login puro, sem modal.

**Características:**
- ✅ Campo de senha com mostrar/ocultar
- ✅ Campo de usuário opcional
- ✅ Proteção contra força bruta (3 tentativas)
- ✅ Bloqueio temporário (30 segundos)
- ✅ Temas configuráveis (green, blue, purple, red)
- ✅ Validação em tempo real

### 3. **LoginModal** (`src/components/Auth/LoginModal.js`)
Modal de login simples com tema dark.

**Características:**
- ✅ **Tema dark** igual ao painel de edição
- ✅ Interface limpa e profissional
- ✅ Integração com AuthService
- ✅ Feedback visual de sucesso/erro
- ✅ Indicador visual de caracteres digitados
- ✅ Proteção contra força bruta

### 4. **MinimalLoginModal** (`src/components/Auth/MinimalLoginModal.js`) - **⭐ RECOMENDADO**
Modal ultra minimalista com tema dark.

**Características:**
- ✅ **Tema dark** igual ao painel de edição
- ✅ Interface ultra compacta
- ✅ Indicador visual de caracteres (••••)
- ✅ Proteção contra força bruta
- ✅ Bloqueio temporário
- ✅ Mensagens compactas
- ✅ Botões pequenos
- ✅ Máxima simplicidade

### 5. **AdminLoginModal** (`src/components/Auth/AdminLoginModal.js`)
Modal de login avançado com recursos extras.

**Características:**
- ✅ Campo de usuário opcional
- ✅ Proteção contra força bruta
- ✅ Bloqueio temporário
- ✅ Contador de tentativas
- ✅ Temas personalizáveis
- ✅ Textos customizáveis
- ✅ Validação robusta

## 🚀 Como Usar

### Uso Minimalista (MinimalLoginModal) - **RECOMENDADO**
```jsx
import MinimalLoginModal from '../components/Auth/MinimalLoginModal';

const [showLogin, setShowLogin] = useState(false);

<MinimalLoginModal
  isOpen={showLogin}
  onClose={() => setShowLogin(false)}
  onSuccess={(user) => {
    console.log('Login realizado:', user);
    // Redirecionar ou atualizar estado
  }}
/>
```

### Uso Básico (LoginModal)
```jsx
import LoginModal from '../components/Auth/LoginModal';

const [showLogin, setShowLogin] = useState(false);

<LoginModal
  isOpen={showLogin}
  onClose={() => setShowLogin(false)}
  onSuccess={(user) => {
    console.log('Login realizado:', user);
    // Redirecionar ou atualizar estado
  }}
/>
```

### Uso Avançado (AdminLoginModal)
```jsx
import AdminLoginModal from '../components/Auth/AdminLoginModal';

<AdminLoginModal
  isOpen={showLogin}
  onClose={() => setShowLogin(false)}
  onSuccess={(user) => handleLoginSuccess(user)}
  title="Acesso Administrativo"
  subtitle="Digite suas credenciais"
  theme="blue"
  showUserField={true}
  loginButtonText="Entrar"
/>
```

### Uso Personalizado (Modal + LoginForm)
```jsx
import Modal from '../components/shared/Modal';
import LoginForm from '../components/Auth/LoginForm';

<Modal
  isOpen={showLogin}
  onClose={() => setShowLogin(false)}
  title="Configurações"
  icon={<Settings className="w-6 h-6" />}
  theme="warning"
  size="lg"
>
  <LoginForm
    onSuccess={handleSuccess}
    theme="purple"
    showUserField={true}
  />
</Modal>
```

## 🎨 Temas Disponíveis

### Modal Base
- `default` - Cinza neutro
- `success` - Verde para sucesso
- `warning` - Amarelo para avisos
- `error` - Vermelho para erros

### LoginForm/AdminLoginModal
- `green` - Verde (padrão)
- `blue` - Azul
- `purple` - Roxo
- `red` - Vermelho

## 🔒 Recursos de Segurança

### Proteção contra Força Bruta
- Máximo 3 tentativas
- Bloqueio de 30 segundos após 3 tentativas
- Contador visual de tentativas

### Indicador Visual de Caracteres
- Mostra `••••` para cada caractere digitado
- Alterna entre `•` e caractere real com botão olho
- Contador de caracteres em tempo real
- Feedback visual imediato
- **Tema dark** com cores `gray-300` para caracteres

### Validação
- Senha obrigatória
- Usuário obrigatório (se habilitado)
- Limpeza automática de erros ao digitar

### UX Segura
- Feedback visual claro
- Estados de loading
- Prevenção de múltiplos envios
- Acessibilidade completa

## 📁 Estrutura de Arquivos

```
src/components/
├── shared/
│   └── Modal.js                 ← Modal base reutilizável
└── Auth/
    ├── MinimalLoginModal.js    ← Modal ultra minimalista ⭐
    ├── LoginModal.js           ← Modal simples
    ├── AdminLoginModal.js      ← Modal avançado
    ├── LoginForm.js            ← Formulário puro
    └── ProtectedRoute.js       ← Proteção de rotas
```

## 🔧 Configuração

Os componentes usam automaticamente o `AuthService` configurado. Certifique-se de ter as variáveis de ambiente:

```env
REACT_APP_ADMIN_PASSWORD=sua_senha
REACT_APP_JWT_SECRET=sua_chave_jwt
```

## ✅ Benefícios

1. **Modularidade** - Componentes independentes e reutilizáveis
2. **Flexibilidade** - Múltiplas opções de personalização
3. **Segurança** - Proteção contra ataques comuns
4. **UX** - Interface intuitiva e responsiva
5. **Acessibilidade** - Suporte completo a screen readers
6. **Manutenibilidade** - Código limpo e bem estruturado

---

**Os componentes estão prontos para uso em qualquer parte da aplicação!** 🚀
