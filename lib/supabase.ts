// Supabase Client Setup for AmbiSight
// Supports both live Supabase connection and demo mode (localStorage fallback)

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is properly configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create Supabase client (or null if not configured)
export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Demo mode indicator
export const isDemoMode = !isSupabaseConfigured;

// Helper to get user session
export async function getCurrentSession() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// Helper to get current user
export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Sign up with email
export async function signUpWithEmail(email: string, password: string, metadata?: Record<string, unknown>) {
  if (!supabase) throw new Error('Supabase not configured - running in demo mode');

  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
}

// Sign in with email
export async function signInWithEmail(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured - running in demo mode');

  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

// Sign out
export async function signOut() {
  if (!supabase) throw new Error('Supabase not configured - running in demo mode');

  return supabase.auth.signOut();
}

// Magic link sign in
export async function signInWithMagicLink(email: string) {
  if (!supabase) throw new Error('Supabase not configured - running in demo mode');

  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}
