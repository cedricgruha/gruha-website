import React from 'react';

interface StickySidebarProps {
  number: string;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  image: string;
  imageAlt?: string;
}

export const StickySidebar: React.FC<StickySidebarProps> = ({ 
  number, 
  title, 
  description, 
  image, 
  imageAlt = "Section Illustration" 
}) => {
  return (
    <>
      <div className="mb-2 font-fraunces text-3xl md:text-4xl text-primary">
        {number}
      </div>
      <h2 className="font-fraunces text-3xl md:text-4xl lg:text-5xl text-black leading-[1.1] mb-4">
        {title}
      </h2>
      <div className="w-16 h-[3px] bg-[#FE6235] mb-6"></div>
      <div className="font-inter text-base md:text-lg text-gray-700 leading-[1.4] mb-6 whitespace-pre-line">
        {description}
      </div>
      <div className="relative w-full h-[400px] md:h-[500px] mt-auto">
        <img 
          src={image} 
          alt={imageAlt} 
          className="w-full h-full object-contain md:object-left-bottom  "
        />
      </div>
    </>
  );
};
