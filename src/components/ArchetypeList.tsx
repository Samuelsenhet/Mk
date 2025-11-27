import React from 'react';
import { Badge } from './ui/badge';

interface ArchetypeListProps {
  archetypes: string[];
  layout?: 'vertical' | 'horizontal' | 'grid';
  size?: 'small' | 'medium' | 'large';
}

export function ArchetypeList({ 
  archetypes, 
  layout = 'grid', 
  size = 'medium' 
}: ArchetypeListProps) {
  const getArchetypeColor = (archetype: string) => {
    if (archetype.includes('Emotionell')) {
      return 'bg-pink-100 text-pink-800 border-pink-200';
    }
    if (archetype.includes('Intellektuell')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (archetype.includes('Fysisk')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (archetype.includes('Andlig')) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getLayoutClass = () => {
    switch (layout) {
      case 'vertical':
        return 'flex flex-col gap-1';
      case 'horizontal':
        return 'flex flex-wrap gap-1';
      case 'grid':
        return 'grid grid-cols-2 gap-1';
      default:
        return 'grid grid-cols-2 gap-1';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'text-xs px-2 py-1';
      case 'large':
        return 'text-sm px-4 py-2';
      default:
        return 'text-xs px-3 py-1.5';
    }
  };

  return (
    <div className={getLayoutClass()}>
      {archetypes.map((archetype, index) => (
        <Badge
          key={index}
          className={`
            ${getArchetypeColor(archetype)} 
            ${getSizeClass()}
            font-medium border rounded-lg text-center
            hover:scale-105 transition-transform duration-200
          `}
        >
          {archetype}
        </Badge>
      ))}
    </div>
  );
}