import React from 'react';
import { Container } from '../components/Container';
import { Section } from '../components/Section';
import { Heading, Text, Label } from '../components/Typography';
import { Button } from '../components/Button';
import { GridBackground } from '../components/GridBackground';

export const Sale: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-black">
      <Section>
        <GridBackground opacity={0.05} />
        <Container>
          <div className="text-center max-w-4xl mx-auto mb-20">
            <Label className="text-brand-yellow mb-4 block">Limited Time Opportunities</Label>
            <Heading as="h1" className="mb-6">Exclusive <span className="text-brand-yellow">Offers</span></Heading>
            <Text>Exceptional vehicles with special acquisition terms for qualified members.</Text>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {[1, 2].map((item) => (
              <div key={item} className="grid grid-cols-1 lg:grid-cols-2 bg-brand-gray border border-white/5 group hover:border-brand-yellow/30 transition-all">
                <div className="relative aspect-video lg:aspect-auto overflow-hidden">
                  <img src={`https://picsum.photos/seed/${item + 100}/1200/800`} alt="Offer" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute top-6 left-6 bg-brand-yellow text-brand-black px-4 py-2 font-bold uppercase tracking-widest text-sm">
                    Special Lease
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <Label className="mb-2 block">2023 Model</Label>
                  <Heading as="h3" className="mb-4">Aston Martin DBX707</Heading>
                  <div className="flex items-baseline space-x-4 mb-6">
                    <span className="text-3xl font-display font-bold text-white">$3,499<span className="text-lg text-brand-muted">/mo</span></span>
                    <span className="text-brand-muted line-through">$4,199/mo</span>
                  </div>
                  <Text className="mb-8">
                    36 Month Lease. $25,000 due at signing. Excludes tax, title, and license fees. Subject to credit approval.
                  </Text>
                  <Button variant="outline">View Offer Details</Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
};