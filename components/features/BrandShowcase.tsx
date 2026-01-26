import React from 'react';
import { Heading, Label } from '../Typography';
import { Container } from '../Container';

const luxuryBrands = [
  { name: 'Mercedes-Benz', market: 'Leading Swiss Luxury Brand' },
  { name: 'BMW', market: 'Premium Performance' },
  { name: 'Porsche', market: 'Swiss Sports Car Favorite' },
  { name: 'Audi', market: 'German Engineering Excellence' },
  { name: 'Range Rover', market: 'Luxury SUV Leader' },
  { name: 'Tesla', market: 'Electric Innovation' },
];

export const BrandShowcase: React.FC = () => {
  return (
    <section className="py-16 bg-brand-gray border-y border-white/5 overflow-hidden">
      <Container>
        <div className="text-center mb-12 animate-fade-in-up">
          <Label className="text-brand-gold mb-4 block">Premium Brands</Label>
          <Heading as="h2" className="mb-4">
            Switzerland's Most <span className="text-gold-metallic">Sought-After</span> Luxury Brands
          </Heading>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {luxuryBrands.map((brand, index) => (
            <div
              key={brand.name}
              className="group relative aspect-square bg-brand-dark border border-white/10 hover:border-brand-gold/50 transition-all duration-500 overflow-hidden premium-card animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-premium-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                {/* Brand Initial */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-gold to-brand-goldDark flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <span className="text-3xl font-display font-bold text-brand-black">
                    {brand.name.charAt(0)}
                  </span>
                </div>
                
                {/* Brand Name */}
                <h3 className="text-white font-display font-bold text-lg mb-2 group-hover:text-brand-gold transition-colors">
                  {brand.name}
                </h3>
                
                {/* Market Position */}
                <p className="text-brand-muted text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {brand.market}
                </p>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-brand-gold to-transparent animate-shimmer" />
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-brand-gold to-transparent animate-shimmer" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Marquee Brands */}
        <div className="mt-16 relative overflow-hidden">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {[...luxuryBrands, ...luxuryBrands].map((brand, index) => (
              <span
                key={`${brand.name}-${index}`}
                className="text-6xl font-display font-bold text-white/5 uppercase tracking-wider"
              >
                {brand.name}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};