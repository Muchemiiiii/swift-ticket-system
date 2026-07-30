import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading]         = useState(true);

  // Restore session and setup auth listener on mount
  useEffect(() => {
    // Check for active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Attempt to fetch matching profile from database
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              setCurrentUser(data);
            } else {
              // Fallback if profiles table is not yet set up
              setCurrentUser({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.name || session.user.email.split('@')[0],
                role: session.user.user_metadata?.role || 'user',
                avatar: session.user.user_metadata?.avatar || 'U',
              });
            }
            setLoading(false);
          });
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    // Listen to real-time auth state updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!error && data) {
          setCurrentUser(data);
        } else {
          setCurrentUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email.split('@')[0],
            role: session.user.user_metadata?.role || 'user',
            avatar: session.user.user_metadata?.avatar || 'U',
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error('Authentication failed.');

    // Fetch corresponding profile
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const user = (profile && !profileErr) ? profile : {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || data.user.email.split('@')[0],
      role: data.user.user_metadata?.role || 'user',
      avatar: data.user.user_metadata?.avatar || 'U',
    };

    setCurrentUser(user);
    return user;
  }, []);

  const signup = useCallback(async ({ name, email, password, role = 'user' }) => {
    const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
          avatar,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('Registration failed.');

    // Check if user profile was automatically created by SQL trigger
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const user = profile || {
      id: data.user.id,
      email: data.user.email,
      name,
      role,
      avatar,
    };

    setCurrentUser(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
