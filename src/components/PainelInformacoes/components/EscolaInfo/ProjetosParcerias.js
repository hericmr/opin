import React, { memo } from 'react';
import {
  Target,
  BookOpen,
  GraduationCap,
  Users,
  Heart,
  X,
  Check, // ✅ novo ícone adicionado
} from 'lucide-react';
import InfoSection from '../InfoSection';

const ProjectCard = ({ icon: Icon, label, value }) => {
  const isNegative = value?.trim().toLowerCase() === 'não';

  return (
    <div className="flex items-start gap-3 bg-white/80 rounded-lg p-2 border border-green-200">
      <Icon className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
        {isNegative ? (
          <div className="text-sm text-gray-400 flex items-center gap-1">
            <X className="w-4 h-4 text-gray-400" />
            Não
          </div>
        ) : (
          <div className="text-sm text-gray-800 leading-relaxed flex items-start gap-1">
            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>{value}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const ProjetosParcerias = memo(({ escola }) => {
  if (!escola) return null;

  const projectsData = [
    {
      field: 'projetos_andamento',
      icon: BookOpen,
      label: 'Projetos em andamento',
    },
    {
      field: 'parcerias_universidades',
      icon: GraduationCap,
      label: 'Parcerias com universidades',
    },
    {
      field: 'acoes_ongs',
      icon: Users,
      label: 'Ações com ONGs ou coletivos',
    },
    {
      field: 'desejos_comunidade',
      icon: Heart,
      label: 'Desejos da comunidade para a escola',
    },
    {
      field: 'parcerias_municipio',
      icon: Target,
      label: 'Parcerias com o município',
    },
  ];

  const availableProjects = projectsData.filter(
    project => escola[project.field] && escola[project.field].trim()
  );

  if (availableProjects.length === 0) return null;

  return (
    <InfoSection title="Projetos e Parcerias" icon={Target}>
      <div className="space-y-2">
        {availableProjects.map((project) => (
          <ProjectCard
            key={project.field}
            icon={project.icon}
            label={project.label}
            value={escola[project.field]}
          />
        ))}
      </div>
    </InfoSection>
  );
});

export default ProjetosParcerias;
