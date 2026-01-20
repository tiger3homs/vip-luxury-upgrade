import React, { useEffect, useState } from 'react';
import { Heading, Label } from '../components/Typography';
import { supabase, Car, Lead } from '../services/supabase';

const StatCard = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-brand-gray/30 border border-white/5 p-6 hover:border-brand-yellow/30 transition-colors">
    <Label className="text-xs mb-2 block text-brand-muted">{label}</Label>
    <div className="text-3xl font-display font-bold text-white">{value}</div>
  </div>
);

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    inventory: 0,
    leads: 0,
    reserved: 0
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [inventory, setInventory] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Parallel data fetching for performance
        const [carsRes, leadsRes] = await Promise.all([
          supabase.from('cars_for_sale').select('*').order('created_at', { ascending: false }),
          supabase.from('car_purchase_requests').select('*').order('created_at', { ascending: false }).limit(5)
        ]);

        const cars = carsRes.data || [];
        const leads = leadsRes.data || [];

        setInventory(cars.slice(0, 5));
        setRecentLeads(leads as unknown as Lead[]);
        setStats({
          inventory: cars.length,
          leads: leads.length, 
          reserved: cars.filter(c => c.status === 'reserved').length
        });
      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-yellow"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <Heading as="h2">Dashboard</Heading>
        <button className="bg-white text-black px-6 py-2 text-sm font-bold uppercase tracking-widest hover:bg-brand-yellow transition-colors">
          + Add New Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard label="Total Inventory" value={stats.inventory.toString()} />
        <StatCard label="Pending Leads" value={stats.leads.toString()} />
        <StatCard label="Reserved Cars" value={stats.reserved.toString()} />
        <StatCard label="Est. Revenue" value="CHF --" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-brand-gray/20 border border-white/5 p-6">
          <Label className="mb-6 block">Recent Inquiries</Label>
          <div className="space-y-4">
            {recentLeads.length === 0 ? (
              <div className="text-brand-muted text-sm">No new inquiries.</div>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div>
                    <div className="text-white font-bold text-sm">{lead.owner_firstname} {lead.owner_lastname}</div>
                    <div className="text-brand-muted text-xs">Selling: {lead.brand} {lead.model}</div>
                  </div>
                  <div className={`text-xs font-bold uppercase px-2 py-1 ${
                    lead.status === 'new' ? 'text-brand-yellow border border-brand-yellow/30' : 'text-brand-muted'
                  }`}>
                    {lead.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-brand-gray/20 border border-white/5 p-6">
          <Label className="mb-6 block">Recent Inventory</Label>
          <div className="space-y-4">
            {inventory.map((car) => (
              <div key={car.id} className="flex justify-between items-center">
                <span className="text-white text-sm">{car.brand} {car.model}</span>
                <span className={`text-xs font-bold uppercase px-2 py-1 ${
                  car.status === 'available' ? 'bg-green-900/50 text-green-400' :
                  car.status === 'reserved' ? 'bg-yellow-900/50 text-yellow-400' :
                  'bg-red-900/50 text-red-400'
                }`}>{car.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};