import React, { memo } from 'react';
import {
  Home,
  Droplet,
  Trash2,
  Wifi,
  Monitor,
  MapPin,
  Utensils,
  Apple,
  ChefHat,
} from 'lucide-react';
import InfoSection from '../InfoSection';
import BooleanValue from '../BooleanValue';
import NativeLandCard from '../NativeLandCard';

// Helper function to check if a value is empty
const isEmptyValue = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (typeof value === 'number' && isNaN(value)) return true;
  // Keep 0, false, and React elements as valid
  if (typeof value === 'number') return false;
  if (typeof value === 'boolean') return false;
  if (React.isValidElement(value)) return false;
  return false;
};

// Helper function to check if a card has long content
const hasLongContent = (value) => {
  if (!value) return false;
  if (React.isValidElement(value)) return false; // React elements are not long text
  if (typeof value === 'string') {
    const trimmed = value.trim();
    // Verifica se tem mais de 30 caracteres OU se tem vírgulas (lista de itens)
    return trimmed.length > 30 || (trimmed.includes(',') && trimmed.length > 20);
  }
  return false;
};

// Helper function to get grid columns based on item count
const getGridCols = (count) => {
  if (count === 0) return 'grid-cols-1';
  if (count === 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-2';
  return 'grid-cols-3 lg:grid-cols-3';
};

const Infraestrutura = memo(({ escola }) => {
  if (!escola) return null;

  // Adicionar espaço escolar como primeiro item se existir
  const allItems = [];
  
  if (escola.espaco_escolar && !isEmptyValue(escola.espaco_escolar)) {
    allItems.push({
      icon: Home,
      label: 'Espaço Escolar e Estrutura',
      value: escola.espaco_escolar,
    });
  }

  const items = [
    {
      icon: Droplet,
      label: 'Acesso à Água',
      value: escola.acesso_agua,
    },
    {
      icon: Trash2,
      label: 'Coleta de Lixo',
      value: escola.coleta_lixo,
    },
    {
      icon: Wifi,
      label: 'Acesso à Internet',
      value: <BooleanValue value={escola.acesso_internet} />,
    },
    {
      icon: Monitor,
      label: 'Equipamentos Tecnológicos',
      value: escola.equipamentos,
    },
    {
      icon: MapPin,
      label: 'Modo de Acesso à Escola',
      value: escola.modo_acesso,
    },
    {
      icon: Utensils,
      label: 'Cozinha',
      value: <BooleanValue value={escola.cozinha} />,
    },
    {
      icon: Apple,
      label: 'Merenda Escolar',
      value: <BooleanValue value={escola.merenda_escolar} />,
    },
    {
      icon: ChefHat,
      label: 'Merenda Diferenciada',
      value: <BooleanValue value={escola.diferenciada} />,
    },
  ].filter(item => !isEmptyValue(item.value));

  // Combinar todos os itens
  const allItemsCombined = [...allItems, ...items];

  if (allItemsCombined.length === 0) return null;

  // Separar cards com muito conteúdo dos cards normais
  const longContentCards = allItemsCombined.filter(item => hasLongContent(item.value));
  const normalCards = allItemsCombined.filter(item => !hasLongContent(item.value));

  return (
    <InfoSection>
      {/* Cards com muito conteúdo - linha inteira (1 coluna) */}
      {longContentCards.length > 0 && (
        <div className="space-y-2">
          {longContentCards.map((item, idx) => (
            <NativeLandCard
              key={`long-${idx}`}
              icon={item.icon}
              label={item.label}
              value={item.value}
              showIconCircle={true}
            />
          ))}
        </div>
      )}
      
      {/* Cards normais - grid de 3 colunas */}
      {normalCards.length > 0 && (
        <div className={`grid ${getGridCols(normalCards.length)} gap-2 ${longContentCards.length > 0 ? 'mt-2' : ''} items-stretch overflow-visible`}>
          {normalCards.map((item, idx) => (
            <NativeLandCard
              key={`normal-${idx}`}
              icon={item.icon}
              label={item.label}
              value={item.value}
              showIconCircle={true}
            />
          ))}
        </div>
      )}
    </InfoSection>
  );
});

export default Infraestrutura;
