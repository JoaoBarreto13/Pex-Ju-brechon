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
          icon: <Bed className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />,
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60',
        };
      case 'caixa_sapatos':
        return {
          icon: <Footprints className="h-3 w-3 text-pink-700 dark:text-pink-400" />,
          bg: 'bg-pink-50 text-pink-900 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800/60',
        };
      case 'caixa_roupas':
        return {
          icon: <Shirt className="h-3 w-3 text-pink-700 dark:text-pink-400" />,
          bg: 'bg-pink-50 text-pink-900 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800/60',
        };
      case 'arara':
        return {
          icon: <Sparkles className="h-3 w-3 text-purple-700 dark:text-purple-400" />,
          bg: 'bg-purple-50 text-purple-900 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60',
        };
      default:
        return {
          icon: <Archive className="h-3 w-3 text-stone-600 dark:text-zinc-400" />,
          bg: 'bg-stone-100 text-stone-800 border-stone-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700',
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

