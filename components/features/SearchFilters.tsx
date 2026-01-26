import React, { useState, useEffect } from 'react';
import { RangeSlider } from '../ui/Slider';
import { 
  CarFilters, 
  CAR_BRANDS, 
  BODY_TYPES, 
  FUEL_TYPES, 
  TRANSMISSION_TYPES,
  EXTERIOR_COLORS,
  formatPrice
} from '../../services/supabase';

interface SearchFiltersProps {
  filters: CarFilters;
  onChange: (filters: CarFilters) => void;
  onReset: () => void;
  resultsCount?: number;
  isLoading?: boolean;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onChange,
  onReset,
  resultsCount,
  isLoading,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const updateFilter = <K extends keyof CarFilters>(key: K, value: CarFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'bodyType' | 'fuelType' | 'transmission' | 'color', value: string) => {
    const current = (filters[key] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, updated.length > 0 ? updated : undefined);
  };

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== '' && (!Array.isArray(v) || v.length > 0)
  ).length;

  return (
    <div className="glass-morph border border-white/10 shadow-premium">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-gold">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          <span className="text-sm font-bold uppercase tracking-widest text-white">
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-brand-gold text-brand-black text-xs rounded-full font-bold">
                {activeFiltersCount}
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {activeFiltersCount > 0 && (
            <button
              onClick={onReset}
              className="text-xs text-brand-muted hover:text-brand-gold transition-colors uppercase tracking-widest font-bold"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-brand-muted hover:text-brand-gold transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
      </div>

      {/* Quick Filters (Always visible) */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Brand */}
        <div className="space-y-2">
          <label className="text-xs uppercase font-bold tracking-widest text-brand-muted">Brand</label>
          <select
            value={filters.brand || ''}
            onChange={(e) => updateFilter('brand', e.target.value || undefined)}
            className="w-full bg-brand-black border border-white/20 p-3 text-white focus:border-brand-gold focus:outline-none transition-colors"
          >
            <option value="">All Brands</option>
            {CAR_BRANDS.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Model (dependent on brand) */}
        <div className="space-y-2">
          <label className="text-xs uppercase font-bold tracking-widest text-brand-muted">Model</label>
          <input
            type="text"
            placeholder="Any Model"
            value={filters.model || ''}
            onChange={(e) => updateFilter('model', e.target.value || undefined)}
            className="w-full bg-brand-black border border-white/20 p-3 text-white focus:border-brand-gold outline-none placeholder:text-white/30"
          />
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <label className="text-xs uppercase font-bold tracking-widest text-brand-muted">Max Price</label>
          <select
            value={filters.maxPrice || ''}
            onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full bg-brand-black border border-white/20 p-3 text-white focus:border-brand-gold outline-none"
          >
            <option value="">No Limit</option>
            <option value="50000">Up to CHF 50,000</option>
            <option value="100000">Up to CHF 100,000</option>
            <option value="200000">Up to CHF 200,000</option>
            <option value="500000">Up to CHF 500,000</option>
            <option value="1000000">Up to CHF 1,000,000</option>
          </select>
        </div>

        {/* Year Range */}
        <div className="space-y-2">
          <label className="text-xs uppercase font-bold tracking-widest text-brand-muted">Min Year</label>
          <select
            value={filters.minYear || ''}
            onChange={(e) => updateFilter('minYear', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full bg-brand-black border border-white/20 p-3 text-white focus:border-brand-gold outline-none"
          >
            <option value="">Any Year</option>
            {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
              <option key={year} value={year}>{year} or newer</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-0 space-y-8 border-t border-white/10 mt-0 animate-slide-down">
          {/* Price Range Slider */}
          <div className="pt-6">
            <RangeSlider
              label="Price Range"
              min={0}
              max={2000000}
              step={10000}
              value={[filters.minPrice || 0, filters.maxPrice || 2000000]}
              onChange={([min, max]) => {
                onChange({
                  ...filters,
                  minPrice: min > 0 ? min : undefined,
                  maxPrice: max < 2000000 ? max : undefined,
                });
              }}
              formatValue={(v) => formatPrice(v, 'CHF')}
            />
          </div>

          {/* Mileage Range */}
          <RangeSlider
            label="Mileage"
            min={0}
            max={200000}
            step={5000}
            value={[filters.minMileage || 0, filters.maxMileage || 200000]}
            onChange={([min, max]) => {
              onChange({
                ...filters,
                minMileage: min > 0 ? min : undefined,
                maxMileage: max < 200000 ? max : undefined,
              });
            }}
            formatValue={(v) => `${(v / 1000).toFixed(0)}k km`}
          />

          {/* Body Type */}
          <div className="space-y-3">
            <label className="text-xs uppercase font-bold tracking-widest text-brand-muted">Body Type</label>
            <div className="flex flex-wrap gap-2">
              {BODY_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => toggleArrayFilter('bodyType', value)}
                  className={`px-4 py-2 text-xs uppercase tracking-widest font-bold border transition-all ${
                    filters.bodyType?.includes(value)
                      ? 'bg-brand-gold text-brand-black border-brand-gold shadow-gold-glow'
                      : 'bg-transparent text-white/60 border-white/20 hover:border-brand-gold hover:text-brand-gold'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Fuel Type */}
          <div className="space-y-3">
            <label className="text-xs uppercase font-bold tracking-widest text-brand-muted">Fuel Type</label>
            <div className="flex flex-wrap gap-2">
              {FUEL_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => toggleArrayFilter('fuelType', value)}
                  className={`px-4 py-2 text-xs uppercase tracking-widest font-bold border transition-all ${
                    filters.fuelType?.includes(value)
                      ? 'bg-brand-gold text-brand-black border-brand-gold shadow-gold-glow'
                      : 'bg-transparent text-white/60 border-white/20 hover:border-brand-gold hover:text-brand-gold'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div className="space-y-3">
            <label className="text-xs uppercase font-bold tracking-widest text-brand-muted">Transmission</label>
            <div className="flex flex-wrap gap-2">
              {TRANSMISSION_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => toggleArrayFilter('transmission', value)}
                  className={`px-4 py-2 text-xs uppercase tracking-widest font-bold border transition-all ${
                    filters.transmission?.includes(value)
                      ? 'bg-brand-gold text-brand-black border-brand-gold shadow-gold-glow'
                      : 'bg-transparent text-white/60 border-white/20 hover:border-brand-gold hover:text-brand-gold'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Exterior Color */}
          <div className="space-y-3">
            <label className="text-xs uppercase font-bold tracking-widest text-brand-muted">Exterior Color</label>
            <div className="flex flex-wrap gap-2">
              {EXTERIOR_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => toggleArrayFilter('color', color)}
                  className={`px-4 py-2 text-xs uppercase tracking-widest font-bold border transition-all ${
                    filters.color?.includes(color)
                      ? 'bg-brand-gold text-brand-black border-brand-gold shadow-gold-glow'
                      : 'bg-transparent text-white/60 border-white/20 hover:border-brand-gold hover:text-brand-gold'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results count footer */}
      {resultsCount !== undefined && (
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-sm text-brand-muted">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
                Searching...
              </span>
            ) : (
              <>{resultsCount} vehicle{resultsCount !== 1 ? 's' : ''} found</>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

// Compact search bar for homepage
export const QuickSearchBar: React.FC<{
  onSearch: (filters: CarFilters) => void;
}> = ({ onSearch }) => {
  const [brand, setBrand] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      brand: brand || undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  };

  return (
    <form onSubmit={handleSearch} className="bg-brand-black/90 backdrop-blur-lg border border-white/10 p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="bg-brand-gray border border-white/20 p-4 text-white focus:border-brand-yellow outline-none"
        >
          <option value="">All Brands</option>
          {CAR_BRANDS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <select
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="bg-brand-gray border border-white/20 p-4 text-white focus:border-brand-yellow outline-none"
        >
          <option value="">Any Price</option>
          <option value="100000">Up to CHF 100k</option>
          <option value="200000">Up to CHF 200k</option>
          <option value="500000">Up to CHF 500k</option>
          <option value="1000000">Up to CHF 1M</option>
        </select>

        <select
          className="bg-brand-gray border border-white/20 p-4 text-white focus:border-brand-yellow outline-none"
        >
          <option value="">Any Year</option>
          <option value="2024">2024 or newer</option>
          <option value="2022">2022 or newer</option>
          <option value="2020">2020 or newer</option>
        </select>

        <button
          type="submit"
          className="bg-brand-yellow text-brand-black font-bold uppercase tracking-widest p-4 hover:bg-brand-yellowHover transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          Search
        </button>
      </div>
    </form>
  );
};

// Sort dropdown
export const SortDropdown: React.FC<{
  value: CarFilters['sortBy'];
  onChange: (value: CarFilters['sortBy']) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs uppercase tracking-widest text-brand-muted">Sort by:</span>
      <select
        value={value || 'newest'}
        onChange={(e) => onChange(e.target.value as CarFilters['sortBy'])}
        className="bg-brand-black border border-white/20 px-4 py-2 text-sm text-white focus:border-brand-gold outline-none transition-colors"
      >
        <option value="newest">Newest First</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="year_desc">Year: Newest</option>
        <option value="year_asc">Year: Oldest</option>
        <option value="mileage_asc">Mileage: Lowest</option>
        <option value="mileage_desc">Mileage: Highest</option>
      </select>
    </div>
  );
};

// View toggle (grid/list)
export const ViewToggle: React.FC<{
  view: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
}> = ({ view, onChange }) => {
  return (
    <div className="flex border border-white/20">
      <button
        onClick={() => onChange('grid')}
        className={`p-2 transition-colors ${view === 'grid' ? 'bg-brand-yellow text-brand-black' : 'text-white/60 hover:text-white'}`}
        title="Grid view"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      </button>
      <button
        onClick={() => onChange('list')}
        className={`p-2 transition-colors ${view === 'list' ? 'bg-brand-yellow text-brand-black' : 'text-white/60 hover:text-white'}`}
        title="List view"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>
    </div>
  );
};
