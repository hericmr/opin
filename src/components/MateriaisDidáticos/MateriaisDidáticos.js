import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import PageHeader from '../PageHeader';

const MateriaisDidáticos = () => {
  // Breadcrumbs de Navegação
  const breadcrumbs = [
    { label: 'Início', path: '/', active: false },
    { label: 'Materiais Didáticos', path: '/conteudo', active: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 relative">
      {/* Cabeçalho com design indígena - Hero image começa do topo */}
      <PageHeader
        title="Materiais Didaticos"
        titleSize="text-3xl md:text-4xl lg:text-5xl"
        descriptionSize="text-base md:text-lg"
        description="Conteúdos produzidos por professores indígenas sobre línguas, histórias, plantas medicinais, cantos e jogos."
      />
      
      {/* Conteúdo principal com espaçamento para o hero - será ajustado dinamicamente */}
      <div className="relative z-10 hero-content-spacer" style={{ marginTop: '300px' }}>
        {/* Breadcrumbs de Navegação */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && (
                    <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                  )}
                  {crumb.path ? (
                    <button
                      onClick={() => window.location.href = crumb.path}
                      className="text-gray-600 hover:text-green-700 transition-colors"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className={`font-medium ${crumb.active ? 'text-green-700' : 'text-gray-900'}`}>
                      {crumb.label}
                    </span>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Mensagem de desenvolvimento */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Página em Desenvolvimento
            </h2>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default MateriaisDidáticos;