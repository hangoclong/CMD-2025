# QuickNotes App with Supabase Authentication

A simple note-taking application with Supabase authentication integration.

## Setup and Installation

1. Install dependencies:
```bash
pnpm add @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
```

2. Update Supabase credentials:
   - Open `lib/supabase.ts`
   - Replace the placeholder values with your actual Supabase URL and anon key from your Supabase project settings > API

3. Run the app:
```bash
pnpm expo start
```

## Implementation Details

### Dependencies Added
- `@supabase/supabase-js`: Supabase JavaScript client
- `@react-native-async-storage/async-storage`: Storage for persisting authentication state
- `react-native-url-polyfill`: URL polyfill for React Native

### Files Created/Modified

#### 1. lib/supabase.ts (New)

```typescript
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
```

#### 2. context/AuthContext.tsx (New)

```typescript
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase, logAuthEvent } from '../lib/supabase';

// Create a context with a default value
type AuthContextType = {
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ 
  session: null,
  loading: true 
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      logAuthEvent('Initial session check', { hasSession: !!session });
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      logAuthEvent('Auth state changed', { event, hasSession: !!session });
      setSession(session);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
```

#### 3. app/_layout.tsx (Modified)

```typescript
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider } from '../context/AuthContext';

import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

#### 4. app/(tabs)/_layout.tsx (Modified)

```typescript
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
```

#### 5. app/login.tsx (Modified)

```typescript
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { supabase, logAuthEvent } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  // Redirect to notes if already logged in
  useEffect(() => {
    if (session) {
      logAuthEvent('User already logged in, redirecting to notes');
      router.replace('/(tabs)/notes');
    }
  }, [session]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      logAuthEvent('Login attempt', { email });
      
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) {
        logAuthEvent('Login error', { error: error.message });
        Alert.alert('Login Error', error.message);
      } else {
        logAuthEvent('Login successful');
        // The redirect will happen automatically through our AuthContext
      }
    } catch (error) {
      logAuthEvent('Login exception', { error: String(error) });
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      logAuthEvent('Signup attempt', { email });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        logAuthEvent('Signup error', { error: error.message });
        Alert.alert('Signup Error', error.message);
      } else if (!data.session) {
        logAuthEvent('Signup successful - email confirmation required');
        Alert.alert('Success', 'Please check your email for verification!');
      } else {
        logAuthEvent('Signup successful - auto logged in');
        // The redirect will happen automatically through our AuthContext
      }
    } catch (error) {
      logAuthEvent('Signup exception', { error: String(error) });
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QuickNotes</Text>
      <Text style={styles.subtitle}>Your thoughts, anywhere, anytime</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4338ca" />
          <Text style={styles.loadingText}>Please wait...</Text>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={handleLogin} disabled={loading} />
          <Button title="Sign Up" onPress={handleSignUp} color="#6c757d" disabled={loading} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#4338ca',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#6c757d',
  },
  input: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 10,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#4338ca',
    fontSize: 16,
  },
});
```

#### 6. app/(tabs)/profile.tsx (Modified)

```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import { supabase, logAuthEvent } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  
  const handleLogout = async () => {
    try {
      setLoading(true);
      logAuthEvent('Logout attempt');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        logAuthEvent('Logout error', { error: error.message });
        Alert.alert('Error', error.message);
      } else {
        logAuthEvent('Logout successful');
        // The redirect will happen automatically through our AuthContext
      }
    } catch (error) {
      logAuthEvent('Logout exception', { error: String(error) });
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.email}>{session?.user?.email || 'No user logged in'}</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#dc3545" />
          <Text style={styles.loadingText}>Logging out...</Text>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <Button 
            title="Logout" 
            color="#dc3545" 
            onPress={handleLogout} 
            disabled={loading} 
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '80%',
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '80%',
  },
  loadingText: {
    marginTop: 10,
    color: '#dc3545',
    fontSize: 16,
  },
});
```

## Authentication Flow

1. When the app starts, it checks for an existing session
2. If no session exists, the user is redirected to the login screen
3. After successful login/signup, the user is redirected to the notes screen
4. The user can log out from the profile screen
5. After logout, the user is automatically redirected back to the login screen

## Testing

Authentication events are logged to the console for debugging purposes. You can view these logs in the terminal or using the React Native Debugger.
