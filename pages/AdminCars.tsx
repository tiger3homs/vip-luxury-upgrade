import React, { useState, useEffect } from 'react';
import { Heading, Label } from '../components/Typography';
import { supabase, Car } from '../services/supabase';
import { AdminCarForm } from '../components/AdminCarForm';

export const AdminCars: React.FC = () => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [cars, setCars] = useState<Car[]>([]);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cars_for_sale')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching cars:', error);
    else setCars(data || []);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setView('form');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;

    const { error } = await supabase.from('cars_for_sale').delete().eq('id', id);
    if (error) {
      alert('Error deleting car');
    } else {
      fetchCars();
    }
  };

  const handleCreate = () => {
    setEditingCar(null);
    setView('form');
  };

  const handleFormSuccess = () => {
    setView('list');
    fetchCars();
  };

  if (view === 'form') {
    return (
      <div className="max-w-5xl mx-auto">
        <Heading as="h2" className="mb-8">{editingCar ? 'Edit Vehicle' : 'Add New Vehicle'}</Heading>
        <AdminCarForm 
          initialData={editingCar} 
          onSuccess={handleFormSuccess} 
          onCancel={() => setView('list')} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <Label className="mb-2 block">Inventory Management</Label>
          <Heading as="h2">Cars for Sale</Heading>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-brand-yellow text-brand-black px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors"
        >
          + Add Vehicle
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-yellow"></div>
        </div>
      ) : (
        <div className="bg-brand-gray/20 border border-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-brand-black border-b border-white/10">
              <tr>
                <th className="p-4 text-xs font-bold uppercase text-brand-muted tracking-widest">Vehicle</th>
                <th className="p-4 text-xs font-bold uppercase text-brand-muted tracking-widest">Price</th>
                <th className="p-4 text-xs font-bold uppercase text-brand-muted tracking-widest">Status</th>
                <th className="p-4 text-xs font-bold uppercase text-brand-muted tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {cars.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-brand-muted">No vehicles found. Add your first car.</td>
                </tr>
              ) : (
                cars.map((car) => (
                  <tr key={car.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-gray border border-white/10 flex-shrink-0">
                           {car.images && car.images[0] ? (
                             <img src={car.images[0].startsWith('http') ? car.images[0] : supabase.storage.from('car-images').getPublicUrl(car.images[0]).data.publicUrl} alt="" className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-xs text-brand-muted">IMG</div>
                           )}
                        </div>
                        <div>
                          <div className="font-bold text-white">{car.brand} {car.model}</div>
                          <div className="text-xs text-brand-muted">{car.year} • {car.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-mono text-white/80">
                      {car.currency} {car.price.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold uppercase px-2 py-1 ${
                        car.status === 'available' ? 'bg-green-900/30 text-green-400 border border-green-900' :
                        car.status === 'reserved' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900' :
                        'bg-red-900/30 text-red-400 border border-red-900'
                      }`}>
                        {car.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(car)}
                          className="text-xs font-bold uppercase text-white hover:text-brand-yellow px-2 py-1"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(car.id)}
                          className="text-xs font-bold uppercase text-brand-muted hover:text-red-500 px-2 py-1"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};