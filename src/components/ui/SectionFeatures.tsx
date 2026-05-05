import React from 'react';

export interface FeatureData {
  title: string;
  description: string;
  icon: string | React.ReactNode;
}

interface SectionFeaturesProps {
  features: FeatureData[];
  className?: string;
}

export const SectionFeatures: React.FC<SectionFeaturesProps> = ({ features, className = "" }) => {
  return (
    <div className={`flex flex-col md:flex-row w-full ps-5 sm:ps-0 ${className}`}>
      {features.map((feature, index) => (
        <div 
          key={index} 
          className={`flex items-start py-5 ${index !== features.length - 1 ? '  w-full md:w-1/3' : ''}`}
        >
          {/* Icon */}
          <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center mr-5 md:mr-6 pt-0.5">
            {typeof feature.icon === 'string' ? (
              <img 
                src={feature.icon} 
                alt="" 
                className="w-full h-auto object-contain"
              />
            ) : (
              feature.icon
            )}
          </div>
          
          {/* Text */}
          <div className="flex flex-col">
            <h3 className="font-inter text-base md:text-lg font-bold text-black mb-1 tracking-tight">
              {feature.title}
            </h3>
            <p className="font-inter text-[0.8125rem] md:text-sm text-gray-700 leading-relaxed font-medium whitespace-pre-line">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
