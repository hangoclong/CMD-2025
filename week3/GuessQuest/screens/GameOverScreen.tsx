// screens/GameOverScreen.tsx
// CHALLENGE 4: Pass Data Between Screens (Part 3)
// This file implements the final part of Challenge 4, which involves:
// 1. Receiving game results from the Game screen
// 2. Displaying personalized results with the player's name
// 3. Using the RouteProp type to properly type the route parameters

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// Import shared navigation types
import { RootStackParamList } from '../types/navigation';

type GameOverScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GameOver'>;
  route: RouteProp<RootStackParamList, 'GameOver'>; // Add route prop type
};

function GameOverScreen({ navigation, route }: GameOverScreenProps) { 
  // Extract parameters from route
  const { playerName, targetNumber, guessCount, gaveUp = false } = route.params;
  
  function handlePlayAgain() {
    // Navigate back to the screen of StartGame 
    navigation.navigate('StartGame'); 
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over!</Text>
      
      {/* Display personalized results */}
      <View style={styles.resultCard}>
        <Text style={styles.playerName}>{playerName}'s Results</Text>
        
        {gaveUp ? (
          <Text style={styles.resultText}>You gave up after {guessCount} guesses.</Text>
        ) : (
          <Text style={styles.resultText}>You used {guessCount} out of 3 guesses.</Text>
        )}
        
        <Text style={styles.numberText}>The number was: {targetNumber}</Text>
      </View>
      
      <Button 
        title="Play Again" 
        onPress={handlePlayAgain} 
        color="#6a1b9a"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#d32f2f', // Red color for Game Over
  },
  resultCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  playerName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#6a1b9a',
  },
  resultText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  numberText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#4caf50',
  },
});

export default GameOverScreen;
