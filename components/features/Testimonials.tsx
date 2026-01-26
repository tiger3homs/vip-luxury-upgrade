import React, { useState, useEffect } from 'react';
import { Heading, Label, Text } from '../Typography';
import { Container } from '../Container';

interface Testimonial {
  id: number;
  name: string;
  title: string;
  content: string;
  rating: number;
  carPurchased?: string;
  image?: string;
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: 'Michael Weber',
    title: 'Porsche 911 Turbo S Owner',
    content: 'Exceptional service from start to finish. The team at VIP Luxury Cars went above and beyond to find my dream Porsche. Professional, transparent, and truly passionate about luxury automobiles.',
    rating: 5,
    carPurchased: 'Porsche 911 Turbo S',
  },
  {
    id: 2,
    name: 'Sarah Mueller',
    title: 'Mercedes-AMG GT Owner',
    content: 'The purchasing process was seamless. They handled all the paperwork efficiently and delivered the car in immaculate condition. I highly recommend VIP Luxury Cars to anyone seeking premium vehicles in Switzerland.',
    rating: 5,
    carPurchased: 'Mercedes-AMG GT',
  },
  {
    id: 3,
    name: 'Thomas Keller',
    title: 'BMW M5 Competition Owner',
    content: 'Outstanding experience! The attention to detail and customer care is unmatched. They truly understand the luxury car market and made my dream purchase a reality.',
    rating: 5,
    carPurchased: 'BMW M5 Competition',
  },
  {
    id: 4,
    name: 'Isabella Rossi',
    title: 'Range Rover Autobiography Owner',
    content: 'From the first consultation to delivery, everything was perfect. The team is knowledgeable, patient, and genuinely cares about finding the right vehicle for you. Five stars!',
    rating: 5,
    carPurchased: 'Range Rover Autobiography',
  },
  {
    id: 5,
    name: 'Andreas Schmidt',
    title: 'Audi RS6 Avant Owner',
    content: 'Professional service at the highest level. They found exactly what I was looking for and the entire process was transparent and efficient. Will definitely return for my next purchase!',
    rating: 5,
    carPurchased: 'Audi RS6 Avant',
  },
];

export const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonialsData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonialsData.length);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-premium-glow opacity-30" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-silver/5 rounded-full blur-3xl" />
      
      <Container className="relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <Label className="text-brand-gold mb-4 block">Client Testimonials</Label>
          <Heading as="h2" className="mb-6">
            What Our <span className="text-gold-metallic">Clients Say</span>
          </Heading>
          <Text className="max-w-2xl mx-auto">
            Join hundreds of satisfied clients who found their dream luxury vehicle with us.
          </Text>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonialsData.map((testimonial, index) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="glass-morph p-12 text-center animate-fade-in">
                    {/* Rating Stars */}
                    <div className="flex justify-center gap-2 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-brand-gold animate-scale-in" style={{ animationDelay: `${i * 0.1}s` }}>
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-2xl text-white/90 font-light leading-relaxed mb-8 italic">
                      "{testimonial.content}"
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-gold to-brand-goldDark flex items-center justify-center">
                        <span className="text-2xl font-display font-bold text-brand-black">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="text-white font-display font-bold text-xl">{testimonial.name}</p>
                        <p className="text-brand-muted text-sm">{testimonial.title}</p>
                        {testimonial.carPurchased && (
                          <p className="text-brand-gold text-xs mt-1 uppercase tracking-widest">✓ Verified Purchase</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 bg-brand-gold/10 hover:bg-brand-gold hover:text-brand-black backdrop-blur border border-brand-gold/30 flex items-center justify-center transition-all group"
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-gold group-hover:text-brand-black">
              <path d="M15 18l-6-6 6-6"></path>
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 bg-brand-gold/10 hover:bg-brand-gold hover:text-brand-black backdrop-blur border border-brand-gold/30 flex items-center justify-center transition-all group"
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-gold group-hover:text-brand-black">
              <path d="M9 18l6-6-6-6"></path>
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex
                    ? 'w-12 bg-brand-gold'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-fade-in-up">
          <div className="text-center">
            <div className="text-5xl font-display font-bold text-gold-metallic mb-2 animate-count-up">500+</div>
            <div className="text-brand-muted text-sm uppercase tracking-widest">Cars Sold</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-display font-bold text-gold-metallic mb-2 animate-count-up">450+</div>
            <div className="text-brand-muted text-sm uppercase tracking-widest">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-display font-bold text-gold-metallic mb-2 animate-count-up">4.9</div>
            <div className="text-brand-muted text-sm uppercase tracking-widest">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-display font-bold text-gold-metallic mb-2 animate-count-up">15+</div>
            <div className="text-brand-muted text-sm uppercase tracking-widest">Years Experience</div>
          </div>
        </div>
      </Container>
    </section>
  );
};