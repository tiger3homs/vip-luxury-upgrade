import { supabase, Profile } from './supabase';

/**
 * 3. AUTH HELPERS
 */

// Get the current active session from the browser
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

// Check if the current user has a specific role
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  return { profile: data as Profile | null, error };
};

// Sign out function
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const isAdmin = (profile: Profile | null) => {
  return profile && (profile.role === 'owner' || profile.role === 'worker');
};