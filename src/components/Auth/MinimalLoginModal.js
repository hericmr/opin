import React, { useState, useRef, useEffect } from 'react';
import { X, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { AuthService } from '../../services/authService';

const MinimalLoginModal = ({ isOpen, onClose, onSuccess }) => {
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
      setError('Digite a senha');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await AuthService.authenticate(password);
      
      if (result.success) {
        AuthService.setToken(result.token);
        setSuccess('Sucesso!');
        
        setTimeout(() => {
          onSuccess(result.user);
          onClose();
        }, 800);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          setIsLocked(true);
          setLockTime(30);
          setError('Bloqueado por 30s');
        } else {
          setError('Senha incorreta');
        }
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Erro interno');
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
      <div className="bg-gray-900 rounded-lg shadow-2xl border border-gray-800 max-w-xs w-full">
        {/* Header ultra minimalista */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <h3 className="text-base font-medium text-gray-100">
            Admin
          </h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-800 rounded transition-colors"
            disabled={loading}
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-3">
          <div className="space-y-3">
            {/* Campo de senha */}
            <div>
              <div className="relative">
                <input
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-8 bg-gray-800 border border-gray-600 rounded text-gray-100 placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                  placeholder="Senha..."
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
                    <EyeOff className="w-3 h-3 text-gray-400" />
                  ) : (
                    <Eye className="w-3 h-3 text-gray-400" />
                  )}
                </button>
              </div>
              
              {/* Indicador visual de caracteres - mais compacto */}
              {password && (
                <div className="mt-1 flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {password.split('').map((char, index) => (
                      <span key={index} className="text-sm font-mono text-gray-300">
                        {showPassword ? char : '•'}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">
                    {password.length}
                  </span>
                </div>
              )}
            </div>

            {/* Contador de tentativas - compacto */}
            {attempts > 0 && attempts < 3 && (
              <div className="text-xs text-orange-400">
                {attempts}/3 tentativas
              </div>
            )}

            {/* Tempo de bloqueio - compacto */}
            {isLocked && (
              <div className="text-xs text-red-400">
                Bloqueado: {lockTime}s
              </div>
            )}

            {/* Mensagens - compactas */}
            {error && (
              <div className="flex items-center gap-1 p-2 bg-red-900/30 border border-red-700 rounded text-xs">
                <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                <span className="text-red-300">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-1 p-2 bg-green-900/30 border border-green-700 rounded text-xs">
                <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                <span className="text-green-300">{success}</span>
              </div>
            )}

            {/* Botões - compactos */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-3 py-1.5 border border-gray-600 text-gray-300 rounded hover:bg-gray-800 transition-colors text-xs"
                disabled={loading || isLocked}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs flex items-center justify-center gap-1"
                disabled={loading || isLocked || !password.trim()}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    ...
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

export default MinimalLoginModal;
