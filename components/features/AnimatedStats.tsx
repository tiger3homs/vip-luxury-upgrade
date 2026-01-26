import React, { useState, useEffect, useRef } from 'react';
import { Container } from '../Container';

interface StatProps {
  end: number;
  label: string;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}

const AnimatedStat: React.FC<StatProps> = ({
  end,
  label,
  suffix = '',
  prefix = '',
  duration = 2000,
  decimals = 0,
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          const startTime = Date.now();
          const startValue = 0;
          
          const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = startValue + (end - startValue) * easeOutQuart;
            
            setCount(current);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          animate();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [end, duration, hasAnimated]);

  const displayValue = count.toFixed(decimals);

  return (
    <div ref={ref} className="text-center">
      <div className="text-6xl md:text-7xl font-display font-bold text-gold-metallic mb-4 tabular-nums">
        {prefix}{displayValue}{suffix}
      </div>
      <div className="text-brand-muted text-sm uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
};

export const AnimatedStatsSection: React.FC = () => {
  return (
    <section className="py-20 bg-brand-black relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-silver/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      
      <Container className="relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <AnimatedStat
            end={500}
            suffix="+"
            label="Vehicles Sold"
          />
          <AnimatedStat
            end={450}
            suffix="+"
            label="Happy Clients"
          />
          <AnimatedStat
            end={4.9}
            decimals={1}
            label="Customer Rating"
          />
          <AnimatedStat
            end={15}
            suffix="+"
            label="Years Experience"
          />
        </div>
      </Container>
    </section>
  );
};
