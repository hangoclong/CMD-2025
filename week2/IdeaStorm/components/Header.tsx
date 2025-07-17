// components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>IdeaStorm</Text>
      <Text style={styles.headerSubtitle}>Capture your creative ideas</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { 
    padding: 20, 
    backgroundColor: '#2196F3', 
    alignItems: 'center' 
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  headerSubtitle: { 
    fontSize: 16, 
    color: '#fff', 
    opacity: 0.8 
  },
});

export default Header;