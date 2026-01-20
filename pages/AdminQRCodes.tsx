import React, { useState, useEffect } from 'react';
import { Heading, Label } from '../components/Typography';
import { Button } from '../components/Button';
import { supabase, QRCode, Car } from '../services/supabase';

export const AdminQRCodes: React.FC = () => {
  const [codes, setCodes] = useState<QRCode[]>([]);
  const [inventory, setInventory] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  
  // Form State
  const [newLabel, setNewLabel] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [selectedCar, setSelectedCar] = useState('');
  const [genType, setGenType] = useState<'custom' | 'car'>('custom');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [qrRes, carRes] = await Promise.all([
      supabase.from('qr_codes').select('*').order('created_at', { ascending: false }),
      supabase.from('cars_for_sale').select('id, brand, model, slug, year').eq('status', 'available')
    ]);

    if (qrRes.data) setCodes(qrRes.data);
    if (carRes.data) setInventory(carRes.data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalTarget = newTarget;
    let finalLabel = newLabel;

    if (genType === 'car') {
      const car = inventory.find(c => c.id === selectedCar);
      if (!car) return;
      finalTarget = `/cars/${car.slug}`;
      finalLabel = `${car.year} ${car.brand} ${car.model}`;
    }

    if (!finalTarget) return;

    const { error } = await supabase.from('qr_codes').insert([{
      label: finalLabel || 'Untitled QR',
      target_url: finalTarget,
      scan_count: 0
    }]);

    if (error) {
      alert('Error creating QR code');
    } else {
      setNewLabel('');
      setNewTarget('');
      setSelectedCar('');
      setActiveTab('list');
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this QR code?')) return;
    const { error } = await supabase.from('qr_codes').delete().eq('id', id);
    if (!error) fetchData();
  };

  // Helper to get current domain for display
  const getQRLink = (id: string) => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#/qr/${id}`;
  };

  const getQRImage = (id: string) => {
    const url = encodeURIComponent(getQRLink(id));
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${url}&bgcolor=000000&color=E8FF00&margin=10`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
           <Label className="mb-2 block">Marketing Tools</Label>
           <Heading as="h2">QR Codes</Heading>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'list' ? 'bg-white text-black' : 'text-brand-muted hover:text-white'}`}
          >
            Manage
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'create' ? 'bg-brand-yellow text-black' : 'text-brand-muted hover:text-white'}`}
          >
            + Create New
          </button>
        </div>
      </div>

      {activeTab === 'create' && (
        <div className="bg-brand-gray/20 border border-white/5 p-8 mb-8 animate-fade-in-up">
          <Heading as="h3" className="mb-6 text-2xl">Generate New Code</Heading>
          <div className="flex gap-6 mb-6">
             <button 
               onClick={() => setGenType('custom')} 
               className={`flex-1 py-3 border border-white/10 text-sm font-bold uppercase tracking-widest ${genType === 'custom' ? 'bg-brand-yellow text-black border-brand-yellow' : 'bg-transparent text-white'}`}
             >
               Custom URL
             </button>
             <button 
               onClick={() => setGenType('car')} 
               className={`flex-1 py-3 border border-white/10 text-sm font-bold uppercase tracking-widest ${genType === 'car' ? 'bg-brand-yellow text-black border-brand-yellow' : 'bg-transparent text-white'}`}
             >
               Link to Inventory
             </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-6">
            {genType === 'custom' ? (
              <>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-brand-muted">Label (Internal Use)</label>
                  <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="e.g. Instagram Bio Link" className="w-full bg-brand-black border border-white/20 p-3 text-white focus:border-brand-yellow outline-none" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-brand-muted">Target Path (Internal) or URL (External)</label>
                  <input value={newTarget} onChange={e => setNewTarget(e.target.value)} placeholder="/shop or https://google.com" className="w-full bg-brand-black border border-white/20 p-3 text-white focus:border-brand-yellow outline-none" required />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-brand-muted">Select Vehicle</label>
                <select value={selectedCar} onChange={e => setSelectedCar(e.target.value)} className="w-full bg-brand-black border border-white/20 p-3 text-white focus:border-brand-yellow outline-none" required>
                  <option value="">-- Choose Car --</option>
                  {inventory.map(car => (
                    <option key={car.id} value={car.id}>{car.year} {car.brand} {car.model}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex justify-end">
               <Button type="submit">Generate Code</Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-brand-muted">Loading codes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {codes.map(code => (
            <div key={code.id} className="bg-brand-gray/20 border border-white/5 p-6 flex flex-col group hover:border-brand-yellow/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                 <div>
                   <h4 className="text-white font-bold mb-1">{code.label}</h4>
                   <p className="text-xs text-brand-muted truncate max-w-[200px]">{code.target_url}</p>
                 </div>
                 <span className="bg-white/10 text-white px-2 py-1 text-xs font-mono font-bold rounded">
                   {code.scan_count} Scans
                 </span>
              </div>
              
              <div className="flex-grow flex items-center justify-center py-4 bg-white/5 mb-4 rounded border border-white/5">
                <img 
                  src={getQRImage(code.id)} 
                  alt="QR Code" 
                  className="w-32 h-32 mix-blend-screen" // Blending mode for cool effect on dark bg
                />
              </div>

              <div className="flex gap-2 mt-auto">
                <a 
                  href={getQRImage(code.id)} 
                  download={`qr-${code.label}.png`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center bg-white/10 text-white text-xs font-bold uppercase py-2 hover:bg-white hover:text-black transition-colors"
                >
                  Download
                </a>
                <button 
                  onClick={() => handleDelete(code.id)}
                  className="px-3 bg-red-900/20 text-red-500 border border-red-900/50 hover:bg-red-900 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          
          {codes.length === 0 && activeTab === 'list' && (
            <div className="col-span-3 text-center py-12 text-brand-muted border border-dashed border-white/10">
              No QR Codes generated yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};