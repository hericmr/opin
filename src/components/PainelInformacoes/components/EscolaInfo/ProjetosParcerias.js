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

const ProjectCard = ({ icon: Icon, label, value }) => {
  const isNegative = value?.trim().toLowerCase() === 'não';

  return (
    <div className="bg-green-50 hover:bg-green-100 rounded-lg p-5 transition-all duration-200 hover:shadow-sm min-h-[120px] flex flex-col">
      <div className="flex items-start gap-4 flex-1">
        <Icon className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0 flex flex-col space-y-4">
          <div className="text-sm font-medium text-gray-700 flex-shrink-0">{label}</div>
          <div className="flex-1 flex items-start">
            {isNegative ? (
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
                Não
              </div>
            ) : (
              <div className="text-sm text-gray-800 leading-relaxed break-words">
                {value}
              </div>
            )}
          </div>
        </div>
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
      <div className="grid grid-cols-1 gap-6 items-stretch">
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
