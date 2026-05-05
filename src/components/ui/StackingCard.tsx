import React from 'react';

export interface CardData {
  id: string | number;
  title: string;
  description: string;
  image: string;
  bg: string;
  textColor?: string;
}

interface StackingCardProps {
  card: CardData;
  index: number;
  topOffset?: number;
  spacing?: number;
}

export const StackingCard: React.FC<StackingCardProps> = ({ 
  card, 
  index, 
  topOffset = 120, 
  spacing = 8 
}) => {
  return (
    <div 
      className={`w-full min-h-[70vh] md:min-h-0 rounded-[32px] md:rounded-[28px] overflow-hidden ${card.bg} flex flex-col pt-14 md:pt-0 sticky shadow-sm [--stack-top:80px] md:[--stack-top:120px]`}
      style={{ 
        top: `calc(var(--stack-top) + ${index * spacing}px)`,
        zIndex: index + 1
      } as React.CSSProperties}
    >
      {/* Mobile Spacer to push content down */}
      <div className="flex-1 md:hidden" />

      {/* Card Text Content */}
      <div className="px-7 md:p-8 lg:p-10 pb-0">
        <h3 className={`font-inter font-bold text-2xl md:text-2xl lg:text-[1.875rem] leading-tight tracking-tight mb-4 whitespace-pre-line ${card.textColor || 'text-black'}`}>
          {card.title}
        </h3>
        <p className={`font-inter text-base md:text-base lg:text-lg leading-relaxed max-w-[95%] font-medium ${card.textColor || 'text-gray-900'}`}>
          {card.description}
        </p>
      </div>
      
      {/* Card Image */}
      <div className="w-full mt-6 md:mt-8 flex justify-center overflow-hidden">
        <img 
          src={card.image} 
          alt={card.title} 
          className="w-full h-[450px] md:h-auto object-cover md:object-contain"
        />
      </div>
    </div>
  );
};
