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