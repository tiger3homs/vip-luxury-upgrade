import React from 'react';
import { Heading, Label } from '../components/Typography';

export const AdminPurchaseRequests: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <Label className="mb-2 block">Lead Management</Label>
        <Heading as="h2">Autoankauf Requests</Heading>
      </div>

      <div className="bg-brand-gray/20 border border-white/5 p-12 text-center text-brand-muted">
        <p>Purchase requests and leads will appear here.</p>
      </div>
    </div>
  );
};