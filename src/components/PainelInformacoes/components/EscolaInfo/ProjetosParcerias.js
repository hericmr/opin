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
    <div className="flex items-start gap-4 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="mt-1">
        <Icon className="w-5 h-5 text-green-600 flex-shrink-0" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="text-sm font-semibold text-gray-800">{label}</div>
        {isNegative ? (
          <div className="text-sm text-gray-400 flex items-center gap-1">
            <X className="w-4 h-4 text-gray-400" />
            Não
          </div>
        ) : (
          <div className="text-sm text-gray-700 leading-relaxed">
            {value}
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
      <div className="grid grid-cols-1 gap-3 [&>*]:bg-green-100">
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
