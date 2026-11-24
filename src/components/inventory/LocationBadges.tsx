import React from 'react';
import type { StorageLocation } from '../../types';
import { Archive, Bed, Footprints, Shirt, Sparkles } from 'lucide-react';

interface LocationBadgeProps {
  location?: StorageLocation;
  locationName?: string;
  className?: string;
}

export const LocationBadge: React.FC<LocationBadgeProps> = ({
  location,
  locationName,
  className = '',
}) => {
  const name = location ? location.name : locationName || 'Estoque Geral';
  const type = location ? location.type : 'outro';

  const getStyle = () => {
    switch (type) {
      case 'box':
        return {
          icon: <Bed className="h-3 w-3 text-indigo-600" />,
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        };
      case 'caixa_sapatos':
        return {
          icon: <Footprints className="h-3 w-3 text-pink-700" />,
          bg: 'bg-pink-50 text-pink-900 border-pink-200',
        };
      case 'caixa_roupas':
        return {
          icon: <Shirt className="h-3 w-3 text-pink-700" />,
          bg: 'bg-pink-50 text-pink-900 border-pink-200',
        };
      case 'arara':
        return {
          icon: <Sparkles className="h-3 w-3 text-purple-700" />,
          bg: 'bg-purple-50 text-purple-900 border-purple-200',
        };
      default:
        return {
          icon: <Archive className="h-3 w-3 text-stone-600" />,
          bg: 'bg-stone-100 text-stone-800 border-stone-200',
        };
    }
  };

  const style = getStyle();

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${style.bg} ${className}`}
    >
      {style.icon}
      <span>{name}</span>
    </span>
  );
};

