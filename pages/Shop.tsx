import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Container } from '../components/Container';
import { Section } from '../components/Section';
import { Heading, Label } from '../components/Typography';
import { GridBackground } from '../components/GridBackground';
import { supabase, Car, CarFilters } from '../services/supabase';
import { SEO } from '../components/SEO';
import { CarCard, CarCardSkeleton } from '../components/features/CarCard';
import { SearchFilters, SortDropdown, ViewToggle } from '../components/features/SearchFilters';
import { CarComparison, ComparisonWidget } from '../components/features/CarComparison';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [comparisonCars, setComparisonCars] = useState<Car[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Parse filters from URL
  const filters: CarFilters = useMemo(() => ({
    brand: searchParams.get('brand') || undefined,
    model: searchParams.get('model') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    minYear: searchParams.get('minYear') ? Number(searchParams.get('minYear')) : undefined,
    maxYear: searchParams.get('maxYear') ? Number(searchParams.get('maxYear')) : undefined,
    minMileage: searchParams.get('minMileage') ? Number(searchParams.get('minMileage')) : undefined,
    maxMileage: searchParams.get('maxMileage') ? Number(searchParams.get('maxMileage')) : undefined,
    bodyType: searchParams.get('bodyType')?.split(',') as CarFilters['bodyType'] || undefined,
    fuelType: searchParams.get('fuelType')?.split(',') || undefined,
    transmission: searchParams.get('transmission')?.split(',') || undefined,
    color: searchParams.get('color')?.split(',') || undefined,
    sortBy: (searchParams.get('sortBy') as CarFilters['sortBy']) || 'newest',
  }), [searchParams]);

  // Update URL when filters change
  const handleFiltersChange = (newFilters: CarFilters) => {
    const params = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0)) {
        if (Array.isArray(value)) {
          params.set(key, value.join(','));
        } else {
          params.set(key, String(value));
        }
      }
    });
    
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Fetch cars with filters
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      
      let query = supabase
        .from('cars_for_sale')
        .select('*')
        .eq('status', 'available');

      // Apply filters
      if (filters.brand) {
        query = query.ilike('brand', filters.brand);
      }
      if (filters.model) {
        query = query.ilike('model', `%${filters.model}%`);
      }
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.minYear) {
        query = query.gte('year', filters.minYear);
      }
      if (filters.maxYear) {
        query = query.lte('year', filters.maxYear);
      }
      if (filters.minMileage) {
        query = query.gte('mileage', filters.minMileage);
      }
      if (filters.maxMileage) {
        query = query.lte('mileage', filters.maxMileage);
      }
      if (filters.fuelType && filters.fuelType.length > 0) {
        query = query.in('fuel_type', filters.fuelType);
      }
      if (filters.transmission && filters.transmission.length > 0) {
        query = query.in('transmission', filters.transmission);
      }
      if (filters.color && filters.color.length > 0) {
        query = query.in('color', filters.color);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'year_desc':
          query = query.order('year', { ascending: false });
          break;
        case 'year_asc':
          query = query.order('year', { ascending: true });
          break;
        case 'mileage_asc':
          query = query.order('mileage', { ascending: true });
          break;
        case 'mileage_desc':
          query = query.order('mileage', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching cars:', error);
      } else {
        setCars(data || []);
      }
      setLoading(false);
    };

    fetchCars();
  }, [filters]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('carFavorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const handleFavorite = (carId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(carId)) {
        newFavorites.delete(carId);
      } else {
        newFavorites.add(carId);
      }
      localStorage.setItem('carFavorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  };

  // Comparison handlers
  const handleAddToComparison = (car: Car) => {
    if (comparisonCars.length < 3 && !comparisonCars.find(c => c.id === car.id)) {
      setComparisonCars([...comparisonCars, car]);
    }
  };

  const handleRemoveFromComparison = (carId: string) => {
    setComparisonCars(comparisonCars.filter(c => c.id !== carId));
  };

  const handleClearComparison = () => {
    setComparisonCars([]);
    setShowComparison(false);
  };

  const isInComparison = (carId: string) => {
    return comparisonCars.some(c => c.id === carId);
  };

  return (
    <div className="min-h-screen bg-brand-black pt-20">
      <SEO
        title="Luxury Cars for Sale - Browse Inventory"
        description="Browse our exclusive collection of luxury and performance vehicles. Find your dream Aston Martin, Ferrari, Porsche, Mercedes-Benz and more."
      />

      {/* Hero Section */}
      <Section className="py-16 bg-brand-black relative">
        <GridBackground opacity={0.05} />
        <Container>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <Label className="mb-4 block">Inventory</Label>
              <Heading as="h1">
                Available <span className="text-brand-yellow">Vehicles</span>
              </Heading>
              <p className="text-brand-muted mt-4 max-w-xl">
                Discover our curated collection of exceptional automobiles. Each vehicle has been 
                carefully selected and inspected to meet our exacting standards.
              </p>
            </div>
            
            {/* Quick stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-white">{cars.length}</div>
                <div className="text-xs text-brand-muted uppercase tracking-widest">Vehicles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-brand-yellow">
                  {new Set(cars.map(c => c.brand)).size}
                </div>
                <div className="text-xs text-brand-muted uppercase tracking-widest">Brands</div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Filters & Results */}
      <Section className="py-8 bg-brand-dark border-t border-white/5">
        <Container>
          {/* Search Filters */}
          <SearchFilters
            filters={filters}
            onChange={handleFiltersChange}
            onReset={handleResetFilters}
            resultsCount={cars.length}
            isLoading={loading}
          />

          {/* Toolbar */}
          <div className="flex items-center justify-between py-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <SortDropdown
                value={filters.sortBy}
                onChange={(sortBy) => handleFiltersChange({ ...filters, sortBy })}
              />
            </div>
            <div className="flex items-center gap-4">
              <ViewToggle view={view} onChange={setView} />
              {favorites.size > 0 && (
                <Link
                  to="/favorites"
                  className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-yellow transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {favorites.size} Saved
                </Link>
              )}
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className={`grid gap-8 py-8 ${
              view === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {[...Array(6)].map((_, i) => (
                <CarCardSkeleton key={i} variant={view === 'list' ? 'horizontal' : 'default'} />
              ))}
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-24 border border-white/5 bg-brand-gray/5 my-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-4 text-brand-muted">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              <p className="text-brand-muted mb-4">No vehicles match your search criteria.</p>
              <button
                onClick={handleResetFilters}
                className="text-brand-yellow underline hover:text-white transition-colors"
              >
                Clear all filters
              </button>
              <p className="text-brand-muted text-sm mt-4">
                or{' '}
                <Link to="/contact" className="text-brand-yellow hover:text-white transition-colors">
                  contact us
                </Link>
                {' '}for sourcing requests
              </p>
            </div>
          ) : (
            <div className={`grid gap-8 py-8 ${
              view === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {cars.map((car) => (
                <div key={car.id} className="relative">
                  {/* Comparison Checkbox */}
                  <div className="absolute top-4 right-4 z-30">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isInComparison(car.id)) {
                          handleRemoveFromComparison(car.id);
                        } else {
                          handleAddToComparison(car);
                        }
                      }}
                      className={`w-10 h-10 rounded-full backdrop-blur flex items-center justify-center transition-all ${
                        isInComparison(car.id)
                          ? 'bg-brand-gold text-brand-black shadow-gold-glow'
                          : 'bg-brand-black/60 border border-white/20 hover:border-brand-gold text-white/60 hover:text-brand-gold'
                      }`}
                      title={isInComparison(car.id) ? 'Remove from comparison' : 'Add to comparison'}
                    >
                      {isInComparison(car.id) ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 20V10"></path>
                          <path d="M12 20V4"></path>
                          <path d="M6 20v-6"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  <CarCard
                    car={car}
                    variant={view === 'list' ? 'horizontal' : 'default'}
                    onFavorite={handleFavorite}
                    isFavorite={favorites.has(car.id)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Load more / pagination placeholder */}
          {cars.length > 0 && cars.length >= 12 && (
            <div className="text-center py-8">
              <button className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest hover:border-brand-yellow hover:text-brand-yellow transition-colors">
                Load More Vehicles
              </button>
            </div>
          )}
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="py-16 bg-brand-gray border-t border-white/5">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <Heading as="h3" className="mb-4">
              Can't Find What You're Looking For?
            </Heading>
            <p className="text-brand-muted mb-8">
              Our network extends far beyond our current inventory. Tell us what you're searching for, 
              and our acquisition team will source it for you.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-brand-yellow text-brand-black px-8 py-4 font-bold uppercase tracking-widest hover:bg-brand-yellowHover transition-colors"
            >
              Request a Vehicle
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Comparison Widget */}
      {comparisonCars.length > 0 && (
        <ComparisonWidget
          selectedCars={comparisonCars}
          onCompare={() => setShowComparison(true)}
          onClear={handleClearComparison}
        />
      )}

      {/* Comparison Modal */}
      {showComparison && (
        <CarComparison
          cars={comparisonCars}
          onRemove={handleRemoveFromComparison}
          onClear={handleClearComparison}
        />
      )}
    </div>
  );
};