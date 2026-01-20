import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { signOut, getUserProfile, getCurrentSession } from '../services/auth';
import { GridBackground } from './GridBackground';
import { Profile } from '../services/supabase';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<'owner' | 'worker' | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const { session } = await getCurrentSession();
      if (session?.user) {
        const { profile } = await getUserProfile(session.user.id);
        if (profile) {
          setUserRole(profile.role);
        }
      }
    };
    fetchRole();
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Cars for Sale', path: '/admin/cars' },
    { label: 'Autoankauf Requests', path: '/admin/purchase-requests' },
    { label: 'QR Codes', path: '/admin/qr-codes' },
    { label: 'Users', path: '/admin/users', requiredRole: 'owner' },
  ];

  // Filter items based on role
  const visibleNavItems = navItems.filter(item => {
    if (item.requiredRole === 'owner' && userRole !== 'owner') {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-brand-black text-white relative overflow-hidden flex flex-col h-screen font-sans">
       <GridBackground opacity={0.05} />
       
       {/* Header */}
      <header className="border-b border-white/10 bg-brand-black/95 backdrop-blur z-30 flex-shrink-0">
        <div className="px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-white border border-white/20 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <Link to="/admin" className="font-display font-bold text-xl text-white">VIP<span className="text-brand-yellow">.</span>ADMIN</Link>
          </div>
          
          <div className="flex items-center space-x-4">
             <span className="text-sm text-brand-muted hidden sm:inline uppercase tracking-widest text-xs">{userRole || 'Loading...'}</span>
             <button 
               onClick={handleLogout}
               className="text-xs uppercase font-bold text-brand-yellow border border-brand-yellow/20 px-3 py-1 hover:bg-brand-yellow hover:text-brand-black transition-colors"
             >
               Logout
             </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative z-20">
        {/* Sidebar */}
        <aside className={`
          fixed md:relative z-20 w-64 h-full bg-brand-black border-r border-white/10 transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <nav className="p-6 space-y-2">
            {visibleNavItems.map((item) => (
              <Link 
                key={item.label} 
                to={item.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors border-l-2 ${
                  location.pathname === item.path 
                    ? 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow' 
                    : 'border-transparent text-brand-muted hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-10 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-12 bg-brand-black/50 w-full">
           <Outlet />
        </main>
      </div>
    </div>
  );
};