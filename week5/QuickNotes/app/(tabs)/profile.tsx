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
