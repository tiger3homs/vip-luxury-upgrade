import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, formatPrice, formatMileage, getImageUrl } from '../../services/supabase';
import { Heading, Label } from '../Typography';

interface CarComparisonProps {
  cars: Car[];
  onRemove: (carId: string) => void;
  onClear: () => void;
}

export const CarComparison: React.FC<CarComparisonProps> = ({ cars, onRemove, onClear }) => {
  if (cars.length === 0) return null;

  const specs = [
    { label: 'Year', key: 'year' },
    { label: 'Mileage', key: 'mileage', format: (val: any) => val ? formatMileage(val) : 'New' },
    { label: 'Price', key: 'price', format: (val: any, car: Car) => formatPrice(val, car.currency) },
    { label: 'Fuel Type', key: 'fuel_type' },
    { label: 'Transmission', key: 'transmission' },
    { label: 'Power', key: 'power_hp', format: (val: any) => val ? `${val} HP` : 'N/A' },
    { label: 'Body Type', key: 'body_type' },
    { label: 'Drive Type', key: 'drive_type', format: (val: any) => val?.toUpperCase() || 'N/A' },
    { label: 'Engine', key: 'engine_cc', format: (val: any) => val ? `${(val / 1000).toFixed(1)}L` : 'N/A' },
    { label: 'Exterior Color', key: 'exterior_color' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-brand-black/95 backdrop-blur-lg overflow-auto animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-down">
          <div>
            <Label className="text-brand-gold mb-2 block">Compare Vehicles</Label>
            <Heading as="h2">Side by Side <span className="text-gold-metallic">Comparison</span></Heading>
          </div>
          <div className="flex gap-4">
            <button
              onClick={onClear}
              className="px-6 py-3 border border-white/20 text-white hover:border-brand-gold hover:text-brand-gold transition-all text-sm uppercase tracking-widest font-bold"
            >
              Clear All
            </button>
            <button
              onClick={() => onClear()}
              className="px-6 py-3 bg-brand-gold text-brand-black hover:bg-brand-goldLight transition-all text-sm uppercase tracking-widest font-bold"
            >
              Close
            </button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(cars.length, 3)}, 1fr)` }}>
          {cars.slice(0, 3).map((car, index) => (
            <div key={car.id} className="bg-brand-dark border border-white/10 overflow-hidden animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Car Image */}
              <div className="relative aspect-video overflow-hidden group">
                {car.images?.[0] ? (
                  <img
                    src={getImageUrl(car.images[0])}
                    alt={car.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-gray flex items-center justify-center text-brand-muted">
                    No Image
                  </div>
                )}
                <button
                  onClick={() => onRemove(car.id)}
                  className="absolute top-4 right-4 w-10 h-10 bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Car Info */}
              <div className="p-6 border-b border-white/10">
                <Label className="text-brand-gold mb-2 block">{car.brand}</Label>
                <Heading as="h3" className="text-2xl mb-2">{car.model} {car.variant}</Heading>
                <p className="text-3xl font-display font-bold text-white">
                  {formatPrice(car.price, car.currency)}
                </p>
                <Link
                  to={`/cars/${car.slug}`}
                  className="inline-flex items-center gap-2 text-brand-gold text-sm mt-4 hover:text-brand-goldLight transition-colors"
                >
                  View Full Details
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
              </div>

              {/* Specifications */}
              <div className="p-6 space-y-3">
                {specs.map((spec) => {
                  const value = (car as any)[spec.key];
                  const displayValue = spec.format
                    ? spec.format(value, car)
                    : value || 'N/A';
                  return (
                    <div key={spec.label} className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-brand-muted text-sm uppercase tracking-widest">{spec.label}</span>
                      <span className="text-white font-bold">{displayValue}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {cars.length > 3 && (
          <div className="mt-8 p-6 bg-brand-yellow/10 border border-brand-yellow/30 text-center">
            <p className="text-brand-yellow">You can compare up to 3 vehicles at a time. Remove a vehicle to add another.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Comparison Button/Widget
export const ComparisonWidget: React.FC<{
  selectedCars: Car[];
  onCompare: () => void;
  onClear: () => void;
}> = ({ selectedCars, onCompare, onClear }) => {
  if (selectedCars.length === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
      <div className="glass-morph-gold px-6 py-4 flex items-center gap-6 shadow-gold-glow">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-gold">
            <path d="M18 20V10"></path>
            <path d="M12 20V4"></path>
            <path d="M6 20v-6"></path>
          </svg>
          <span className="text-white font-bold">{selectedCars.length} vehicle{selectedCars.length !== 1 ? 's' : ''} selected</span>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClear}
            className="px-4 py-2 text-white/60 hover:text-white transition-colors text-sm uppercase tracking-widest font-bold"
          >
            Clear
          </button>
          <button
            onClick={onCompare}
            disabled={selectedCars.length < 2}
            className={`px-6 py-2 bg-brand-gold text-brand-black hover:bg-brand-goldLight transition-all text-sm uppercase tracking-widest font-bold btn-premium ${
              selectedCars.length < 2 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Compare {selectedCars.length > 1 ? `(${selectedCars.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
};