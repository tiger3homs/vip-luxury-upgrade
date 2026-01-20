import React, { useState } from 'react';
import { Car, supabase, formatPrice } from '../../services/supabase';
import { Input, Textarea, Select } from '../ui/Input';
import { Button } from '../Button';
import { Modal } from '../ui/Modal';

interface InquiryFormProps {
  car?: Car;
  type: 'general' | 'test_drive' | 'financing' | 'trade_in';
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({
  car,
  type,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    // Test drive specific
    preferredDate: '',
    preferredTime: '',
    // Financing specific
    monthlyBudget: '',
    downPayment: '',
    // Trade-in specific
    tradeInBrand: '',
    tradeInModel: '',
    tradeInYear: '',
    tradeInMileage: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const titles = {
    general: 'Send Inquiry',
    test_drive: 'Book Test Drive',
    financing: 'Request Financing',
    trade_in: 'Trade-In Valuation',
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (type === 'test_drive') {
      if (!formData.preferredDate) newErrors.preferredDate = 'Please select a date';
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required for test drive';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      const inquiryData = {
        car_id: car?.id,
        inquiry_type: type,
        customer_name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message || null,
        preferred_date: formData.preferredDate || null,
        preferred_time: formData.preferredTime || null,
        monthly_budget: formData.monthlyBudget ? Number(formData.monthlyBudget) : null,
        down_payment: formData.downPayment ? Number(formData.downPayment) : null,
        trade_in_brand: formData.tradeInBrand || null,
        trade_in_model: formData.tradeInModel || null,
        trade_in_year: formData.tradeInYear ? Number(formData.tradeInYear) : null,
        trade_in_mileage: formData.tradeInMileage ? Number(formData.tradeInMileage) : null,
        status: 'new',
      };

      const { error } = await supabase.from('inquiries').insert([inquiryData]);
      
      if (error) throw error;
      
      onSuccess?.();
      onClose();
      
      // Reset form
      setFormData({
        name: '', email: '', phone: '', message: '',
        preferredDate: '', preferredTime: '', monthlyBudget: '', downPayment: '',
        tradeInBrand: '', tradeInModel: '', tradeInYear: '', tradeInMileage: '',
      });
      
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={titles[type]} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Car info summary */}
        {car && (
          <div className="flex items-center gap-4 p-4 bg-brand-gray/30 border border-white/10">
            {car.images?.[0] && (
              <img
                src={car.images[0].startsWith('http') ? car.images[0] : supabase.storage.from('car-images').getPublicUrl(car.images[0]).data.publicUrl}
                alt={car.title}
                className="w-20 h-20 object-cover"
              />
            )}
            <div>
              <p className="text-xs text-brand-muted uppercase tracking-widest">{car.brand}</p>
              <p className="text-white font-display font-bold">{car.year} {car.model}</p>
              <p className="text-brand-yellow font-bold">{formatPrice(car.price, car.currency)}</p>
            </div>
          </div>
        )}

        {/* Basic Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="John Doe"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="john@example.com"
          />
        </div>

        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          required={type === 'test_drive'}
          placeholder="+41 79 123 45 67"
        />

        {/* Test Drive specific fields */}
        {type === 'test_drive' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Preferred Date"
              name="preferredDate"
              type="date"
              value={formData.preferredDate}
              onChange={handleChange}
              error={errors.preferredDate}
              required
              min={new Date().toISOString().split('T')[0]}
            />
            <Select
              label="Preferred Time"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              options={[
                { value: 'morning', label: 'Morning (9:00 - 12:00)' },
                { value: 'afternoon', label: 'Afternoon (12:00 - 17:00)' },
                { value: 'evening', label: 'Evening (17:00 - 19:00)' },
              ]}
              placeholder="Select a time"
            />
          </div>
        )}

        {/* Financing specific fields */}
        {type === 'financing' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Monthly Budget (CHF)"
                name="monthlyBudget"
                type="number"
                value={formData.monthlyBudget}
                onChange={handleChange}
                placeholder="e.g. 2000"
              />
              <Input
                label="Down Payment (CHF)"
                name="downPayment"
                type="number"
                value={formData.downPayment}
                onChange={handleChange}
                placeholder="e.g. 50000"
              />
            </div>
            <p className="text-xs text-brand-muted">
              Our financing partners will contact you with personalized options based on your budget.
            </p>
          </>
        )}

        {/* Trade-in specific fields */}
        {type === 'trade_in' && (
          <>
            <div className="border-t border-white/10 pt-6">
              <p className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Your Vehicle Details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Brand"
                  name="tradeInBrand"
                  value={formData.tradeInBrand}
                  onChange={handleChange}
                  placeholder="e.g. BMW"
                />
                <Input
                  label="Model"
                  name="tradeInModel"
                  value={formData.tradeInModel}
                  onChange={handleChange}
                  placeholder="e.g. M5"
                />
                <Input
                  label="Year"
                  name="tradeInYear"
                  type="number"
                  value={formData.tradeInYear}
                  onChange={handleChange}
                  placeholder="e.g. 2020"
                />
                <Input
                  label="Mileage (km)"
                  name="tradeInMileage"
                  type="number"
                  value={formData.tradeInMileage}
                  onChange={handleChange}
                  placeholder="e.g. 45000"
                />
              </div>
            </div>
          </>
        )}

        {/* Message */}
        <Textarea
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          placeholder={
            type === 'general'
              ? 'Tell us how we can help you...'
              : type === 'test_drive'
              ? 'Any special requests or questions about the test drive?'
              : 'Additional information that might help us assist you better...'
          }
        />

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-4 border border-white/20 text-white font-bold uppercase tracking-widest hover:border-white transition-colors"
          >
            Cancel
          </button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              'Send Request'
            )}
          </Button>
        </div>

        <p className="text-xs text-brand-muted text-center">
          By submitting this form, you agree to our privacy policy. We'll respond within 24 hours.
        </p>
      </form>
    </Modal>
  );
};

// Quick contact buttons for car detail page
export const InquiryButtons: React.FC<{
  car: Car;
}> = ({ car }) => {
  const [activeModal, setActiveModal] = useState<'general' | 'test_drive' | 'financing' | 'trade_in' | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <>
      <div className="space-y-3">
        <Button onClick={() => setActiveModal('general')} className="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Send Inquiry
        </Button>
        
        <Button onClick={() => setActiveModal('test_drive')} variant="outline" className="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Book Test Drive
        </Button>
        
        <Button onClick={() => setActiveModal('financing')} variant="secondary" className="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          Get Financing
        </Button>
        
        <button
          onClick={() => setActiveModal('trade_in')}
          className="w-full py-3 text-xs uppercase tracking-widest text-brand-muted hover:text-white transition-colors"
        >
          Have a Trade-In?
        </button>
      </div>

      {/* Success notification */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-6 py-4 shadow-lg flex items-center gap-3 animate-slide-up z-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Inquiry sent successfully!
        </div>
      )}

      {/* Modals */}
      {activeModal && (
        <InquiryForm
          car={car}
          type={activeModal}
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
};
