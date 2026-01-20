import React from 'react';

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const Heading: React.FC<HeadingProps> = ({ children, className = '', as: Tag = 'h2' }) => {
  const baseStyles = "font-display font-bold uppercase tracking-wider text-white";
  
  const sizes = {
    h1: "text-6xl md:text-8xl lg:text-9xl leading-none",
    h2: "text-4xl md:text-6xl leading-tight",
    h3: "text-3xl md:text-4xl",
    h4: "text-2xl",
    h5: "text-xl",
    h6: "text-lg",
  };

  return (
    <Tag className={`${baseStyles} ${sizes[Tag]} ${className}`}>
      {children}
    </Tag>
  );
};

export const Text: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-brand-muted font-sans text-base md:text-lg leading-relaxed ${className}`}>
    {children}
  </p>
);

export const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`text-brand-yellow font-display text-sm uppercase tracking-widest font-bold ${className}`}>
    {children}
  </span>
);