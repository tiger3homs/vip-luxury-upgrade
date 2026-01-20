import React from 'react';
import { Heading, Label } from '../components/Typography';

export const AdminUsers: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
       <div className="flex justify-between items-center mb-10">
        <div>
          <Label className="mb-2 block">System Administration</Label>
          <Heading as="h2">Users & Roles</Heading>
        </div>
        <button className="bg-white text-black px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-brand-yellow transition-colors">
          + Invite User
        </button>
      </div>

      <div className="bg-brand-gray/20 border border-white/5 p-12 text-center text-brand-muted">
        <p>User management interface (Restricted to Owners).</p>
      </div>
    </div>
  );
};