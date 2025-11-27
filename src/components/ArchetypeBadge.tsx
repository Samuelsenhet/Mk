import React from 'react';
import { Badge } from './ui/badge';

export interface ArchetypeData {
  type: string;
  name: string;
  emotional: string;
  intellectual: string;
  social: string;
  lifestyle: string;
}

interface ArchetypeBadgeProps {
  archetype: ArchetypeData;
  size?: 'small' | 'medium' | 'large';
  variant?: 'full' | 'compact' | 'minimal';
}

const ARCHETYPE_COLORS = {
  'Diplomater': {
    primary: 'bg-blue-500',
    secondary: 'bg-blue-100 text-blue-800',
    gradient: 'from-blue-400 to-blue-600'
  },
  'Byggare': {
    primary: 'bg-green-500',
    secondary: 'bg-green-100 text-green-800',
    gradient: 'from-green-400 to-green-600'
  },
  'Upptäckare': {
    primary: 'bg-purple-500',
    secondary: 'bg-purple-100 text-purple-800',
    gradient: 'from-purple-400 to-purple-600'
  },
  'Strateger': {
    primary: 'bg-red-500',
    secondary: 'bg-red-100 text-red-800',
    gradient: 'from-red-400 to-red-600'
  }
} as const;

const EMOTIONAL_COLORS = {
  'Vårdande': 'bg-pink-100 text-pink-800',
  'Stödjande': 'bg-blue-100 text-blue-800',
  'Utmanande': 'bg-orange-100 text-orange-800',
  'Analytisk': 'bg-gray-100 text-gray-800'
} as const;

export function ArchetypeBadge({ archetype, size = 'medium', variant = 'full' }: ArchetypeBadgeProps) {
  const getArchetypeGroup = (type: string): keyof typeof ARCHETYPE_COLORS => {
    // Map MÄÄK archetypes to groups based on type
    if (['INFP', 'INFJ', 'ENFP', 'ENFJ'].includes(type)) return 'Diplomater';
    if (['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'].includes(type)) return 'Byggare';
    if (['ISTP', 'ISFP', 'ESTP', 'ESFP'].includes(type)) return 'Upptäckare';
    if (['INTJ', 'INTP', 'ENTJ', 'ENTP'].includes(type)) return 'Strateger';
    return 'Diplomater'; // fallback
  };

  const group = getArchetypeGroup(archetype.type);
  const colors = ARCHETYPE_COLORS[group];

  if (variant === 'minimal') {
    return (
      <Badge className={`${colors.secondary} text-xs`}>
        {archetype.type}
      </Badge>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex gap-1">
        <Badge className={`${colors.secondary} text-xs`}>
          {archetype.type}
        </Badge>
        <Badge className={EMOTIONAL_COLORS[archetype.emotional as keyof typeof EMOTIONAL_COLORS] || 'bg-gray-100 text-gray-800'}>
          {archetype.emotional}
        </Badge>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${size === 'small' ? 'text-xs' : size === 'large' ? 'text-base' : 'text-sm'}`}>
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors.gradient}`}></div>
        <Badge className={`${colors.secondary} font-medium`}>
          {archetype.type} - {archetype.name}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-1">
        <Badge className={EMOTIONAL_COLORS[archetype.emotional as keyof typeof EMOTIONAL_COLORS] || 'bg-gray-100 text-gray-800'}>
          Emotionell: {archetype.emotional}
        </Badge>
        <Badge className="bg-blue-100 text-blue-800">
          Intellektuell: {archetype.intellectual}
        </Badge>
        <Badge className="bg-green-100 text-green-800">
          Social: {archetype.social}
        </Badge>
        <Badge className="bg-yellow-100 text-yellow-800">
          Livsstil: {archetype.lifestyle}
        </Badge>
      </div>
    </div>
  );
}

export function ArchetypeIcon({ archetype, size = 20 }: { archetype: ArchetypeData; size?: number }) {
  const group = archetype.type.startsWith('E') ? 'Utåtriktad' : 'Inåtriktad';
  const colors = ARCHETYPE_COLORS[group === 'Utåtriktad' ? 'Upptäckare' : 'Diplomater'];
  
  return (
    <div 
      className={`rounded-full bg-gradient-to-r ${colors.gradient} flex items-center justify-center text-white font-medium`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {archetype.type.slice(0, 2)}
    </div>
  );
}