import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';

const EditLocationButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="w-full px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors text-sm group"
      onClick={() => navigate('/edit')}
      aria-label="Editar Locais"
    >
      <Edit className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
      <span className="flex-1 text-left">Editar Locais</span>
    </button>
  );
};

export default EditLocationButton; 