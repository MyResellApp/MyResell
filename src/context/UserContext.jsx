import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabaseClient';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSubscription, setActiveSubscription] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
        setLoading(false);
        return;
      }
      
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchUserSubscription(session.user.id);
      }
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserSubscription(session.user.id);
      } else {
        setActiveSubscription(null);
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const fetchUserSubscription = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*, plans(*)')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116: 'No rows found' - not an actual error in this case
        console.error('Error fetching active subscription:', error);
        setActiveSubscription(null);
        return;
      }
      setActiveSubscription(data);
    } catch (err) {
      console.error('Unexpected error fetching subscription:', err);
      setActiveSubscription(null);
    }
  };
  
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(data.user);
    await fetchUserSubscription(data.user.id);
    return data.user;
  };
  
  const register = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
    if (error) throw error;
    setUser(data.user);
    // No active subscription on new registration
    return data.user;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setActiveSubscription(null);
  };

  const updateUserProfile = async (updates) => {
    if (!user) throw new Error("No user logged in.");
    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
    setUser(data.user); // Supabase auth.onAuthStateChange might handle this already
    return data.user;
  };


  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
    activeSubscription,
    fetchUserSubscription, // expose this to refresh subscription status if needed
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};