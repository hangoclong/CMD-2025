import { AppState, Platform } from 'react-native';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase URL and anon key
// You can find these in your Supabase project settings > API
const supabaseUrl = 'https://qnsgmehxolsbjsuwackh.supabase.co';
const supabaseAnonKey = 'sb_publishable_8VvX7W8uInljViUxNhfyGQ_1AfHiMSz';

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
