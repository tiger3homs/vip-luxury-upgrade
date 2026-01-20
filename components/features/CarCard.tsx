import React from 'react';
import { Link } from 'react-router-dom';
import { Car, getImageUrl, formatPrice, formatMileage } from '../../services/supabase';
import { StatusBadge, Badge } from '../ui/Badge';

interface CarCardProps {
  car: Car;
  variant?: 'default' | 'compact' | 'horizontal';
  showStatus?: boolean;
  onFavorite?: (carId: string) => void;
  isFavorite?: boolean;
}

export const CarCard: React.FC<CarCardProps> = ({
  car,
  variant = 'default',
  showStatus = true,
  onFavorite,
  isFavorite = false,
}) => {
  const primaryImage = car.images?.[0] ? getImageUrl(car.images[0]) : null;
  const hasMultipleImages = (car.images?.length || 0) > 1;
  const isPriceReduced = car.original_price && car.original_price > car.price;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavorite?.(car.id);
  };

  if (variant === 'horizontal') {
    return (
      <Link
        to={`/cars/${car.slug}`}
        className="group flex bg-brand-gray/20 border border-white/10 hover:border-brand-yellow/50 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative w-80 flex-shrink-0 overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={car.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-brand-gray flex items-center justify-center text-brand-muted">
              No Image
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {showStatus && car.status !== 'available' && (
              <StatusBadge status={car.status} />
            )}
            {isPriceReduced && (
              <Badge variant="warning" size="sm">Price Reduced</Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="text-xs text-brand-muted uppercase tracking-widest">
                {car.brand}
              </span>
              <h3 className="text-xl font-display font-bold text-white">
                {car.model} {car.variant}
              </h3>
            </div>
            {onFavorite && (
              <button
                onClick={handleFavoriteClick}
                className={`p-2 transition-colors ${isFavorite ? 'text-red-500' : 'text-white/40 hover:text-red-500'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            )}
          </div>

          {/* Specs */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 text-sm text-brand-muted">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              {car.year}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              {car.fuel_type || 'N/A'}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {car.mileage ? formatMileage(car.mileage) : 'New'}
            </span>
            {car.transmission && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                {car.transmission}
              </span>
            )}
            {car.power_hp && (
              <span className="flex items-center gap-1.5">
                {car.power_hp} HP
              </span>
            )}
          </div>

          <div className="mt-auto flex items-end justify-between">
            <div>
              {isPriceReduced && (
                <span className="text-brand-muted line-through text-sm block">
                  {formatPrice(car.original_price!, car.currency)}
                </span>
              )}
              <span className="text-2xl font-display font-bold text-white">
                {formatPrice(car.price, car.currency)}
              </span>
            </div>
            <span className="text-xs font-bold uppercase text-brand-yellow border-b border-brand-yellow pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              View Details
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Default vertical card
  return (
    <Link
      to={`/cars/${car.slug}`}
      className="group block border border-white/10 bg-brand-gray/20 hover:border-brand-yellow/50 transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={car.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-brand-gray flex items-center justify-center text-brand-muted">
            No Image
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Top badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {showStatus && car.status !== 'available' && (
            <StatusBadge status={car.status} />
          )}
          {isPriceReduced && (
            <Badge variant="warning" size="sm">Price Reduced</Badge>
          )}
          {car.condition === 'new' && (
            <Badge variant="premium" size="sm">New</Badge>
          )}
        </div>

        {/* Year badge */}
        <div className="absolute top-4 right-4 bg-brand-black/80 backdrop-blur px-3 py-1 border border-white/10">
          <span className="text-xs font-bold text-white tracking-widest">{car.year}</span>
        </div>

        {/* Image count indicator */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 right-4 bg-brand-black/80 backdrop-blur px-2 py-1 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span className="text-xs text-white">{car.images?.length}</span>
          </div>
        )}

        {/* Favorite button */}
        {onFavorite && (
          <button
            onClick={handleFavoriteClick}
            className={`absolute bottom-4 left-4 w-10 h-10 flex items-center justify-center bg-brand-black/80 backdrop-blur border border-white/10 transition-all hover:border-red-500 ${isFavorite ? 'text-red-500' : 'text-white/60'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-xs text-brand-muted uppercase tracking-widest mb-1 group-hover:text-brand-yellow transition-colors">
          {car.brand}
        </span>
        <h3 className="text-xl font-display font-bold text-white mb-2 truncate">
          {car.model} {car.variant}
        </h3>

        {/* Specs Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-6 text-xs text-brand-muted border-b border-white/5 pb-4">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            {car.fuel_type || 'N/A'}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {car.mileage ? formatMileage(car.mileage) : 'New'}
          </span>
          {car.power_hp && (
            <>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span>{car.power_hp} HP</span>
            </>
          )}
        </div>

        {/* Price */}
        <div className="flex justify-between items-end mt-auto">
          <div>
            <span className="text-xs text-brand-muted uppercase block mb-1">Price</span>
            {isPriceReduced && (
              <span className="text-brand-muted line-through text-sm block">
                {formatPrice(car.original_price!, car.currency)}
              </span>
            )}
            <span className="text-white font-display text-xl font-bold">
              {car.price_type === 'upon_request' 
                ? 'Price on Request' 
                : formatPrice(car.price, car.currency)
              }
            </span>
          </div>
          <span className="text-xs font-bold uppercase text-brand-yellow border-b border-brand-yellow pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
};

// Skeleton loader for car card
export const CarCardSkeleton: React.FC<{ variant?: 'default' | 'horizontal' }> = ({ variant = 'default' }) => {
  if (variant === 'horizontal') {
    return (
      <div className="flex bg-brand-gray/20 border border-white/10 animate-pulse">
        <div className="w-80 flex-shrink-0 bg-brand-gray/50 aspect-video" />
        <div className="flex-1 p-6">
          <div className="h-3 w-20 bg-brand-gray/50 rounded mb-2" />
          <div className="h-6 w-48 bg-brand-gray/50 rounded mb-4" />
          <div className="flex gap-4 mb-4">
            <div className="h-4 w-16 bg-brand-gray/50 rounded" />
            <div className="h-4 w-16 bg-brand-gray/50 rounded" />
            <div className="h-4 w-16 bg-brand-gray/50 rounded" />
          </div>
          <div className="h-8 w-32 bg-brand-gray/50 rounded mt-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-white/10 bg-brand-gray/20 animate-pulse">
      <div className="aspect-[4/3] bg-brand-gray/50" />
      <div className="p-6">
        <div className="h-3 w-20 bg-brand-gray/50 rounded mb-2" />
        <div className="h-6 w-3/4 bg-brand-gray/50 rounded mb-4" />
        <div className="flex gap-4 mb-6 pb-4 border-b border-white/5">
          <div className="h-4 w-16 bg-brand-gray/50 rounded" />
          <div className="h-4 w-20 bg-brand-gray/50 rounded" />
        </div>
        <div className="h-6 w-28 bg-brand-gray/50 rounded" />
      </div>
    </div>
  );
};
