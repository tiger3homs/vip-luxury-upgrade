import React, { useEffect, useState } from 'react';
import { Container } from '../components/Container';
import { Section } from '../components/Section';
import { Button } from '../components/Button';
import { Heading, Text, Label } from '../components/Typography';
import { GridBackground } from '../components/GridBackground';
import { Link } from 'react-router-dom';
import { supabase, Car } from '../services/supabase';
import { SEO } from '../components/SEO';
import { TestimonialsSection } from '../components/features/Testimonials';
import { VideoSection } from '../components/features/VideoSection';
import { BrandShowcase } from '../components/features/BrandShowcase';
import { AnimatedStatsSection } from '../components/features/AnimatedStats';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen min-h-[800px] flex items-center overflow-hidden">
      {/* Dynamic Background with Parallax */}
      <div 
        className="absolute inset-0 bg-brand-black"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <GridBackground opacity={0.15} />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black/80 via-transparent to-brand-black/80 z-10" />
        
        {/* Animated Gold Glow */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-gold/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-silver/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <Container className="relative z-20 w-full">
        <div className="max-w-4xl">
          <Label className="mb-6 block animate-fade-in-up text-brand-gold">
            <span className="inline-flex items-center gap-2">
              <span className="w-12 h-[2px] bg-brand-gold"></span>
              The New Collection 2025
            </span>
          </Label>
          
          <Heading as="h1" className="mb-8 animate-fade-in-up stagger-1">
            Redefine <span className="text-gold-metallic">Luxury</span>
            <br />
            <span className="text-transparent" style={{ WebkitTextStroke: '2px #fff', transition: 'all 0.5s' }}>
              Performance
            </span>
          </Heading>
          
          <Text className="max-w-xl mb-10 text-lg animate-fade-in-up stagger-2 text-white/80">
            Experience the pinnacle of automotive engineering. Discover Switzerland's most exclusive collection of luxury vehicles, curated for those who accept nothing less than perfection.
          </Text>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-3">
            <Button href="/shop" className="btn-premium">
              <span className="relative z-10">Explore Collection</span>
            </Button>
            <Button href="/contact" variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black">
              <span className="flex items-center gap-2">
                Schedule Visit
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </span>
            </Button>
          </div>
        </div>
      </Container>
      
      {/* Decorative Elements - Enhanced */}
      <div className="absolute bottom-12 right-12 z-20 hidden md:block animate-fade-in-right">
        <div className="flex flex-col items-end space-y-4">
          <div className="text-right">
            <span className="text-brand-gold font-display font-bold text-4xl block">01</span>
            <div className="w-16 h-[3px] bg-gradient-to-r from-brand-gold to-brand-goldDark ml-auto mt-2" />
          </div>
          <span className="text-white/20 font-display font-bold text-2xl">05</span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 animate-bounce-slow">
        <div className="flex flex-col items-center gap-2">
          <span className="text-brand-gold text-xs uppercase tracking-widest">Scroll</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-gold">
            <path d="M12 5v14"></path>
            <path d="m19 12-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </section>
  );
};

