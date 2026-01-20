import React, { useState } from 'react';
import { Container } from '../components/Container';
import { Section } from '../components/Section';
import { Heading, Text, Label } from '../components/Typography';
import { Button } from '../components/Button';
import { SEO } from '../components/SEO';
import { FinancingCalculator } from '../components/features/FinancingCalculator';
import { Input, Select, Textarea } from '../components/ui/Input';

export const Financing: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employmentStatus: '',
    annualIncome: '',
    vehicleInterest: '',
    downPayment: '',
    preferredTerm: '',
    message: '',
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

  const benefits = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
      title: 'Competitive Rates',
      description: 'We work with leading Swiss banks to offer you the best financing rates available.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      title: 'Quick Approval',
      description: 'Get a financing decision within 24 hours of submitting your application.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
      ),
      title: 'Flexible Terms',
      description: 'Choose from 12 to 84 month financing terms to fit your budget.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <polyline points="17 11 19 13 23 9"></polyline>
        </svg>
      ),
      title: 'Personal Service',
      description: 'Our finance experts guide you through every step of the process.',
    },
  ];

  return (
    <div className="bg-brand-black min-h-screen">
      <SEO
        title="Vehicle Financing | VIP Luxury Cars"
        description="Explore flexible financing options for your luxury vehicle purchase at VIP Luxury Cars. Competitive rates and quick approval."
      />

      {/* Hero Section */}
      <div className="pt-32 pb-16 border-b border-white/5 bg-gradient-to-b from-brand-gray/30 to-transparent">
        <Container>
          <div className="max-w-3xl">
            <Label className="text-brand-yellow mb-4 block">Financing Solutions</Label>
            <Heading as="h1" className="text-4xl md:text-5xl mb-6">
              Make Your Dream Car a Reality
            </Heading>
            <Text className="text-lg text-white/80 max-w-2xl">
              We offer tailored financing solutions to help you drive away in your perfect vehicle.
              Our partnerships with leading financial institutions ensure competitive rates and flexible terms.
            </Text>
          </div>
        </Container>
      </div>

      {/* Benefits Grid */}
      <Section className="py-16 border-b border-white/5">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="p-6 bg-brand-gray/20 border border-white/5">
                <div className="w-12 h-12 bg-brand-yellow/10 flex items-center justify-center text-brand-yellow mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Calculator & Form Section */}
      <Section className="py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Calculator */}
            <div>
              <Heading as="h2" className="text-2xl mb-2">Financing Calculator</Heading>
              <Text className="mb-8 text-brand-muted">
                Estimate your monthly payments with our interactive calculator.
              </Text>
              <FinancingCalculator vehiclePrice={150000} />
            </div>

            {/* Right: Application Form */}
            <div>
              <Heading as="h2" className="text-2xl mb-2">Pre-Qualification Application</Heading>
              <Text className="mb-8 text-brand-muted">
                Fill out this form to get pre-qualified. No impact on your credit score.
              </Text>

              {submitted ? (
                <div className="p-8 bg-brand-gray/30 border border-brand-yellow/30 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-yellow/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-yellow">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <Heading as="h3" className="mb-2">Application Submitted!</Heading>
                  <Text className="text-brand-muted">
                    Thank you for your interest. Our finance team will contact you within 24 hours.
                  </Text>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
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
                    label="Employment Status"
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleChange}
                    options={[
                      { value: 'employed', label: 'Employed' },
                      { value: 'self_employed', label: 'Self-Employed' },
                      { value: 'retired', label: 'Retired' },
                      { value: 'other', label: 'Other' },
                    ]}
                  />

                  <Input
                    label="Annual Income (CHF)"
                    type="number"
                    name="annualIncome"
                    value={formData.annualIncome}
                    onChange={handleChange}
                    placeholder="e.g., 120000"
                  />

                  <Input
                    label="Vehicle of Interest"
                    name="vehicleInterest"
                    value={formData.vehicleInterest}
                    onChange={handleChange}
                    placeholder="e.g., Mercedes-Benz G63 AMG"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Down Payment (CHF)"
                      type="number"
                      name="downPayment"
                      value={formData.downPayment}
                      onChange={handleChange}
                      placeholder="e.g., 50000"
                    />
                    <Select
                      label="Preferred Term"
                      name="preferredTerm"
                      value={formData.preferredTerm}
                      onChange={handleChange}
                      options={[
                        { value: '12', label: '12 Months' },
                        { value: '24', label: '24 Months' },
                        { value: '36', label: '36 Months' },
                        { value: '48', label: '48 Months' },
                        { value: '60', label: '60 Months' },
                        { value: '72', label: '72 Months' },
                        { value: '84', label: '84 Months' },
                      ]}
                    />
                  </div>

                  <Textarea
                    label="Additional Notes"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Any additional information or questions..."
                  />

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </Button>

                  <p className="text-xs text-brand-muted text-center">
                    By submitting, you agree to our{' '}
                    <a href="#" className="text-white hover:text-brand-yellow">Privacy Policy</a>
                    {' '}and authorize us to contact you regarding financing options.
                  </p>
                </form>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section className="py-16 bg-brand-gray border-t border-white/5">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Heading as="h2" className="text-center text-2xl mb-12">Frequently Asked Questions</Heading>
            <div className="space-y-6">
              {[
                {
                  q: 'What documents do I need for financing?',
                  a: 'You\'ll need a valid ID, proof of income (last 3 payslips or tax returns for self-employed), proof of residence, and bank statements from the last 3 months.',
                },
                {
                  q: 'What is the minimum down payment?',
                  a: 'While we recommend at least 20% down payment for the best rates, we can work with down payments as low as 10% depending on your credit profile.',
                },
                {
                  q: 'Can I pay off my loan early?',
                  a: 'Yes, most of our financing partners allow early repayment with minimal or no penalty. We can provide specific details based on your financing agreement.',
                },
                {
                  q: 'Do you offer leasing options?',
                  a: 'Yes, we offer both traditional financing and leasing options. Our team can help you determine which option best suits your needs.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="p-6 bg-brand-dark border border-white/10">
                  <h4 className="text-white font-bold mb-2">{faq.q}</h4>
                  <p className="text-brand-muted text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};
