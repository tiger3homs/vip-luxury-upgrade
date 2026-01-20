import React, { useEffect, useState } from 'react';
    import { Navigate, Outlet, useLocation } from 'react-router-dom';
    import { supabase } from '../services/supabase';
    import { getUserProfile, isAdmin } from '../services/auth';
    
    export const AdminGuard: React.FC = () => {
      const [isLoading, setIsLoading] = useState(true);
      const [isAuthorized, setIsAuthorized] = useState(false);
      const location = useLocation();
    
      useEffect(() => {
        const checkAuth = async () => {
          try {
            // 1. Check Session
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
              setIsAuthorized(false);
              setIsLoading(false);
              return;
            }
    
            // 2. Check Role (Security: RLS policies on backend also enforce this, but UI needs to know)
            const { profile } = await getUserProfile(session.user.id);
            
            if (isAdmin(profile)) {
              setIsAuthorized(true);
            } else {
              setIsAuthorized(false);
            }
          } catch (error) {
            console.error('Auth check failed', error);
            setIsAuthorized(false);
          } finally {
            setIsLoading(false);
          }
        };
    
        checkAuth();
      }, []);
    
      if (isLoading) {
        return (
          <div className="min-h-screen bg-brand-black flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-yellow mb-4"></div>
              <span className="text-brand-muted text-xs uppercase tracking-widest">Verifying Access...</span>
            </div>
          </div>
        );
      }
    
      return isAuthorized ? <Outlet /> : <Navigate to="/admin/login" state={{ from: location }} replace />;
    };