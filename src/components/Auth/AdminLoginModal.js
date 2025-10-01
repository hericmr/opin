import React, { useState, useEffect, useRef } from 'react';
import { X, Eye, EyeOff, Shield, AlertCircle, CheckCircle, Lock, User } from 'lucide-react';
import { AuthService } from '../../services/authService';

const AdminLoginModal = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  title = "Acesso Administrativo",
  subtitle = "Digite sua senha para continuar",
  showUserField = false,
  userPlaceholder = "Usuário",
  passwordPlaceholder = "Digite sua senha...",
  loginButtonText = "Entrar",
  cancelButtonText = "Cancelar",
  successMessage = "Login realizado com sucesso!",
  errorMessage = "Erro na autenticação",
  theme = "green" // green, blue, purple, red
}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);
  
  const passwordRef = useRef(null);
  const usernameRef = useRef(null);

  // Configurações de tema
  const themes = {
    green: {
      primary: 'bg-green-600 hover:bg-green-700',
      secondary: 'bg-green-100 text-green-600',
      border: 'border-green-200',
      focus: 'focus:ring-green-500 focus:border-green-500',
      success: 'bg-green-50 border-green-200 text-green-700'
    },
    blue: {
      primary: 'bg-blue-600 hover:bg-blue-700',
      secondary: 'bg-blue-100 text-blue-600',
      border: 'border-blue-200',
      focus: 'focus:ring-blue-500 focus:border-blue-500',
      success: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    purple: {
      primary: 'bg-purple-600 hover:bg-purple-700',
      secondary: 'bg-purple-100 text-purple-600',
      border: 'border-purple-200',
      focus: 'focus:ring-purple-500 focus:border-purple-500',
      success: 'bg-purple-50 border-purple-200 text-purple-700'
    },
    red: {
      primary: 'bg-red-600 hover:bg-red-700',
      secondary: 'bg-red-100 text-red-600',
      border: 'border-red-200',
      focus: 'focus:ring-red-500 focus:border-red-500',
      success: 'bg-red-50 border-red-200 text-red-700'
    }
  };

  const currentTheme = themes[theme] || themes.green;

  // Limpar formulário quando modal abre/fecha
  useEffect(() => {
    if (isOpen) {
      setFormData({ username: '', password: '' });
      setError('');
      setSuccess('');
      setShowPassword(false);
      
      // Focar no campo apropriado
      setTimeout(() => {
        if (showUserField && usernameRef.current) {
          usernameRef.current.focus();
        } else if (passwordRef.current) {
          passwordRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, showUserField]);

  // Verificar se está bloqueado
  useEffect(() => {
    if (isLocked && lockTime > 0) {
      const timer = setTimeout(() => {
        setLockTime(prev => prev - 1);
      }, 1000);
      
      if (lockTime === 1) {
        setIsLocked(false);
        setLockTime(0);
        setAttempts(0);
      }
      
      return () => clearTimeout(timer);
    }
  }, [isLocked, lockTime]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erros quando usuário digita
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLocked) return;
    
    // Validações
    if (showUserField && !formData.username.trim()) {
      setError('Por favor, digite o usuário');
      return;
    }
    
    if (!formData.password.trim()) {
      setError('Por favor, digite a senha');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await AuthService.authenticate(formData.password);
      
      if (result.success) {
        // Armazenar token
        AuthService.setToken(result.token);
        
        setSuccess(successMessage);
        
        // Aguardar um pouco para mostrar sucesso
        setTimeout(() => {
          onSuccess(result.user);
          onClose();
        }, 1000);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        // Bloquear após 3 tentativas
        if (newAttempts >= 3) {
          setIsLocked(true);
          setLockTime(30); // 30 segundos
          setError('Muitas tentativas. Aguarde 30 segundos.');
        } else {
          setError(result.error || errorMessage);
        }
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Erro interno. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    
    setFormData({ username: '', password: '' });
    setError('');
    setSuccess('');
    setShowPassword(false);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${currentTheme.secondary} rounded-lg`}>
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {title}
              </h2>
              <p className="text-sm text-gray-500">
                {subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Campo de usuário (opcional) */}
            {showUserField && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  {userPlaceholder}
                </label>
                <input
                  ref={usernameRef}
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${currentTheme.focus} transition-colors`}
                  placeholder={userPlaceholder}
                  disabled={loading || isLocked}
                  autoComplete="username"
                />
              </div>
            )}

            {/* Campo de senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Senha de Administrador
              </label>
              <div className="relative">
                <input
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg ${currentTheme.focus} transition-colors`}
                  placeholder={passwordPlaceholder}
                  disabled={loading || isLocked}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                  disabled={loading || isLocked}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Contador de tentativas */}
            {attempts > 0 && attempts < 3 && (
              <div className="text-sm text-orange-600">
                Tentativas: {attempts}/3
              </div>
            )}

            {/* Tempo de bloqueio */}
            {isLocked && (
              <div className="text-sm text-red-600">
                Bloqueado por {lockTime} segundos
              </div>
            )}

            {/* Mensagens */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className={`flex items-center gap-2 p-3 ${currentTheme.success} border rounded-lg`}>
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading || isLocked}
              >
                {cancelButtonText}
              </button>
              <button
                type="submit"
                className={`flex-1 px-4 py-3 ${currentTheme.primary} text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2`}
                disabled={loading || isLocked || !formData.password.trim()}
              >
                {loading ? (
                  <>
                    Verificando...
                  </>
                ) : (
                  loginButtonText
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Footer com informações de segurança */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Conexão segura com criptografia JWT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;
