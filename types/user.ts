import { User as SupabaseUser } from '@supabase/supabase-js';
import { Database } from './supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export interface User extends SupabaseUser {
  profile?: Profile;
}

export type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
};