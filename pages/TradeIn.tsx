import React, { useState } from 'react';
import { Container } from '../components/Container';
import { Section } from '../components/Section';
import { Heading, Text, Label } from '../components/Typography';
import { Button } from '../components/Button';
import { SEO } from '../components/SEO';
import { Input, Select, Textarea } from '../components/ui/Input';
import { CAR_BRANDS, BODY_TYPES, FUEL_TYPES, TRANSMISSION_TYPES } from '../services/supabase';

export const TradeIn: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Vehicle Info
    brand: '',
    model: '',
    year: '',
    bodyType: '',
    fuelType: '',
    transmission: '',
    mileage: '',
    exteriorColor: '',
    interiorColor: '',
    // Condition
    condition: '',
    accidentHistory: '',
    serviceHistory: '',
    modifications: '',
    issues: '',
    // Contact
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredContact: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitted(true);
    setLoading(false);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="bg-brand-black min-h-screen">
      <SEO
        title="Sell or Trade Your Car | VIP Luxury Cars"
        description="Get a fair valuation for your current vehicle. Trade in or sell directly to VIP Luxury Cars."
      />

      {/* Hero Section */}
      <div className="pt-32 pb-16 border-b border-white/5 bg-gradient-to-b from-brand-gray/30 to-transparent">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Label className="text-brand-yellow mb-4 block">Trade-In & Sell</Label>
              <Heading as="h1" className="text-4xl md:text-5xl mb-6">
                Get Top Value for Your Vehicle
              </Heading>
              <Text className="text-lg text-white/80 mb-8">
                Whether you're looking to trade in your current car or sell it outright,
                we offer competitive prices and a hassle-free experience.
              </Text>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-yellow">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-white">Free Valuation</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-yellow">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-white">Same-Day Offer</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-yellow">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-white">No Obligation</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="aspect-video bg-brand-gray/30 border border-white/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-brand-yellow/30">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
                  <circle cx="7" cy="17" r="2"></circle>
                  <circle cx="17" cy="17" r="2"></circle>
                </svg>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Steps Indicator */}
      <div className="py-8 border-b border-white/5">
        <Container>
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    step >= s
                      ? 'bg-brand-yellow border-brand-yellow text-brand-black font-bold'
                      : 'border-white/30 text-white/30'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-0.5 ${step > s ? 'bg-brand-yellow' : 'bg-white/20'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-center gap-8 mt-4 text-sm">
            <span className={step >= 1 ? 'text-white' : 'text-white/30'}>Vehicle Info</span>
            <span className={step >= 2 ? 'text-white' : 'text-white/30'}>Condition</span>
            <span className={step >= 3 ? 'text-white' : 'text-white/30'}>Contact</span>
          </div>
        </Container>
      </div>

      {/* Form Section */}
      <Section className="py-16">
        <Container>
          <div className="max-w-2xl mx-auto">
            {submitted ? (
              <div className="p-12 bg-brand-gray/30 border border-brand-yellow/30 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-yellow/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-yellow">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <Heading as="h2" className="text-2xl mb-4">Request Submitted!</Heading>
                <Text className="text-brand-muted mb-8">
                  Thank you for your trade-in request. Our team will review your vehicle details
                  and contact you with a valuation within 24 hours.
                </Text>
                <Button href="/shop">Browse Our Inventory</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Step 1: Vehicle Info */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="mb-8">
                      <Heading as="h2" className="text-2xl mb-2">Vehicle Information</Heading>
                      <Text className="text-brand-muted">Tell us about your vehicle.</Text>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        label="Brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        options={CAR_BRANDS.map((b) => ({ value: b, label: b }))}
                        required
                      />
                      <Input
                        label="Model"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        placeholder="e.g., 911 Carrera"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        label="Year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        options={years.map((y) => ({ value: y.toString(), label: y.toString() }))}
                        required
                      />
                      <Select
                        label="Body Type"
                        name="bodyType"
                        value={formData.bodyType}
                        onChange={handleChange}
                        options={BODY_TYPES.map((b) => ({ value: b.value, label: b.label }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        label="Fuel Type"
                        name="fuelType"
                        value={formData.fuelType}
                        onChange={handleChange}
                        options={FUEL_TYPES.map((f) => ({ value: f.value, label: f.label }))}
                      />
                      <Select
                        label="Transmission"
                        name="transmission"
                        value={formData.transmission}
                        onChange={handleChange}
                        options={TRANSMISSION_TYPES.map((t) => ({ value: t.value, label: t.label }))}
                      />
                    </div>

                    <Input
                      label="Mileage (km)"
                      type="number"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleChange}
                      placeholder="e.g., 45000"
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Exterior Color"
                        name="exteriorColor"
                        value={formData.exteriorColor}
                        onChange={handleChange}
                        placeholder="e.g., Black Metallic"
                      />
                      <Input
                        label="Interior Color"
                        name="interiorColor"
                        value={formData.interiorColor}
                        onChange={handleChange}
                        placeholder="e.g., Cognac Leather"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="button" onClick={() => setStep(2)}>
                        Continue →
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Condition */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="mb-8">
                      <Heading as="h2" className="text-2xl mb-2">Vehicle Condition</Heading>
                      <Text className="text-brand-muted">Help us understand your vehicle's condition.</Text>
                    </div>

                    <Select
                      label="Overall Condition"
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      options={[
                        { value: 'excellent', label: 'Excellent - Like new, no visible wear' },
                        { value: 'very_good', label: 'Very Good - Minor wear, well maintained' },
                        { value: 'good', label: 'Good - Normal wear for age/mileage' },
                        { value: 'fair', label: 'Fair - Some visible damage or issues' },
                        { value: 'poor', label: 'Poor - Significant damage or mechanical issues' },
                      ]}
                      required
                    />

                    <Select
                      label="Accident History"
                      name="accidentHistory"
                      value={formData.accidentHistory}
                      onChange={handleChange}
                      options={[
                        { value: 'none', label: 'No accidents' },
                        { value: 'minor', label: 'Minor accident(s) - fully repaired' },
                        { value: 'major', label: 'Major accident - repaired' },
                        { value: 'unrepaired', label: 'Damage not fully repaired' },
                      ]}
                      required
                    />

                    <Select
                      label="Service History"
                      name="serviceHistory"
                      value={formData.serviceHistory}
                      onChange={handleChange}
                      options={[
                        { value: 'full', label: 'Full service history available' },
                        { value: 'partial', label: 'Partial service history' },
                        { value: 'none', label: 'No service records' },
                      ]}
                    />

                    <Textarea
                      label="Modifications or Upgrades"
                      name="modifications"
                      value={formData.modifications}
                      onChange={handleChange}
                      rows={3}
                      placeholder="List any aftermarket modifications, upgrades, or accessories..."
                    />

                    <Textarea
                      label="Known Issues"
                      name="issues"
                      value={formData.issues}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Describe any mechanical issues, warning lights, or problems..."
                    />

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        ← Back
                      </Button>
                      <Button type="button" onClick={() => setStep(3)}>
                        Continue →
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="mb-8">
                      <Heading as="h2" className="text-2xl mb-2">Your Contact Information</Heading>
                      <Text className="text-brand-muted">How can we reach you with our offer?</Text>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="Phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <Select
                      label="Preferred Contact Method"
                      name="preferredContact"
                      value={formData.preferredContact}
                      onChange={handleChange}
                      options={[
                        { value: 'email', label: 'Email' },
                        { value: 'phone', label: 'Phone Call' },
                        { value: 'whatsapp', label: 'WhatsApp' },
                      ]}
                    />

                    <Textarea
                      label="Additional Notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Anything else we should know about your vehicle or trade-in preferences..."
                    />

                    <div className="p-4 bg-brand-yellow/10 border border-brand-yellow/30 text-sm">
                      <p className="text-white">
                        <strong>What happens next?</strong>
                      </p>
                      <ul className="mt-2 space-y-1 text-brand-muted">
                        <li>• We'll review your submission within 24 hours</li>
                        <li>• You'll receive a preliminary valuation</li>
                        <li>• We'll schedule an in-person inspection if you're interested</li>
                        <li>• Get a final offer and complete the trade or sale</li>
                      </ul>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep(2)}>
                        ← Back
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Request'}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </Container>
      </Section>

      {/* Why Trade With Us */}
      <Section className="py-16 bg-brand-gray border-t border-white/5">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" className="text-2xl mb-4">Why Trade With VIP Luxury Cars?</Heading>
            <Text className="max-w-2xl mx-auto text-brand-muted">
              We specialize in luxury and performance vehicles, which means we can offer you
              top market value for your premium car.
            </Text>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Expert Valuations',
                desc: 'Our specialists understand the true value of luxury vehicles, including rare options and special editions.',
              },
              {
                title: 'Transparent Process',
                desc: 'No hidden fees or surprises. We explain exactly how we arrive at our offer.',
              },
              {
                title: 'Quick Payment',
                desc: 'Once we agree on a price, you\'ll receive payment within 48 hours.',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-brand-dark border border-white/10 text-center">
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-brand-muted text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
};
