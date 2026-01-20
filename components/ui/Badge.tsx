import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'premium';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-brand-gray text-white border-white/20',
  success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  error: 'bg-red-500/20 text-red-400 border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  premium: 'bg-brand-yellow text-brand-black border-brand-yellow',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center font-bold uppercase tracking-widest border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

// Specialized status badges for cars
export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className }) => {
  const variants: Record<string, BadgeVariant> = {
    available: 'success',
    reserved: 'warning',
    sold: 'error',
    coming_soon: 'info',
    new: 'premium',
  };

  const labels: Record<string, string> = {
    available: 'Available',
    reserved: 'Reserved',
    sold: 'Sold',
    coming_soon: 'Coming Soon',
    new: 'New',
  };

  return (
    <Badge variant={variants[status] || 'default'} className={className}>
      {labels[status] || status}
    </Badge>
  );
};

// Price reduction badge
export const PriceReducedBadge: React.FC<{ className?: string }> = ({ className }) => (
  <Badge variant="warning" className={className}>
    Price Reduced
  </Badge>
);

// Feature badge for highlighting car features
export const FeatureBadge: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <span className={`inline-flex items-center px-3 py-1.5 bg-brand-gray/50 text-white/80 text-xs border border-white/10 ${className}`}>
    {children}
  </span>
);
