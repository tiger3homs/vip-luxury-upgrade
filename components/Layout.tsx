import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container } from './Container';
import { GridBackground } from './GridBackground';
import { ChatBot } from './ChatBot';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Models', path: '/shop' },
    { name: 'Exclusive', path: '/sale' },
    { name: 'Editorial', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled ? 'bg-brand-black/90 backdrop-blur-md border-white/10 py-4' : 'bg-transparent border-transparent py-6'}`}>
      <Container className="flex items-center justify-between">
        <Link to="/" className="relative z-50 group">
          <span className="font-display font-bold text-2xl tracking-tighter text-white">
            VIP<span className="text-brand-yellow">.</span>LUXURY
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`text-xs font-bold uppercase tracking-widest transition-colors hover:text-brand-yellow ${location.pathname === link.path ? 'text-brand-yellow' : 'text-white/80'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-6">
          <span className="hidden md:block text-xs font-bold text-brand-muted cursor-pointer hover:text-white transition-colors">EN / DE</span>
          <Link to="/admin/login" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-brand-yellow hover:text-brand-yellow transition-colors text-white/60">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </Link>
        </div>
      </Container>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-brand-dark border-t border-white/5 pt-20 pb-10 relative overflow-hidden">
      <GridBackground opacity={0.03} />
      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
             <span className="font-display font-bold text-3xl tracking-tighter text-white block mb-6">
              VIP<span className="text-brand-yellow">.</span>LUXURY
            </span>
            <p className="text-brand-muted max-w-sm mb-8">
              Bahnhofstrasse 29, 8956 Killwangen.<br/>
              Redefining automotive excellence. We curate the world's most exclusive vehicles for the most discerning collectors.
            </p>
            <div className="flex flex-col space-y-2 mb-6">
               <a href="tel:+41798000067" className="text-sm text-white hover:text-brand-yellow transition-colors font-bold">+41 79 800 00 67</a>
               <a href="mailto:Info@vipluxurycars.ch" className="text-sm text-white hover:text-brand-yellow transition-colors">Info@vipluxurycars.ch</a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-display uppercase tracking-widest font-bold mb-6">Inventory</h4>
            <ul className="space-y-4">
              {['All Vehicles', 'New Arrivals', 'Supercars', 'SUVs'].map(item => (
                <li key={item}><Link to="/shop" className="text-brand-muted hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-display uppercase tracking-widest font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-brand-muted hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-brand-muted hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/admin/login" className="text-brand-muted hover:text-white transition-colors">Dealer Login</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
          <p className="text-brand-muted text-sm mb-4 md:mb-0">© {new Date().getFullYear()} VIP Luxury Cars. vipluxurycars.ch</p>
          <div className="flex space-x-8">
            <a href="#" className="text-brand-muted text-sm hover:text-white">Privacy Policy</a>
            <a href="#" className="text-brand-muted text-sm hover:text-white">Impressum</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-brand-black text-brand-text flex flex-col font-sans selection:bg-brand-yellow selection:text-brand-black">
      <Header />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};