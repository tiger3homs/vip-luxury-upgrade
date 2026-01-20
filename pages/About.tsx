import React from 'react';
import { Container } from '../components/Container';
import { Section } from '../components/Section';
import { Heading, Text, Label } from '../components/Typography';
import { GridBackground } from '../components/GridBackground';

export const About: React.FC = () => {
  return (
    <div className="bg-brand-black">
      <Section className="pb-0">
        <GridBackground opacity={0.1} />
        <Container>
          <div className="max-w-5xl">
            <Label className="mb-6 block">Our Heritage</Label>
            <Heading as="h1" className="mb-12 text-7xl md:text-8xl">Driven By <br /><span className="text-brand-yellow">Obsession</span></Heading>
          </div>
        </Container>
        <div className="w-full h-[60vh] mt-12 relative overflow-hidden">
          <img src="https://picsum.photos/id/1070/1920/1080" alt="Garage" className="w-full h-full object-cover grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black to-transparent" />
        </div>
      </Section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div className="pt-12">
              <Heading as="h3" className="mb-6">The Art of Curation</Heading>
              <Text className="mb-6">
                Founded in 2010, VIP Luxury Cars began with a simple yet ambitious mission: to create the world's most transparent and exclusive marketplace for investment-grade automobiles.
              </Text>
              <Text>
                We view every vehicle in our collection not as a commodity, but as a masterpiece of engineering. Our team of historians and mechanics inspects every bolt, stitch, and seal to ensure perfection.
              </Text>
            </div>
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-24 h-24 border-l border-t border-brand-yellow/50" />
              <img src="https://picsum.photos/id/1071/600/800" alt="Detail" className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700" />
              <div className="absolute -right-4 -bottom-4 w-24 h-24 border-r border-b border-brand-yellow/50" />
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-brand-gray border-t border-white/5">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { label: 'Vehicles Sold', value: '2,500+' },
              { label: 'Client Satisfaction', value: '100%' },
              { label: 'Global Locations', value: '14' },
            ].map((stat) => (
              <div key={stat.label} className="p-8 border border-white/5 hover:border-brand-yellow/30 transition-colors">
                <div className="text-5xl md:text-6xl font-display font-bold text-white mb-4">{stat.value}</div>
                <Label>{stat.label}</Label>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
};