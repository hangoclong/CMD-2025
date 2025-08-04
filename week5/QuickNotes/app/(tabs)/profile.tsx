import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.email}>user.email@example.com</Text>
      {/* The Logout button will be wired up later */}
      <View style={styles.buttonContainer}>
        <Button title="Logout" color="#dc3545" onPress={() => {}} />
      </View>
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
});
