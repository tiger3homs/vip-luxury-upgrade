import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from '../components/Container';
import { Section } from '../components/Section';
import { Heading, Text, Label } from '../components/Typography';
import { Button } from '../components/Button';
import { supabase, Car, formatPrice, formatMileage, getImageUrl } from '../services/supabase';
import { SEO } from '../components/SEO';
import { CarGallery } from '../components/features/CarGallery';
import { InquiryButtons } from '../components/features/InquiryForms';
import { FinancingCalculatorCompact } from '../components/features/FinancingCalculator';
import { Tabs, TabList, Tab, TabPanel } from '../components/ui/Tabs';
import { Badge, StatusBadge } from '../components/ui/Badge';

export const CarDetail: React.FC = () => {
  const { slug } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedCars, setRelatedCars] = useState<Car[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

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
        
        // Fetch related cars (same brand, different car)
        const { data: related } = await supabase
          .from('cars_for_sale')
          .select('*')
          .eq('brand', data.brand)
          .neq('id', data.id)
          .eq('status', 'available')
          .limit(3);
        
        setRelatedCars(related || []);

        // Check if favorited
        const savedFavorites = localStorage.getItem('carFavorites');
        if (savedFavorites) {
          const favorites = JSON.parse(savedFavorites);
          setIsFavorite(favorites.includes(data.id));
        }

        // Increment view count (in a real app, this would be server-side)
        // supabase.rpc('increment_view_count', { car_id: data.id });
      }
      setLoading(false);
    };

    fetchCar();
  }, [slug]);

  const toggleFavorite = () => {
    if (!car) return;
    const savedFavorites = localStorage.getItem('carFavorites');
    const favorites: string[] = savedFavorites ? JSON.parse(savedFavorites) : [];
    
    if (isFavorite) {
      const updated = favorites.filter((id) => id !== car.id);
      localStorage.setItem('carFavorites', JSON.stringify(updated));
    } else {
      favorites.push(car.id);
      localStorage.setItem('carFavorites', JSON.stringify(favorites));
    }
    setIsFavorite(!isFavorite);
  };

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
        <Text className="mb-8">The vehicle you're looking for is no longer available.</Text>
        <Button href="/shop">Return to Inventory</Button>
      </div>
    );
  }

  // Organize specifications
  const overviewSpecs = [
    { label: 'Year', value: car.year.toString() },
    { label: 'Mileage', value: car.mileage ? formatMileage(car.mileage) : 'New' },
    { label: 'Body Type', value: car.body_type || 'N/A' },
    { label: 'Condition', value: car.condition === 'new' ? 'New' : car.condition === 'certified_pre_owned' ? 'Certified Pre-Owned' : 'Used' },
    { label: 'Exterior Color', value: car.exterior_color || car.color || 'N/A' },
    { label: 'Interior Color', value: car.interior_color || 'N/A' },
  ];

  const engineSpecs = [
    { label: 'Engine', value: car.engine_cc ? `${(car.engine_cc / 1000).toFixed(1)}L` : 'N/A' },
    { label: 'Power', value: car.power_hp ? `${car.power_hp} HP` : 'N/A' },
    { label: 'Transmission', value: car.transmission || 'N/A' },
    { label: 'Drive Type', value: car.drive_type?.toUpperCase() || 'N/A' },
    { label: 'Fuel Type', value: car.fuel_type || 'N/A' },
    { label: 'Cylinders', value: car.cylinders?.toString() || 'N/A' },
  ];

  const efficiencySpecs = [
    { label: 'CO2 Emissions', value: car.co2_emissions ? `${car.co2_emissions} g/km` : 'N/A' },
    { label: 'Combined Consumption', value: car.fuel_consumption_combined ? `${car.fuel_consumption_combined} L/100km` : 'N/A' },
    { label: 'Efficiency Class', value: car.efficiency_class || 'N/A' },
  ];

  const historySpecs = [
    { label: 'First Registration', value: car.first_registration || 'N/A' },
    { label: 'Last MFK', value: car.last_mfk || 'N/A' },
    { label: 'Previous Owners', value: car.previous_owners?.toString() || 'N/A' },
    { label: 'Accident Free', value: car.accident_free === true ? 'Yes' : car.accident_free === false ? 'No' : 'N/A' },
    { label: 'Service History', value: car.service_history ? 'Complete' : 'N/A' },
  ];

  const seoTitle = `${car.year} ${car.brand} ${car.model} for Sale`;
  const seoDescription = `${car.year} ${car.brand} ${car.model}. ${car.exterior_color || car.color || ''} exterior, ${car.mileage ? formatMileage(car.mileage) : 'Low mileage'}. Price: ${formatPrice(car.price, car.currency)}.`;
  const primaryImage = car.images?.[0] ? getImageUrl(car.images[0]) : '';

  return (
    <div className="bg-brand-black min-h-screen">
      <SEO
        title={seoTitle}
        description={seoDescription}
        image={primaryImage}
        type="product"
        price={{ amount: car.price, currency: car.currency }}
      />

      {/* Breadcrumb */}
      <div className="pt-24 pb-4 border-b border-white/5">
        <Container>
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-brand-muted hover:text-white transition-colors">Home</Link>
            <span className="text-brand-muted">/</span>
            <Link to="/shop" className="text-brand-muted hover:text-white transition-colors">Inventory</Link>
            <span className="text-brand-muted">/</span>
            <span className="text-white">{car.brand} {car.model}</span>
          </nav>
        </Container>
      </div>

      {/* Main Content */}
      <Section className="py-8">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Gallery & Details */}
            <div className="lg:col-span-8">
              {/* Title for mobile */}
              <div className="lg:hidden mb-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Label className="text-brand-yellow mb-2 block">{car.brand}</Label>
                    <Heading as="h1" className="text-3xl">{car.year} {car.model}</Heading>
                  </div>
                  <button
                    onClick={toggleFavorite}
                    className={`p-3 border transition-colors ${isFavorite ? 'border-red-500 text-red-500' : 'border-white/20 text-white/60 hover:text-red-500'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                </div>
                <p className="text-3xl font-display font-bold text-white mt-4">
                  {formatPrice(car.price, car.currency)}
                </p>
              </div>

              {/* Image Gallery */}
              <CarGallery
                images={car.images || []}
                alt={`${car.year} ${car.brand} ${car.model}`}
              />

              {/* Quick Specs Bar */}
              <div className="flex flex-wrap gap-4 mt-6 p-4 bg-brand-gray/30 border border-white/10">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-yellow">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span className="text-white font-bold">{car.year}</span>
                </div>
                <div className="w-px h-6 bg-white/20"></div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-yellow">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span className="text-white font-bold">{car.mileage ? formatMileage(car.mileage) : 'New'}</span>
                </div>
                <div className="w-px h-6 bg-white/20"></div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-yellow">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                  <span className="text-white font-bold">{car.transmission || 'N/A'}</span>
                </div>
                <div className="w-px h-6 bg-white/20"></div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-yellow">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  </svg>
                  <span className="text-white font-bold">{car.fuel_type || 'N/A'}</span>
                </div>
                {car.power_hp && (
                  <>
                    <div className="w-px h-6 bg-white/20"></div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{car.power_hp} HP</span>
                    </div>
                  </>
                )}
              </div>

              {/* Specifications Tabs */}
              <div className="mt-8">
                <Tabs defaultTab="overview">
                  <TabList>
                    <Tab id="overview">Overview</Tab>
                    <Tab id="engine">Engine & Performance</Tab>
                    <Tab id="features">Features</Tab>
                    <Tab id="history">History</Tab>
                  </TabList>

                  <TabPanel id="overview" className="py-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {overviewSpecs.map((spec) => (
                        <div key={spec.label} className="p-4 bg-brand-gray/20 border border-white/5">
                          <span className="text-xs text-brand-muted uppercase tracking-widest block mb-1">{spec.label}</span>
                          <span className="text-white font-bold">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </TabPanel>

                  <TabPanel id="engine" className="py-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                      {engineSpecs.map((spec) => (
                        <div key={spec.label} className="p-4 bg-brand-gray/20 border border-white/5">
                          <span className="text-xs text-brand-muted uppercase tracking-widest block mb-1">{spec.label}</span>
                          <span className="text-white font-bold">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                    {car.fuel_type !== 'Electric' && (
                      <>
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Efficiency</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {efficiencySpecs.map((spec) => (
                            <div key={spec.label} className="p-4 bg-brand-gray/20 border border-white/5">
                              <span className="text-xs text-brand-muted uppercase tracking-widest block mb-1">{spec.label}</span>
                              <span className="text-white font-bold">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </TabPanel>

                  <TabPanel id="features" className="py-6">
                    {car.features && car.features.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {car.features.map((feature, idx) => (
                          <Badge key={idx} variant="default" size="md">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-brand-muted">Feature list not available. Contact us for details.</p>
                    )}
                    
                    {car.highlights && car.highlights.length > 0 && (
                      <div className="mt-8">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Highlights</h4>
                        <ul className="space-y-2">
                          {car.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-white">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-yellow flex-shrink-0">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </TabPanel>

                  <TabPanel id="history" className="py-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {historySpecs.map((spec) => (
                        <div key={spec.label} className="p-4 bg-brand-gray/20 border border-white/5">
                          <span className="text-xs text-brand-muted uppercase tracking-widest block mb-1">{spec.label}</span>
                          <span className="text-white font-bold">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                    {car.warranty_months && (
                      <div className="mt-6 p-4 bg-brand-yellow/10 border border-brand-yellow/30">
                        <p className="text-brand-yellow font-bold">
                          ✓ {car.warranty_months} Month Warranty Included
                          {car.warranty_km && ` (up to ${car.warranty_km.toLocaleString()} km)`}
                        </p>
                      </div>
                    )}
                  </TabPanel>
                </Tabs>
              </div>

              {/* Description */}
              {car.description && (
                <div className="mt-8 p-6 bg-brand-gray/20 border border-white/10">
                  <Heading as="h4" className="mb-4 text-xl">Vehicle Description</Heading>
                  <Text className="whitespace-pre-line leading-relaxed">
                    {car.description}
                  </Text>
                </div>
              )}
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* Price Card - Desktop */}
                <div className="hidden lg:block bg-brand-gray/30 border border-white/10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Label className="text-brand-yellow mb-1 block">{car.brand}</Label>
                      <Heading as="h1" className="text-2xl">{car.model}</Heading>
                      <p className="text-brand-muted text-sm mt-1">{car.year} • {car.variant}</p>
                    </div>
                    <button
                      onClick={toggleFavorite}
                      className={`p-2 border transition-colors ${isFavorite ? 'border-red-500 text-red-500' : 'border-white/20 text-white/60 hover:text-red-500 hover:border-red-500'}`}
                      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <StatusBadge status={car.status} />
                    {car.condition === 'new' && <Badge variant="premium">New</Badge>}
                    {car.original_price && car.original_price > car.price && (
                      <Badge variant="warning">Price Reduced</Badge>
                    )}
                  </div>

                  {/* Price */}
                  <div className="border-t border-white/10 pt-4">
                    {car.original_price && car.original_price > car.price && (
                      <p className="text-brand-muted line-through text-sm">
                        {formatPrice(car.original_price, car.currency)}
                      </p>
                    )}
                    <p className="text-4xl font-display font-bold text-white">
                      {car.price_type === 'upon_request' 
                        ? 'Price on Request' 
                        : formatPrice(car.price, car.currency)
                      }
                    </p>
                    {car.price_type === 'negotiable' && (
                      <p className="text-brand-yellow text-sm mt-1">Price negotiable</p>
                    )}
                  </div>
                </div>

                {/* Inquiry Buttons */}
                <div className="bg-brand-gray/30 border border-white/10 p-6">
                  <p className="text-xs text-brand-muted uppercase tracking-widest mb-4">Interested?</p>
                  <InquiryButtons car={car} />
                </div>

                {/* Financing Calculator */}
                {car.price_type !== 'upon_request' && (
                  <FinancingCalculatorCompact
                    vehiclePrice={car.price}
                    currency={car.currency}
                  />
                )}

                {/* Dealer Info */}
                <div className="bg-brand-gray/30 border border-white/10 p-6">
                  <p className="text-xs text-brand-muted uppercase tracking-widest mb-4">Dealer</p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-brand-yellow flex items-center justify-center">
                      <span className="font-display font-bold text-brand-black text-lg">VIP</span>
                    </div>
                    <div>
                      <p className="text-white font-bold">VIP Luxury Cars</p>
                      <p className="text-brand-muted text-sm">Killwangen, Switzerland</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <a href="tel:+41798000067" className="flex items-center gap-2 text-white hover:text-brand-yellow transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      +41 79 800 00 67
                    </a>
                    <a href="mailto:Info@vipluxurycars.ch" className="flex items-center gap-2 text-white hover:text-brand-yellow transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </svg>
                      Info@vipluxurycars.ch
                    </a>
                  </div>
                </div>

                {/* Share */}
                <div className="flex gap-2">
                  <button className="flex-1 py-3 border border-white/20 text-white/60 text-xs uppercase tracking-widest hover:border-white hover:text-white transition-colors flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    Share
                  </button>
                  <button className="flex-1 py-3 border border-white/20 text-white/60 text-xs uppercase tracking-widest hover:border-white hover:text-white transition-colors flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 6 2 18 2 18 9"></polyline>
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                      <rect x="6" y="14" width="12" height="8"></rect>
                    </svg>
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Related Cars */}
      {relatedCars.length > 0 && (
        <Section className="py-16 bg-brand-gray border-t border-white/5">
          <Container>
            <div className="flex items-center justify-between mb-8">
              <Heading as="h3">Similar Vehicles</Heading>
              <Link to={`/shop?brand=${car.brand}`} className="text-brand-yellow text-sm uppercase tracking-widest font-bold hover:text-white transition-colors">
                View All {car.brand} →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedCars.map((relatedCar) => (
                <Link
                  key={relatedCar.id}
                  to={`/cars/${relatedCar.slug}`}
                  className="group block border border-white/10 bg-brand-dark hover:border-brand-yellow/50 transition-all"
                >
                  <div className="aspect-video overflow-hidden">
                    {relatedCar.images?.[0] && (
                      <img
                        src={getImageUrl(relatedCar.images[0])}
                        alt={relatedCar.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-brand-muted">{relatedCar.year} {relatedCar.brand}</p>
                    <p className="text-white font-bold">{relatedCar.model}</p>
                    <p className="text-brand-yellow font-bold mt-2">{formatPrice(relatedCar.price, relatedCar.currency)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </div>
  );
};
