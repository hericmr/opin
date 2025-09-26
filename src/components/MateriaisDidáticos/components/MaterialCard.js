import React from 'react';
import { ArrowRight, Users, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { TIPOS_MATERIAL } from '../../../constants/materiaisConstants';

const MaterialCard = ({ material, onClick }) => {
  const getTipoInfo = (tipo) => {
    return TIPOS_MATERIAL[tipo] || {
      label: 'Material Didático',
      cor: 'gray',
      icone: 'BookOpen'
    };
  };

  const tipoInfo = getTipoInfo(material.tipo || 'saberes_ancestrais');

  const handleClick = () => {
    if (onClick) {
      onClick(material);
    } else {
      // Navegação padrão para o painel da escola
      const slug = material.titulo?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      const basePath = window.location.pathname.includes('/opin') ? '/opin' : '';
      window.location.href = `${basePath}/?panel=${slug}`;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md p-5 cursor-pointer 
                 hover:shadow-lg transition-all duration-200 border border-gray-100"
    >
              {material.imagens && material.imagens.length > 0 && (
          <div className="mb-4">
            <img
              src={material.imagens[0]}
              alt={material.titulo}
              className="w-full h-48 object-cover rounded-lg shadow-sm"
              loading="lazy"
            />
          </div>
        )}
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${tipoInfo.cor}-100 text-${tipoInfo.cor}-800`}>
            {tipoInfo.label}
          </span>
          {material.povos_indigenas && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {material.povos_indigenas}
            </span>
          )}
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {material.titulo}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
          {material.descricao_detalhada?.replace(/<[^>]*>/g, '').substring(0, 120)}...
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {material.municipio}
            </span>
            {material.professores_indigenas && (
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {material.professores_indigenas} prof.
              </span>
            )}
          </div>
          <ArrowRight className="w-5 h-5 text-green-600" />
        </div>
      </div>
    </motion.div>
  );
};

export default MaterialCard;
