import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}) => {
  const baseStyles = "inline-flex items-center justify-center px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 transform font-display clip-path-button";
  
  const variants = {
    primary: "bg-brand-yellow text-brand-black hover:bg-brand-yellowHover hover:scale-[1.02]",
    secondary: "bg-brand-gray text-white border border-brand-gray hover:border-brand-yellow hover:text-brand-yellow",
    outline: "bg-transparent text-white border border-white/20 hover:border-brand-yellow hover:text-brand-yellow",
    ghost: "text-brand-muted hover:text-brand-yellow",
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  if (href) {
    return (
      <Link to={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedClasses} disabled={disabled}>
      {children}
    </button>
  );
};