import React, { memo } from 'react';
import {
  Target,
  BookOpen,
  GraduationCap,
  Users,
  Heart,
  X,
} from 'lucide-react';
import InfoSection from '../InfoSection';

const ProjetosParcerias = memo(({ escola }) => {
  if (!escola) return null;

  // Verificar se há dados de projetos e parcerias
  const hasProjetosData = escola.projetos_andamento || 
                         escola.parcerias_universidades || 
                         escola.acoes_ongs || 
                         escola.desejos_comunidade || 
                         escola.parcerias_municipio;

  if (!hasProjetosData) return null;

  return (
    <InfoSection title="Projetos e Parcerias" icon={Target}>
      <div className="space-y-3">
        {escola.projetos_andamento && escola.projetos_andamento.trim() && (
          <div className="flex items-start gap-3 bg-white/80 rounded-lg p-3 border border-green-200">
            <BookOpen className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 mb-1">Projetos em andamento</div>
              {escola.projetos_andamento.trim().toLowerCase() === 'não' ? (
                <div className="text-sm text-gray-400 flex items-center gap-1">
                  <X className="w-4 h-4 text-gray-400" />
                  Não
                </div>
              ) : (
                <div className="text-sm text-gray-800 leading-relaxed">{escola.projetos_andamento}</div>
              )}
            </div>
          </div>
        )}
        
        {escola.parcerias_universidades && escola.parcerias_universidades.trim() && (
          <div className="flex items-start gap-3 bg-white/80 rounded-lg p-3 border border-green-200">
            <GraduationCap className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 mb-1">Parcerias com universidades</div>
              {escola.parcerias_universidades.trim().toLowerCase() === 'não' ? (
                <div className="text-sm text-gray-400 flex items-center gap-1">
                  <X className="w-4 h-4 text-gray-400" />
                  Não
                </div>
              ) : (
                <div className="text-sm text-gray-800 leading-relaxed">{escola.parcerias_universidades}</div>
              )}
            </div>
          </div>
        )}
        
        {escola.acoes_ongs && escola.acoes_ongs.trim() && (
          <div className="flex items-start gap-3 bg-white/80 rounded-lg p-3 border border-green-200">
            <Users className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 mb-1">Ações com ONGs ou coletivos</div>
              {escola.acoes_ongs.trim().toLowerCase() === 'não' ? (
                <div className="text-sm text-gray-400 flex items-center gap-1">
                  <X className="w-4 h-4 text-gray-400" />
                  Não
                </div>
              ) : (
                <div className="text-sm text-gray-800 leading-relaxed">{escola.acoes_ongs}</div>
              )}
            </div>
          </div>
        )}
        
        {escola.desejos_comunidade && escola.desejos_comunidade.trim() && (
          <div className="flex items-start gap-3 bg-white/80 rounded-lg p-3 border border-green-200">
            <Heart className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 mb-1">Desejos da comunidade para a escola</div>
              <div className="text-sm text-gray-800 leading-relaxed">{escola.desejos_comunidade}</div>
            </div>
          </div>
        )}
        
        {escola.parcerias_municipio && escola.parcerias_municipio.trim() && (
          <div className="flex items-start gap-3 bg-white/80 rounded-lg p-3 border border-green-200">
            <Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 mb-1">Parcerias com o município</div>
              {escola.parcerias_municipio.trim().toLowerCase() === 'não' ? (
                <div className="text-sm text-gray-400 flex items-center gap-1">
                  <X className="w-4 h-4 text-gray-400" />
                  Não
                </div>
              ) : (
                <div className="text-sm text-gray-800 leading-relaxed">{escola.parcerias_municipio}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </InfoSection>
  );
});

export default ProjetosParcerias; 