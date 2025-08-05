import React, { useEffect } from 'react';
import { Tabs, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { logAuthEvent } from '../../lib/supabase';

export default function TabLayout() {
  const { session, loading } = useAuth();

  // useEffect hook to check the session and redirect
  useEffect(() => {
    if (!loading && !session) {
      // If not loading and no session, redirect to the login screen
      logAuthEvent('No session detected, redirecting to login');
      router.replace('/login');
    } else if (!loading && session) {
      logAuthEvent('Session detected', { user: session.user.email });
    }
  }, [session, loading]);

  // Don't render tabs until we know the authentication state
  if (loading) {
    return null;
  }
  
  // Only render tabs if authenticated
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4f46e5',
        headerStyle: { backgroundColor: '#4f46e5' },
        headerTintColor: '#fff',
      }}>
      <Tabs.Screen
        name="notes"
        options={{
          title: 'My Notes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="journal-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
