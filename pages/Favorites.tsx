import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/Container';
import { Section } from '../components/Section';
import { Heading, Text } from '../components/Typography';
import { Button } from '../components/Button';
import { supabase, Car, formatPrice, formatMileage, getImageUrl } from '../services/supabase';
import { SEO } from '../components/SEO';
import { CarCard, CarCardSkeleton } from '../components/features/CarCard';

export const Favorites: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('carFavorites');
    if (savedFavorites) {
      const favIds = JSON.parse(savedFavorites);
      setFavorites(favIds);
      fetchFavoriteCars(favIds);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchFavoriteCars = async (favIds: string[]) => {
    if (favIds.length === 0) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('cars_for_sale')
      .select('*')
      .in('id', favIds);

    if (error) {
      console.error('Error fetching favorites:', error);
    } else {
      setCars(data || []);
    }
    setLoading(false);
  };

  const handleToggleFavorite = (carId: string) => {
    const updatedFavorites = favorites.filter((id) => id !== carId);
    setFavorites(updatedFavorites);
    localStorage.setItem('carFavorites', JSON.stringify(updatedFavorites));
    setCars((prev) => prev.filter((car) => car.id !== carId));
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    setCars([]);
    localStorage.removeItem('carFavorites');
  };

  return (
    <div className="bg-brand-black min-h-screen">
      <SEO
        title="My Favorite Vehicles"
        description="View your saved favorite vehicles from VIP Luxury Cars."
      />

      {/* Header */}
      <div className="pt-32 pb-12 border-b border-white/5">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Heading as="h1" className="text-4xl md:text-5xl mb-4">
                My Favorites
              </Heading>
              <Text className="text-lg max-w-2xl">
                {cars.length > 0
                  ? `You have ${cars.length} saved vehicle${cars.length > 1 ? 's' : ''}.`
                  : 'Save vehicles you like to view them here later.'}
              </Text>
            </div>
            {cars.length > 0 && (
              <button
                onClick={clearAllFavorites}
                className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Clear All
              </button>
            )}
          </div>
        </Container>
      </div>

      {/* Content */}
      <Section className="py-12">
        <Container>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <CarCardSkeleton key={i} />
              ))}
            </div>
          ) : cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  isFavorite={true}
                  onFavorite={() => handleToggleFavorite(car.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-brand-gray/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-brand-muted">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <Heading as="h3" className="mb-4">No Favorites Yet</Heading>
              <Text className="mb-8 max-w-md mx-auto">
                Browse our inventory and click the heart icon on any vehicle to save it here.
              </Text>
              <Button href="/shop">Browse Inventory</Button>
            </div>
          )}
        </Container>
      </Section>

      {/* Compare CTA */}
      {cars.length >= 2 && (
        <Section className="py-8 bg-brand-gray border-t border-white/5">
          <Container>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-white font-bold">Compare Your Favorites</p>
                <p className="text-brand-muted text-sm">Select vehicles to compare side by side</p>
              </div>
              <Button variant="outline">Compare Vehicles</Button>
            </div>
          </Container>
        </Section>
      )}
    </div>
  );
};
