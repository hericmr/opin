import React from 'react';

// Skeleton para cards de escola
export const EscolaCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
    <div className="flex items-center space-x-3 mb-3">
      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-300 rounded"></div>
      <div className="h-3 bg-gray-300 rounded w-5/6"></div>
      <div className="h-3 bg-gray-300 rounded w-4/6"></div>
    </div>
  </div>
);

// Skeleton para painel de informações
export const PainelSkeleton = () => (
  <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      <div className="w-6 h-6 bg-gray-300 rounded"></div>
    </div>
    <div className="space-y-4">
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      <div className="h-4 bg-gray-300 rounded w-4/6"></div>
      <div className="h-32 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    </div>
  </div>
);

// Skeleton para mapa
export const MapaSkeleton = () => (
  <div className="relative h-screen w-full bg-gray-100 animate-pulse">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-32"></div>
      </div>
    </div>
  </div>
);


// Loading overlay para ações
export const LoadingOverlay = ({ isVisible, message = 'Carregando...' }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};

// Progress bar para uploads
export const ProgressBar = ({ progress, message }) => (
  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
    <div 
      className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-out"
      style={{ width: `${Math.min(progress, 100)}%` }}
    ></div>
  </div>
);

// Loading state para botões
export const LoadingButton = ({ 
  children, 
  loading, 
  loadingText = 'Carregando...', 
  disabled,
  className = '',
  ...props 
}) => (
  <button
    className={`relative ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    <span className={loading ? 'opacity-0' : 'opacity-100'}>
      {loading ? loadingText : children}
    </span>
  </button>
);

// Skeleton para lista de escolas
export const EscolaListSkeleton = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow p-4 animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Loading state para formulários
export const FormSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div>
      <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
      <div className="h-10 bg-gray-300 rounded"></div>
    </div>
    <div>
      <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
      <div className="h-20 bg-gray-300 rounded"></div>
    </div>
    <div>
      <div className="h-4 bg-gray-300 rounded w-1/5 mb-2"></div>
      <div className="h-10 bg-gray-300 rounded"></div>
    </div>
  </div>
);

const LoadingComponents = {
  EscolaCardSkeleton,
  PainelSkeleton,
  MapaSkeleton,
  LoadingOverlay,
  ProgressBar,
  LoadingButton,
  EscolaListSkeleton,
  FormSkeleton
};

export default LoadingComponents; 