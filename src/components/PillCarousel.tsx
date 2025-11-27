import React from 'react';
import { Button } from './ui/button';
import { Circle, Zap } from 'lucide-react';

interface PillCarouselProps {
  items: string[];
  selected: number;
  onSelect: (index: number) => void;
}

export function PillCarousel({ items, selected, onSelect }: PillCarouselProps) {
  const getIcon = (item: string, index: number) => {
    if (item === 'Likhetsmatch') {
      return <Circle className="w-4 h-4" />;
    }
    if (item === 'Motsatsmatch') {
      return <Zap className="w-4 h-4" />;
    }
    return null;
  };

  return (
    <div className="flex gap-2 mb-6 justify-center">
      {items.map((item, index) => (
        <Button
          key={index}
          variant={selected === index ? "default" : "outline"}
          className={`flex items-center space-x-2 rounded-full px-6 py-2 ${
            selected === index 
              ? 'bg-gradient-to-r from-primary to-secondary text-white' 
              : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary/30'
          }`}
          onClick={() => onSelect(index)}
        >
          {getIcon(item, index)}
          <span className="font-medium">{item}</span>
        </Button>
      ))}
    </div>
  );
}