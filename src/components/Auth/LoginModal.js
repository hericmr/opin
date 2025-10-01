import React, { useState, useRef, useEffect } from 'react';
import { X, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { AuthService } from '../../services/authService';

const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);
  
  const passwordRef = useRef(null);

  // Limpar formulário quando modal abre/fecha
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
      setSuccess('');
      setShowPassword(false);
      
      // Focar no campo de senha
      setTimeout(() => {
        if (passwordRef.current) {
          passwordRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLocked) return;
    
    if (!password.trim()) {
      setError('Por favor, digite a senha');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await AuthService.authenticate(password);
      
      if (result.success) {
        AuthService.setToken(result.token);
        setSuccess('Login realizado com sucesso!');
        
        setTimeout(() => {
          onSuccess(result.user);
          onClose();
        }, 1000);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          setIsLocked(true);
          setLockTime(30);
          setError('Muitas tentativas. Aguarde 30 segundos.');
        } else {
          setError(result.error || 'Erro na autenticação');
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
    
    setPassword('');
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
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-gray-900 rounded-lg shadow-2xl border border-gray-800 max-w-sm w-full">
        {/* Header minimalista */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-medium text-gray-100">
            Acesso Administrativo
          </h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-800 rounded transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Campo de senha */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 bg-gray-800 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Digite sua senha..."
                  disabled={loading || isLocked}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-700 rounded transition-colors"
                  disabled={loading || isLocked}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              
              {/* Indicador visual de caracteres */}
              {password && (
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-xs text-gray-500">Caracteres:</span>
                  <div className="flex gap-1">
                    {password.split('').map((char, index) => (
                      <span key={index} className="text-lg font-mono text-gray-300">
                        {showPassword ? char : '•'}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 ml-2">
                    ({password.length})
                  </span>
                </div>
              )}
            </div>

            {/* Contador de tentativas */}
            {attempts > 0 && attempts < 3 && (
              <div className="text-sm text-orange-400">
                Tentativas: {attempts}/3
              </div>
            )}

            {/* Tempo de bloqueio */}
            {isLocked && (
              <div className="text-sm text-red-400">
                Bloqueado por {lockTime} segundos
              </div>
            )}

            {/* Mensagens */}
            {error && (
              <div className="flex items-center gap-2 p-2 bg-red-900/30 border border-red-700 rounded text-sm">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-red-300">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-2 bg-green-900/30 border border-green-700 rounded text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-green-300">{success}</span>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-3 py-2 border border-gray-600 text-gray-300 rounded hover:bg-gray-800 transition-colors text-sm"
                disabled={loading || isLocked}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center gap-2"
                disabled={loading || isLocked || !password.trim()}
              >
                {loading ? (
                  <>
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
