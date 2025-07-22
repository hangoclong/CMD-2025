// screens/GameScreen.tsx
// CHALLENGE 4: Pass Data Between Screens (Part 2)
// This file implements the second part of Challenge 4, which involves:
// 1. Receiving the playerName parameter from the navigation route
// 2. Displaying the player's name on the screen
// 3. Using the RouteProp type to properly type the route parameter

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// Import shared navigation types
import { RootStackParamList } from '../types/navigation';

// Updated props type to include route
type GameScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Game'>;
  route: RouteProp<RootStackParamList, 'Game'>; // Add route prop type
};

function GameScreen({ navigation, route }: GameScreenProps) {
  // Extract the playerName from route.params
  const { playerName } = route.params;
  
  // Added state to track the current number and guesses
  const [targetNumber] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guessCount, setGuessCount] = useState(0);
  
  // Function to simulate making a guess
  const makeGuess = () => {
    // Increment guess count
    setGuessCount(prevCount => prevCount + 1);
    
    // After 3 guesses, end the game
    if (guessCount >= 2) {
      // Navigate to GameOver and pass the results
      navigation.navigate('GameOver', {
        playerName,
        targetNumber,
        guessCount: guessCount + 1
      });
    } else {
      // Show feedback for the guess
      Alert.alert(
        'Guess Result',
        `Not quite right! Try again. (${guessCount + 1}/3 guesses)`
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Display personalized greeting with the player's name */}
      <Text style={styles.greeting}>Hello, {playerName}!</Text>
      
      <Text style={styles.title}>Guess a number between 1 and 100</Text>
      
      <View style={styles.guessContainer}>
        <Text style={styles.hint}>I'm thinking of number {targetNumber}...</Text>
        <Text style={styles.subtitle}>(This is just for demonstration)</Text>
        
        {/* Button to simulate making a guess */}
        <Button 
          title="Make a Guess" 
          onPress={makeGuess} 
          color="#6a1b9a"
        />
        
        <Text style={styles.guessCount}>Guesses: {guessCount}/3</Text>
      </View>
      
      {/* Button to end the game early */}
      <Button 
        title="Give Up" 
        onPress={() => navigation.navigate('GameOver', {
          playerName,
          targetNumber,
          guessCount,
          gaveUp: true
        })} 
        color="#d32f2f"
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#6a1b9a',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  guessContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  hint: {
    fontSize: 16,
    marginBottom: 5,
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  guessCount: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GameScreen;
