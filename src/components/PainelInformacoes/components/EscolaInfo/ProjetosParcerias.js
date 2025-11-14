import React, { memo } from 'react';
import {
  GraduationCap,
} from 'lucide-react';
import InfoSection from '../InfoSection';
import NativeLandCard from '../NativeLandCard';

const ProjetosParcerias = memo(({ escola }) => {
  if (!escola) return null;

  const projectsData = [
    {
      field: 'parcerias_universidades',
      icon: GraduationCap,
      label: 'Parcerias com universidades',
    },
  ];

  const availableProjects = projectsData.filter(
    project => escola[project.field] && escola[project.field].trim()
  );

  if (availableProjects.length === 0) return null;

  return (
    <InfoSection>
      <div className="grid grid-cols-1 gap-4 items-stretch overflow-visible" style={{ paddingTop: '12px', paddingLeft: '12px' }}>
        {availableProjects.map((project) => {
          const value = escola[project.field];
          const isNegative = value?.trim().toLowerCase() === 'não';
          
          return (
            <div key={project.field} className="relative mt-3">
              <NativeLandCard
                icon={project.icon}
                label={project.label}
                value={isNegative ? 'Não' : value}
                layout="vertical"
                showIconCircle={true}
                className="h-auto"
              />
            </div>
          );
        })}
      </div>
    </InfoSection>
  );
});

export default ProjetosParcerias;
