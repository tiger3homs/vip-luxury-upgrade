import React from 'react';
import { Container } from '../components/Container';
import { Section } from '../components/Section';
import { Heading, Text, Label } from '../components/Typography';
import { Button } from '../components/Button';
import { GridBackground } from '../components/GridBackground';
import { SEO } from '../components/SEO';

export const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-black">
      <SEO 
        title="Contact Us - Visit Our Showroom" 
        description="Visit VIP Luxury Cars at Bahnhofstrasse 29, 8956 Killwangen. Call +41 79 800 00 67 or email Info@vipluxurycars.ch."
      />
      <Section>
        <GridBackground opacity={0.05} />
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-20">
            <div>
              <Label className="mb-6 block">Get in Touch</Label>
              <Heading as="h1" className="mb-8">Start Your <br /><span className="text-brand-yellow">Journey</span></Heading>
              <Text className="mb-12">
                Whether you are looking to acquire a specific vehicle or sell one from your collection, our team is ready to assist you with discretion and expertise.
              </Text>

              <div className="space-y-8">
                <div>
                  <h4 className="text-white font-display font-bold uppercase tracking-widest mb-2">Showroom</h4>
                  <p className="text-brand-muted font-sans">
                    Bahnhofstrasse 29<br />
                    8956 Killwangen<br />
                    Switzerland
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-display font-bold uppercase tracking-widest mb-2">Contact</h4>
                  <p className="text-brand-muted font-sans">
                    <a href="tel:+41798000067" className="hover:text-brand-yellow transition-colors">+41 79 800 00 67</a><br />
                    <a href="mailto:Info@vipluxurycars.ch" className="hover:text-brand-yellow transition-colors">Info@vipluxurycars.ch</a>
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-display font-bold uppercase tracking-widest mb-2">Website</h4>
                  <p className="text-brand-muted font-sans">
                    <a href="https://vipluxurycars.ch" className="hover:text-brand-yellow transition-colors">vipluxurycars.ch</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-brand-gray/20 p-8 md:p-12 border border-white/5 backdrop-blur-sm">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-brand-muted">First Name</label>
                    <input type="text" className="w-full bg-brand-black border border-white/10 p-4 text-white focus:border-brand-yellow focus:outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-brand-muted">Last Name</label>
                    <input type="text" className="w-full bg-brand-black border border-white/10 p-4 text-white focus:border-brand-yellow focus:outline-none transition-colors" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-brand-muted">Email Address</label>
                  <input type="email" className="w-full bg-brand-black border border-white/10 p-4 text-white focus:border-brand-yellow focus:outline-none transition-colors" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-brand-muted">Interest</label>
                  <select className="w-full bg-brand-black border border-white/10 p-4 text-white focus:border-brand-yellow focus:outline-none transition-colors appearance-none">
                    <option>Buying a Vehicle</option>
                    <option>Selling a Vehicle</option>
                    <option>General Inquiry</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-widest text-brand-muted">Message</label>
                  <textarea rows={4} className="w-full bg-brand-black border border-white/10 p-4 text-white focus:border-brand-yellow focus:outline-none transition-colors"></textarea>
                </div>

                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </div>
          </div>
        </Container>
      </Section>

      {/* Map Section */}
      <div className="w-full h-[500px] border-t border-white/10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-brand-black z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-500 opacity-20" />
        <iframe 
          width="100%" 
          height="100%" 
          id="gmap_canvas" 
          src="https://maps.google.com/maps?q=Bahnhofstrasse+29%2C+8956+Killwangen&t=&z=15&ie=UTF8&iwloc=&output=embed" 
          frameBorder="0" 
          scrolling="no" 
          title="VIP Luxury Cars Location"
          className="w-full h-full filter grayscale invert-[0.9] contrast-[0.9] opacity-80 group-hover:filter-none group-hover:opacity-100 transition-all duration-700"
        ></iframe>
      </div>
    </div>
  );
};