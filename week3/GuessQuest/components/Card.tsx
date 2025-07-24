import React from 'react';
import { View, StyleSheet } from 'react-native';

// Define the props type for our Card component
type CardProps = {
  children: React.ReactNode; // This allows any valid React content as children
};

// Create the Card component with typed props
function Card({ children }: CardProps) {
  return <View style={styles.card}>{children}</View>;
}

export default Card;

// Define styles for our Card component
const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginTop: 36,
    marginHorizontal: 24,
    backgroundColor: '#3b021f', // A theme color
    borderRadius: 8,
    elevation: 4, // Android shadow
    shadowColor: 'black', // iOS shadow props
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.25,
  },
});
