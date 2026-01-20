import React from 'react';

interface GridBackgroundProps {
  opacity?: number;
  className?: string;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({ 
  opacity = 0.1,
  className = ''
}) => {
  return (
    <div 
      className={`absolute inset-0 z-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `linear-gradient(to right, #2a2a2a 1px, transparent 1px), linear-gradient(to bottom, #2a2a2a 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
        opacity: opacity,
        maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
      }}
    />
  );
};