'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AuthState, User } from '@/types/user';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  };

  // Initialize the auth state with the current session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));

        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // Fetch the user's profile
          const profile = await fetchUserProfile(session.user.id);
          const userWithProfile = { ...session.user, profile } as User;

          setState({
            user: userWithProfile,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        setState({
          user: null,
          isLoading: false,
          error: error as Error,
        });
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          const userWithProfile = { ...session.user, profile } as User;

          setState({
            user: userWithProfile,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            isLoading: false,
            error: null,
          });
        }

        // Force a router refresh to update server components
        router.refresh();
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
      return { error: error as Error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Create the user
      const { data: { user }, error } = await supabase.auth.signUp({ email, password });

      if (error) throw error;
      if (!user) throw new Error('User creation failed');

      // Create the user profile
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: user.id,
          full_name: fullName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (profileError) throw profileError;

      return { error: null };
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
      return { error: error as Error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await supabase.auth.signOut();
      setState({
        user: null,
        isLoading: false,
        error: null,
      });
      router.push('/auth/login');
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
    }
  };

  // Refresh the session
  const refreshSession = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        const userWithProfile = { ...session.user, profile } as User;

        setState({
          user: userWithProfile,
          isLoading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        error: error as Error,
      });
    }
  };

  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}