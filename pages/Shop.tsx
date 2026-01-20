import React, { useEffect, useState } from 'react';
import { Container } from '../components/Container';
import { Section } from '../components/Section';
import { Heading, Label } from '../components/Typography';
import { Link } from 'react-router-dom';
import { GridBackground } from '../components/GridBackground';
import { supabase, Car } from '../services/supabase';
import { SEO } from '../components/SEO';

const CarCard = ({ car }: { car: Car }) => (
  <Link to={`/cars/${car.slug}`} className="group block border border-white/10 bg-brand-gray/20 hover:border-brand-yellow/50 transition-all duration-300 flex flex-col h-full">
    <div className="relative aspect-video overflow-hidden">
      {car.images && car.images.length > 0 ? (
        <img 
          src={car.images[0].startsWith('http') ? car.images[0] : `${supabase.storage.from('car-images').getPublicUrl(car.images[0]).data.publicUrl}`}
          alt={car.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-brand-gray flex items-center justify-center text-brand-muted">
          No Image
        </div>
      )}
      <div className="absolute top-4 right-4 bg-brand-black/80 backdrop-blur px-3 py-1 border border-white/10">
        <span className="text-xs font-bold text-white tracking-widest">{car.year}</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
    </div>
    
    <div className="p-6 flex flex-col flex-grow">
      <Label className="text-xs mb-1 block text-brand-muted group-hover:text-brand-yellow transition-colors uppercase tracking-wider">{car.brand}</Label>
      <h3 className="text-xl font-display font-bold text-white mb-2 truncate">{car.model}</h3>
      
      {/* Specs Row */}
      <div className="flex items-center gap-4 mb-6 text-xs text-brand-muted font-sans border-b border-white/5 pb-4">
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          {car.fuel_type || 'N/A'}
        </span>
        <span className="w-1 h-1 rounded-full bg-white/20"></span>
        <span className="flex items-center gap-1">
           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           {car.mileage ? `${(car.mileage / 1000).toFixed(0)}k km` : 'New'}
        </span>
      </div>

      <div className="flex justify-between items-end mt-auto">
        <div>
           <span className="text-xs text-brand-muted uppercase block mb-1">Price</span>
           <span className="text-white font-sans text-lg font-medium">{car.currency} {car.price.toLocaleString()}</span>
        </div>
        <span className="text-xs font-bold uppercase text-brand-yellow border-b border-brand-yellow pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
          View Details
        </span>
      </div>
    </div>
  </Link>
);

const FilterButton = ({ label, active = false }: { label: string, active?: boolean }) => (
  <button className={`px-6 py-2 text-sm uppercase tracking-widest font-bold border transition-all ${active ? 'bg-brand-yellow text-brand-black border-brand-yellow' : 'bg-transparent text-white/60 border-white/20 hover:border-white hover:text-white'}`}>
    {label}
  </button>
);

export const Shop: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      const { data, error } = await supabase
        .from('cars_for_sale')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cars:', error);
      } else {
        setCars(data || []);
      }
      setLoading(false);
    };

    fetchCars();
  }, []);

  return (
    <div className="min-h-screen bg-brand-black pt-20">
      <SEO 
        title="Inventory - Luxury Cars for Sale" 
        description="Browse our collection of available supercars, classics, and luxury SUVs. Find your next Aston Martin, Ferrari, Porsche, or Mercedes-Benz."
      />
      <Section className="py-20 bg-brand-black relative">
        <GridBackground opacity={0.05} />
        <Container>
          <div className="mb-16">
            <Label className="mb-4 block">Inventory</Label>
            <Heading as="h1" className="mb-8">Available <span className="text-brand-yellow">Models</span></Heading>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <FilterButton label="All" active />
              <FilterButton label="Supercars" />
              <FilterButton label="SUVs" />
              <FilterButton label="Classic" />
              <FilterButton label="Electric" />
            </div>
          </div>

          {loading ? (
             <div className="flex justify-center items-center h-64">
               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-yellow"></div>
             </div>
          ) : cars.length === 0 ? (
             <div className="text-brand-muted text-center py-24 border border-white/5 bg-brand-gray/5">
               <p className="mb-4">No vehicles currently available.</p>
               <Link to="/contact" className="text-brand-yellow underline hover:text-white transition-colors">Contact us for sourcing requests</Link>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
};