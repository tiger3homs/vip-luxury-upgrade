import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const Container: React.FC<ContainerProps> = ({ children, className = '', fullWidth = false }) => {
  return (
    <div className={`mx-auto px-4 md:px-8 ${fullWidth ? 'max-w-none' : 'max-w-7xl'} ${className}`}>
      {children}
    </div>
  );
};