import React, { useEffect, useState } from 'react';
import { Container } from '../components/Container';
import { Section } from '../components/Section';
import { Button } from '../components/Button';
import { Heading, Text, Label } from '../components/Typography';
import { GridBackground } from '../components/GridBackground';
import { Link } from 'react-router-dom';
import { supabase, Car } from '../services/supabase';
import { SEO } from '../components/SEO';

const Hero = () => (
  <section className="relative h-screen min-h-[800px] flex items-center overflow-hidden">
    <div className="absolute inset-0 bg-brand-black">
      <GridBackground opacity={0.15} />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/80 via-transparent to-brand-black/80 z-10" />
    </div>

    <Container className="relative z-20 w-full">
      <div className="max-w-4xl">
        <Label className="mb-6 block animate-fade-in-up">The New Collection 2024</Label>
        <Heading as="h1" className="mb-8 animate-fade-in-up delay-100">
          Future of <br />
          <span className="text-transparent stroke-text hover:text-brand-yellow transition-colors duration-500" style={{ WebkitTextStroke: '2px #fff' }}>Performance</span>
        </Heading>
        <Text className="max-w-xl mb-10 animate-fade-in-up delay-200">
          Experience the pinnacle of automotive engineering. Curated for those who demand nothing less than perfection.
        </Text>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
          <Button href="/shop">View Inventory</Button>
          <Button href="/contact" variant="outline">Inquire Now</Button>
        </div>
      </div>
    </Container>
    
    {/* Decorative Elements */}
    <div className="absolute bottom-12 right-12 z-20 hidden md:block">
      <div className="flex flex-col items-end space-y-2">
         <span className="text-brand-yellow font-display font-bold text-xl">01</span>
         <div className="w-12 h-[2px] bg-brand-yellow" />
         <span className="text-white/40 font-display font-bold text-xl">04</span>
      </div>
    </div>
  </section>
);

const FeatureCard = ({ car }: { car: Car }) => {
  const image = car.images && car.images.length > 0 
    ? (car.images[0].startsWith('http') ? car.images[0] : supabase.storage.from('car-images').getPublicUrl(car.images[0]).data.publicUrl)
    : "https://picsum.photos/800/1000?grayscale";

  return (
    <div className="group relative aspect-[4/5] bg-brand-gray overflow-hidden border border-white/5 hover:border-brand-yellow/50 transition-colors duration-500">
      <div className="absolute inset-0 bg-brand-dark/50 group-hover:bg-brand-dark/20 transition-all duration-500 z-10" />
      <img 
        src={image} 
        alt={car.title}
        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
      />
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-brand-black to-transparent">
        <Label className="text-xs mb-2 block">{car.brand}</Label>
        <Heading as="h4" className="mb-2 truncate">{car.model}</Heading>
        <p className="text-white/60 font-sans mb-6">{car.currency} {car.price.toLocaleString()}</p>
        <div className="translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <span className="text-brand-yellow text-sm font-bold uppercase tracking-widest border-b border-brand-yellow pb-1">View Details</span>
        </div>
      </div>
    </div>
  );
};

export const Home: React.FC = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      // Fetch 3 most recent available cars
      const { data } = await supabase
        .from('cars_for_sale')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (data) setFeaturedCars(data);
    };
    fetchFeatured();
  }, []);

  return (
    <>
      <SEO 
        title="Exclusive Automotive Collection" 
        description="Discover the world's most exclusive luxury vehicles. VIP Luxury Cars offers a curated selection of investment-grade automobiles."
      />
      <Hero />
      
      <Section className="bg-brand-black">
        <Container>
          <div className="flex justify-between items-end mb-16">
            <div>
              <Label className="mb-4 block">Selected Inventory</Label>
              <Heading as="h2">Featured <span className="text-brand-yellow">Arrivals</span></Heading>
            </div>
            <Button href="/shop" variant="secondary" className="hidden md:inline-flex">View All Cars</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCars.length > 0 ? (
              featuredCars.map(car => (
                <Link key={car.id} to={`/cars/${car.slug}`}>
                  <FeatureCard car={car} />
                </Link>
              ))
            ) : (
               <div className="col-span-3 text-brand-muted text-center py-12 border border-white/5">
                 Inventory is being updated.
               </div>
            )}
          </div>
        </Container>
      </Section>

      <Section className="relative bg-brand-gray border-y border-white/5">
        <GridBackground opacity={0.05} />
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Label className="mb-6 block">Our Philosophy</Label>
              <Heading as="h2" className="mb-8">Beyond <br />Transportation</Heading>
              <Text className="mb-6">
                We believe that a vehicle is more than just a means of getting from point A to point B. It is an expression of art, engineering, and personal style.
              </Text>
              <Text className="mb-8">
                Our team of experts scours the globe to find the rarest, most exceptional examples of automotive history and future innovation.
              </Text>
              <Button href="/about" variant="outline">Read Our Story</Button>
            </div>
            <div className="relative h-[600px] border border-white/10 p-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 blur-3xl rounded-full pointer-events-none" />
              <div className="h-full w-full bg-brand-black relative overflow-hidden">
                <img src="https://picsum.photos/id/234/1200/1200" alt="Interior" className="w-full h-full object-cover opacity-60 hover:opacity-80 transition-opacity duration-500" />
                <div className="absolute bottom-8 left-8 bg-brand-yellow px-4 py-2">
                   <span className="text-brand-black font-bold uppercase tracking-widest text-xs">Premium Service</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-brand-black">
        <Container className="text-center max-w-3xl">
          <Heading as="h2" className="mb-6">Stay <span className="text-brand-yellow">Connected</span></Heading>
          <Text className="mb-10">
            Join our exclusive list to receive private offers, new arrival notifications, and invitations to private events.
          </Text>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="ENTER YOUR EMAIL" 
              className="flex-grow bg-transparent border border-white/20 px-6 py-4 text-white font-sans focus:border-brand-yellow focus:outline-none transition-colors uppercase tracking-widest text-sm placeholder:text-white/30"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </Container>
      </Section>
    </>
  );
};