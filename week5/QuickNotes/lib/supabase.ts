import { AppState, Platform } from 'react-native';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase URL and anon key
// You can find these in your Supabase project settings > API
const supabaseUrl = 'https://qnsgmehxolsbjsuwackh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuc2dtZWh4b2xzYmpzdXdhY2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMTYyNDgsImV4cCI6MjA2OTg5MjI0OH0.tEutBNXaIuuP0F1QS4hIjHIO04eD9OKxaRWrg1M0Rvs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground
if (Platform.OS !== "web") {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}

// Debug logging function
export const logAuthEvent = (event: string, details?: any) => {
  console.log(`[AUTH] ${event}`, details || '');
};
