import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from '../components/Container';
import { Section } from '../components/Section';
import { Heading, Text, Label } from '../components/Typography';
import { Button } from '../components/Button';
import { supabase, Car } from '../services/supabase';
import { SEO } from '../components/SEO';

export const CarDetail: React.FC = () => {
  const { slug } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  
  useEffect(() => {
    const fetchCar = async () => {
      if (!slug) return;
      
      const { data, error } = await supabase
        .from('cars_for_sale')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching car:', error);
      } else {
        setCar(data);
        if (data.images && data.images.length > 0) {
          const firstImg = data.images[0];
          setActiveImage(firstImg.startsWith('http') ? firstImg : supabase.storage.from('car-images').getPublicUrl(firstImg).data.publicUrl);
        }
      }
      setLoading(false);
    };

    fetchCar();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-yellow"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center pt-20">
        <Heading as="h2" className="mb-4">Vehicle Not Found</Heading>
        <Button href="/shop">Return to Inventory</Button>
      </div>
    );
  }

  const specs = [
    { label: 'Year', value: car.year.toString() },
    { label: 'Mileage', value: car.mileage ? `${car.mileage.toLocaleString()} km` : 'New' },
    { label: 'Engine', value: car.engine_cc ? `${(car.engine_cc / 1000).toFixed(1)}L` : 'N/A' },
    { label: 'Transmission', value: car.transmission || 'N/A' },
    { label: 'Fuel Type', value: car.fuel_type || 'N/A' },
    { label: 'Exterior', value: car.color || 'N/A' },
    { label: 'Doors', value: car.doors?.toString() || 'N/A' },
    { label: 'Registration', value: car.first_registration || 'N/A' },
  ];

  const seoTitle = `${car.year} ${car.brand} ${car.model}`;
  const seoDescription = `For Sale: ${car.year} ${car.brand} ${car.model}. ${car.color} exterior, ${car.mileage ? car.mileage + ' km' : 'Low mileage'}. Price: ${car.currency} ${car.price.toLocaleString()}.`;

  return (
    <div className="bg-brand-black min-h-screen">
      <SEO 
        title={seoTitle}
        description={seoDescription}
        image={activeImage}
        type="product"
        price={{ amount: car.price, currency: car.currency }}
      />
      {/* Hero Image & Gallery */}
      <div className="relative h-[60vh] md:h-[80vh] w-full bg-brand-gray/10">
        {activeImage ? (
          <img 
            src={activeImage} 
            alt={car.model} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-muted">No Images Available</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" />
        
        <Container className="absolute bottom-0 left-0 right-0 pb-12 z-10 pointer-events-none">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
               <Label className="text-brand-yellow mb-2 block animate-fade-in-up">{car.year} {car.brand}</Label>
               <Heading as="h1" className="mb-2 animate-fade-in-up delay-100">{car.model}</Heading>
            </div>
            <div className="pointer-events-auto animate-fade-in-up delay-200">
               <span className="block text-brand-muted text-xs uppercase font-bold tracking-widest mb-1">Price</span>
               <p className="text-3xl md:text-5xl text-white font-display font-bold">{car.currency} {car.price.toLocaleString()}</p>
            </div>
          </div>
        </Container>
      </div>

      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Column: Description & Gallery Thumbnails */}
            <div className="lg:col-span-8">
              <div className="mb-12">
                 <Heading as="h3" className="mb-6 text-2xl">Vehicle Description</Heading>
                 <Text className="text-lg whitespace-pre-line leading-relaxed text-white/80">
                   {car.description || `Experience the pinnacle of automotive engineering with this ${car.year} ${car.brand} ${car.model}.`}
                 </Text>
              </div>

              {/* Gallery Grid */}
              {car.images && car.images.length > 1 && (
                <div className="space-y-4">
                  <Label className="text-brand-muted">Gallery</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {car.images.map((img, idx) => {
                      const url = img.startsWith('http') ? img : supabase.storage.from('car-images').getPublicUrl(img).data.publicUrl;
                      return (
                        <button 
                          key={idx}
                          onClick={() => {
                             setActiveImage(url);
                             window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`aspect-square overflow-hidden border border-white/10 hover:border-brand-yellow transition-colors ${activeImage === url ? 'border-brand-yellow ring-1 ring-brand-yellow' : ''}`}
                        >
                          <img 
                            src={url}
                            alt={`View ${idx}`} 
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Sticky Specs & CTA */}
            <div className="lg:col-span-4">
              <div className="bg-brand-gray/20 p-8 border border-white/5 sticky top-24 backdrop-blur-sm">
                <Heading as="h4" className="mb-6 pb-6 border-b border-white/10 text-xl">Technical Data</Heading>
                <div className="space-y-4 mb-8">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <span className="text-brand-muted text-xs uppercase tracking-widest">{spec.label}</span>
                      <span className="text-white font-bold font-sans text-sm text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                   <Button href="/contact" className="w-full">Inquire Now</Button>
                   <Button variant="outline" className="w-full">Download PDF</Button>
                </div>
                
                <p className="mt-6 text-xs text-brand-muted text-center leading-relaxed">
                  Vehicle availability and price subject to change. <br/>Contact us for the latest information.
                </p>
              </div>
            </div>

          </div>
        </Container>
      </Section>
    </div>
  );
};