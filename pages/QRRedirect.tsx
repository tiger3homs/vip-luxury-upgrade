import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Heading } from '../components/Typography';

export const QRRedirect: React.FC = () => {
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleScan = async () => {
      if (!id) return;

      try {
        // 1. Fetch the QR code data
        const { data, error: fetchError } = await supabase
          .from('qr_codes')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError || !data) {
          setError('Invalid QR Code');
          return;
        }

        // 2. Increment scan count (Fire and forget for speed, or await if critical)
        // Note: In a production app, use a Database RPC function `increment_scan(id)` to be atomic.
        // For this frontend implementation, we do a read-write.
        await supabase
          .from('qr_codes')
          .update({ scan_count: data.scan_count + 1 })
          .eq('id', id);

        // 3. Redirect
        // Handle both relative internal paths and absolute external URLs
        if (data.target_url.startsWith('http')) {
          window.location.href = data.target_url;
        } else {
          // Internal routing via HashRouter requires clean handling
          // If we are using HashRouter in App.tsx, we navigate internally
          // However, for QR codes, it's safer to do a full window location replace 
          // to ensure state is clean, but let's try internal router navigation if possible.
          // Since this is a redirect page, window.location is robust.
          
          // Check if we are in HashRouter mode (URL contains #)
          const isHashRouter = window.location.hash.length > 0;
          const baseUrl = window.location.origin + window.location.pathname;
          
          if (isHashRouter) {
             window.location.replace(`${baseUrl}#${data.target_url}`);
          } else {
             window.location.replace(data.target_url);
          }
        }

      } catch (err) {
        console.error("QR Scan Error", err);
        setError('System Error');
      }
    };

    handleScan();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center text-center p-4">
        <div>
          <Heading as="h2" className="text-red-500 mb-4">Error</Heading>
          <p className="text-white">{error}</p>
          <a href="/" className="mt-8 inline-block text-brand-yellow underline">Return Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-yellow mx-auto mb-6"></div>
        <p className="text-brand-muted uppercase tracking-widest text-sm">Redirecting...</p>
      </div>
    </div>
  );
};