const PremiumFeatureCard = ({ car, index }: { car: Car; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const image = car.images && car.images.length > 0 
    ? (car.images[0].startsWith('http') ? car.images[0] : supabase.storage.from('car-images').getPublicUrl(car.images[0]).data.publicUrl)
    : "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=1000&fit=crop";

  return (
    <div 
      className="group relative aspect-[4/5] bg-brand-gray overflow-hidden border border-white/10 hover:border-brand-gold/50 transition-all duration-700 premium-card animate-scale-in"
      style={{ animationDelay: `${index * 0.2}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image with 3D Effect */}
      <div className="absolute inset-0 card-3d">
        <div className="absolute inset-0 bg-brand-dark/50 group-hover:bg-brand-dark/20 transition-all duration-700 z-10" />
        <img 
          src={image} 
          alt={car.title}
          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 grayscale-[0.3] group-hover:grayscale-0"
          style={{
            transform: isHovered ? 'scale(1.1) translateZ(20px)' : 'scale(1)',
          }}
        />
        
        {/* Gold Glow Effect on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-gold/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
      </div>

      {/* Premium Badge */}
      {car.condition === 'new' && (
        <div className="absolute top-6 left-6 z-20">
          <div className="glass-morph-gold px-4 py-2 animate-fade-in-left">
            <span className="text-brand-gold font-bold uppercase tracking-widest text-xs">New Arrival</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-brand-black via-brand-black/90 to-transparent">
        <Label className="text-xs mb-2 block text-brand-gold">{car.brand}</Label>
        <Heading as="h4" className="mb-2 truncate text-2xl">{car.model}</Heading>
        <p className="text-brand-silver font-sans mb-4 text-lg">
          {car.currency} {car.price.toLocaleString()}
        </p>
        
        {/* Quick Specs */}
        <div className="flex gap-4 text-xs text-brand-muted mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            {car.year}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            {car.fuel_type || 'Petrol'}
          </span>
          {car.power_hp && (
            <span>{car.power_hp} HP</span>
          )}
        </div>

        {/* CTA */}
        <div className="translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div className="inline-flex items-center gap-2 text-brand-gold text-sm font-bold uppercase tracking-widest border-b-2 border-brand-gold pb-1 group-hover:gap-4 transition-all">
            Discover More
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Home: React.FC = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
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
        title="VIP Luxury Cars - Switzerland's Premier Luxury Vehicle Dealer" 
        description="Discover Switzerland's most exclusive luxury vehicles. Mercedes-Benz, BMW, Porsche, Audi, Range Rover. Premium selection, exceptional service."
      />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Featured Cars Section */}
      <Section className="bg-brand-black py-24 relative overflow-hidden">
        <GridBackground opacity={0.05} />
        <Container>
          <div className="flex justify-between items-end mb-16 animate-fade-in-up">
            <div>
              <Label className="mb-4 block text-brand-silver">
                <span className="inline-flex items-center gap-2">
                  <span className="w-12 h-[2px] bg-brand-silver"></span>
                  Exclusive Selection
                </span>
              </Label>
              <Heading as="h2">
                Featured <span className="text-silver-chrome">Collection</span>
              </Heading>
            </div>
            <Button href="/shop" variant="outline" className="hidden md:inline-flex border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black">
              View Full Inventory
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCars.length > 0 ? (
              featuredCars.map((car, index) => (
                <Link key={car.id} to={`/cars/${car.slug}`}>
                  <PremiumFeatureCard car={car} index={index} />
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold mb-4"></div>
                <p className="text-brand-muted">Loading exclusive collection...</p>
              </div>
            )}
          </div>

          {/* Mobile CTA */}
          <div className="md:hidden mt-12 text-center">
            <Button href="/shop" variant="outline" className="border-brand-gold text-brand-gold">
              View Full Inventory
            </Button>
          </div>
        </Container>
      </Section>

      {/* Animated Stats */}
      <AnimatedStatsSection />

      {/* Brand Showcase */}
      <BrandShowcase />

      {/* Video Section */}
      <VideoSection 
        title="Experience Luxury in Motion"
        subtitle="Virtual Showroom Tour"
        description="Take a virtual tour of our exclusive showroom. See our premium vehicles in stunning 4K detail and explore every feature from the comfort of your home."
      />

      {/* Philosophy Section - Enhanced */}
      <Section className="relative bg-brand-gray border-y border-white/5 py-24">
        <GridBackground opacity={0.05} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-premium-glow opacity-20" />
        
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-left">
              <Label className="mb-6 block text-brand-gold">
                <span className="inline-flex items-center gap-2">
                  <span className="w-12 h-[2px] bg-brand-gold"></span>
                  Our Philosophy
                </span>
              </Label>
              <Heading as="h2" className="mb-8">
                Beyond <br />
                <span className="text-gold-metallic">Transportation</span>
              </Heading>
              <Text className="mb-6 text-lg leading-relaxed">
                We believe that a vehicle is more than just a means of getting from point A to point B. It is an expression of art, engineering excellence, and personal style.
              </Text>
              <Text className="mb-8 leading-relaxed">
                Our team of automotive experts scours Switzerland and beyond to find the rarest, most exceptional examples of automotive history and future innovation. Each vehicle in our collection represents the pinnacle of luxury and performance.
              </Text>
              
              {/* Feature List */}
              <div className="space-y-4 mb-8">
                {[
                  'Certified Pre-Owned Luxury Vehicles',
                  'Comprehensive Vehicle History Reports',
                  'Premium After-Sales Service',
                  'Exclusive Financing Options'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 animate-fade-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-brand-gold">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="text-white">{feature}</span>
                  </div>
                ))}
              </div>

              <Button href="/about" variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black">
                Read Our Story
              </Button>
            </div>
            
            <div className="relative h-[600px] border border-white/10 p-4 animate-fade-in-right">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-3xl rounded-full pointer-events-none animate-pulse-glow" />
              <div className="h-full w-full bg-brand-black relative overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&h=1200&fit=crop" 
                  alt="Luxury Car Interior" 
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-all duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-8 left-8 glass-morph-gold px-6 py-3">
                  <span className="text-brand-gold font-bold uppercase tracking-widest text-sm">Premium Service</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section - Enhanced */}
      <Section className="bg-brand-black py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-premium-glow opacity-20" />
        <div className="absolute inset-0">
          <GridBackground opacity={0.1} />
        </div>
        
        <Container className="text-center max-w-3xl relative z-10">
          <Label className="mb-6 block text-brand-silver animate-fade-in-up">
            Stay Connected
          </Label>
          <Heading as="h2" className="mb-6 animate-fade-in-up stagger-1">
            Join Our <span className="text-gold-metallic">Exclusive</span> Community
          </Heading>
          <Text className="mb-10 text-lg animate-fade-in-up stagger-2">
            Subscribe to receive private offers, new arrival notifications, and invitations to exclusive VIP events.
          </Text>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto animate-fade-in-up stagger-3">
            <input 
              type="email" 
              placeholder="YOUR EMAIL ADDRESS" 
              className="flex-grow bg-transparent border-2 border-white/20 px-6 py-4 text-white font-sans focus:border-brand-gold focus:outline-none transition-colors uppercase tracking-widest text-sm placeholder:text-white/30"
            />
            <Button type="submit" className="btn-premium whitespace-nowrap">
              <span className="relative z-10">Subscribe</span>
            </Button>
          </form>

          <p className="text-brand-muted text-xs mt-6">
            By subscribing, you agree to receive marketing communications. Unsubscribe anytime.
          </p>
        </Container>
      </Section>
    </>
  );
};
