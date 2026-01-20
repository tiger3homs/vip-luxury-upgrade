import React, { useState, useEffect } from 'react';
import { supabase, Car } from '../services/supabase';
import { Button } from './Button';
import { Label } from './Typography';

interface AdminCarFormProps {
  initialData?: Car | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminCarForm: React.FC<AdminCarFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<Car>>({
    title: '',
    slug: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    currency: 'CHF',
    mileage: 0,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    doors: 2,
    color: '',
    engine_cc: 0,
    first_registration: '',
    last_mfk: '',
    description: '',
    images: [],
    status: 'available',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Auto-generate slug from Brand + Model + Year if not manually set
  useEffect(() => {
    if (!initialData && formData.brand && formData.model) {
      const suggestedSlug = `${formData.brand}-${formData.model}-${formData.year}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      // Only update if user hasn't typed a custom slug yet (or if it matches the pattern)
      setFormData(prev => ({ ...prev, slug: suggestedSlug }));
    }
  }, [formData.brand, formData.model, formData.year, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const files = Array.from(e.target.files);
    const newImagePaths: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
      } else {
        newImagePaths.push(filePath);
      }
    }

    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...newImagePaths]
    }));
    setUploading(false);
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData?.id) {
        // Update
        const { error } = await supabase
          .from('cars_for_sale')
          .update(formData)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        // Create
        // Ensure title is set
        const finalData = {
          ...formData,
          title: formData.title || `${formData.year} ${formData.brand} ${formData.model}`
        };
        const { error } = await supabase.from('cars_for_sale').insert([finalData]);
        if (error) throw error;
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving car:', error);
      alert('Failed to save car. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-brand-gray/20 border border-white/10 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* Basic Info */}
        <div className="col-span-1 md:col-span-2">
           <Label className="mb-4 block text-brand-yellow border-b border-white/10 pb-2">Basic Information</Label>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-brand-muted">Brand</label>
          <input name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-brand-black border border-white/20 p-3 text-white focus:border-brand-yellow outline-none" required />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-brand-muted">Model</label>
          <input name="model" value={formData.model} onChange={handleChange} className="w-full bg-brand-black border border-white/20 p-3 text-white focus:border-brand-yellow outline-none" required />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-brand-muted">Year</label>
          <input type="number" name="year" value={formData.year} onChange={handleChange} className="w-full bg-brand-black border border-white/20 p-3 text-white focus:border-brand-yellow outline-none" required />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-brand-muted">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-brand-black border border-white/20 p-3 text-white focus:border-brand-yellow outline-none">
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        {/* Pricing */}
        <div className="col-span-1 md:col-span-2 mt-4">
           <Label className="mb-4 block text-brand-yellow border-b border-white/10 pb-2">Pricing</Label>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-brand-muted">Price</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-brand-black border border-white/20 p-3 text-white focus:border-brand-yellow outline-none" required />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-brand-muted">Currency</label>
          <select name="currency" value={formData.currency} onChange={handleChange} className="w-full bg-brand-black border border-white/20 p-3 text-white focus:border-brand-yellow outline-none">
            <option value="CHF">CHF</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </div>

        {/* Specs */}
        <div className="col-span-1 md:col-span-2 mt-4">
           <Label className="mb-4 block text-brand-yellow border-b border-white/10 pb-2">Specifications</Label>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-brand-muted">Mileage (km)</label>
          <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} className="w-full bg-brand-black border border-white/20 p-3 text-white focus:border-brand-yellow outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-brand-muted">Engine (cc)</label>
          <input type="number" name="engine_cc" value={formData.engine_cc} onChange={handleChange} className="w-full bg-brand-black border border-white/20 p-3 text-white focus:border-brand-yellow outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-brand-muted">Fuel Type</label>
          <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} className="w-full bg-brand-black border border-white/20 p-3 text-white focus:border-brand-yellow outline-none">
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-brand-muted">Transmission</label>
          <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full bg-brand-black border border-white/20 p-3 text-white focus:border-brand-yellow outline-none">
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
            <option value="PDK">PDK</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-brand-muted">Exterior Color</label>
          <input name="color" value={formData.color} onChange={handleChange} className="w-full bg-brand-black border border-white/20 p-3 text-white focus:border-brand-yellow outline-none" />
        </div>

        {/* Description & SEO */}
        <div className="col-span-1 md:col-span-2 mt-4">
           <Label className="mb-4 block text-brand-yellow border-b border-white/10 pb-2">Details & SEO</Label>
        </div>
        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="text-xs uppercase font-bold text-brand-muted">Title (Displayed on Card)</label>
          <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-brand-black border border-white/20 p-3 text-white focus:border-brand-yellow outline-none" placeholder="e.g. 2023 Aston Martin DBX707" />
        </div>
        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="text-xs uppercase font-bold text-brand-muted">URL Slug (Unique ID)</label>
          <input name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-brand-black border border-white/20 p-3 text-white focus:border-brand-yellow outline-none font-mono text-sm" />
        </div>
        <div className="col-span-1 md:col-span-2 space-y-2">
          <label className="text-xs uppercase font-bold text-brand-muted">Description</label>
          <textarea name="description" rows={5} value={formData.description} onChange={handleChange} className="w-full bg-brand-black border border-white/20 p-3 text-white focus:border-brand-yellow outline-none" />
        </div>

        {/* Images */}
        <div className="col-span-1 md:col-span-2 mt-4">
           <Label className="mb-4 block text-brand-yellow border-b border-white/10 pb-2">Gallery</Label>
        </div>
        <div className="col-span-1 md:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {formData.images?.map((path, idx) => (
              <div key={idx} className="relative group aspect-square bg-brand-black border border-white/10">
                <img 
                  src={path.startsWith('http') ? path : supabase.storage.from('car-images').getPublicUrl(path).data.publicUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            ))}
            <label className="border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-brand-yellow hover:text-brand-yellow transition-colors aspect-square">
              <span className="text-4xl mb-2">+</span>
              <span className="text-xs font-bold uppercase">Add Images</span>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
          {uploading && <p className="text-brand-yellow text-xs animate-pulse">Uploading images...</p>}
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t border-white/10 pt-6">
        <Button variant="ghost" onClick={onCancel} disabled={loading || uploading}>Cancel</Button>
        <Button type="submit" disabled={loading || uploading}>
          {loading ? 'Saving...' : (initialData ? 'Update Vehicle' : 'Create Vehicle')}
        </Button>
      </div>
    </form>
  );
};