import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { AuthService } from '../../services/authService';

const LoginForm = ({ 
  onSuccess,
  onError,
  showUserField = false,
  userPlaceholder = "Usuário",
  passwordPlaceholder = "Digite sua senha...",
  loginButtonText = "Entrar",
  theme = "green"
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
      primary: 'bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:border-green-500',
      success: 'bg-green-50 border-green-200 text-green-700'
    },
    blue: {
      primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:border-blue-500',
      success: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    purple: {
      primary: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:border-purple-500',
      success: 'bg-purple-50 border-purple-200 text-purple-700'
    },
    red: {
      primary: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:border-red-500',
      success: 'bg-red-50 border-red-200 text-red-700'
    }
  };

  const currentTheme = themes[theme] || themes.green;

  // Focar no campo apropriado quando componente monta
  useEffect(() => {
    setTimeout(() => {
      if (showUserField && usernameRef.current) {
        usernameRef.current.focus();
      } else if (passwordRef.current) {
        passwordRef.current.focus();
      }
    }, 100);
  }, [showUserField]);

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
        
        setSuccess('Login realizado com sucesso!');
        
        // Chamar callback de sucesso
        if (onSuccess) {
          setTimeout(() => {
            onSuccess(result.user);
          }, 1000);
        }
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        // Bloquear após 3 tentativas
        if (newAttempts >= 3) {
          setIsLocked(true);
          setLockTime(30); // 30 segundos
          setError('Muitas tentativas. Aguarde 30 segundos.');
        } else {
          setError(result.error || 'Erro na autenticação');
        }
        
        // Chamar callback de erro
        if (onError) {
          onError(result.error || 'Erro na autenticação');
        }
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Erro interno. Tente novamente.');
      
      if (onError) {
        onError('Erro interno. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // const resetForm = () => {
  //   setFormData({ username: '', password: '' });
  //   setError('');
  //   setSuccess('');
  //   setShowPassword(false);
  //   setAttempts(0);
  //   setIsLocked(false);
  //   setLockTime(0);
  // }; // Removido - não utilizado

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
              className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors`}
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
          
          {/* Indicador visual de caracteres */}
          {formData.password && (
            <div className="mt-2 flex items-center gap-1">
              <span className="text-xs text-gray-500">Caracteres:</span>
              <div className="flex gap-1">
                {formData.password.split('').map((char, index) => (
                  <span key={index} className="text-lg font-mono text-gray-600">
                    {showPassword ? char : '•'}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-400 ml-2">
                ({formData.password.length})
              </span>
            </div>
          )}
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

        {/* Botão de submit */}
        <button
          type="submit"
          className={`w-full px-4 py-3 ${currentTheme.primary} text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2`}
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
      </form>

      {/* Informações de segurança */}
      <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
        <Lock className="w-4 h-4" />
        <span>Conexão segura com criptografia JWT</span>
      </div>
    </div>
  );
};

export default LoginForm;
