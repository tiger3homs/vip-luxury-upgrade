import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Heading } from '../components/Typography';
import { supabase } from '../services/supabase';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Check if user has role in profiles (optional, but good for UI feedback if role is required)
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
      <div className="w-full max-w-md bg-brand-black border border-white/10 p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-yellow" />
        
        <div className="text-center mb-10">
          <Heading as="h3" className="mb-2">Admin Portal</Heading>
          <p className="text-brand-muted text-sm uppercase tracking-widest">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-900/50 p-3 text-red-200 text-xs text-center">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold tracking-widest text-brand-muted">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-gray/50 border border-white/10 p-4 text-white focus:border-brand-yellow focus:outline-none transition-colors"
              placeholder="admin@vipluxury.cars"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold tracking-widest text-brand-muted">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-gray/50 border border-white/10 p-4 text-white focus:border-brand-yellow focus:outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <a href="/" className="text-xs text-brand-muted hover:text-white transition-colors">← Back to Site</a>
        </div>
      </div>
    </div>
  );
};