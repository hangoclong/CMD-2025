// screens/GameScreen.tsx
// CHALLENGE 4: Pass Data Between Screens (Part 2)
// This file implements the second part of Challenge 4, which involves:
// 1. Receiving the playerName parameter from the navigation route
// 2. Displaying the player's name on the screen
// 3. Using the RouteProp type to properly type the route parameter

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, useWindowDimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// Import shared navigation types
import { RootStackParamList } from '../types/navigation';
import NumberContainer from '../components/NumberContainer';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import Title from '../components/Title';

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
  
  // Use the hook to get dynamic dimensions
  const { width, height } = useWindowDimensions();
  
  // Function to simulate making a guess
  const makeGuess = (direction: 'lower' | 'greater') => {
    // Increment guess count
    setGuessCount(prev => prev + 1);
    
    // After 3 guesses, end the game
    if (guessCount >= 2) {
      navigation.navigate('GameOver', {
        playerName,
        targetNumber,
        guessCount: guessCount + 1
      });
    } else {
      // Show feedback for the guess
      Alert.alert('Guessed!', `You chose ${direction}. (${guessCount + 1}/3 guesses)`);
    }
  };

  // Determine orientation
  const isLandscape = width > height;

  // Define content conditionally
  let content = (
    <>
      <NumberContainer>{targetNumber}</NumberContainer>
      <Card>
        <Text>Higher or Lower?</Text>
        <View>
          <PrimaryButton onPress={() => makeGuess('greater')}>+</PrimaryButton>
          <PrimaryButton onPress={() => makeGuess('lower')}>-</PrimaryButton>
        </View>
      </Card>
    </>
  );

  if (isLandscape) {
    content = (
      <View style={styles.contentLandscape}>
        <View>
          <PrimaryButton onPress={() => makeGuess('greater')}>+</PrimaryButton>
          <PrimaryButton onPress={() => makeGuess('lower')}>-</PrimaryButton>
        </View>
        <NumberContainer>{targetNumber}</NumberContainer>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Title >Opponent's Guess</Title>
        <Text style={styles.greeting}>Hello, {playerName}!</Text>
        {content}
        <Text style={styles.guessCount}>Guesses: {guessCount}/3</Text>
        
        {/* Button to end the game early */}
        <View style={styles.giveUpContainer}>
          <PrimaryButton 
            onPress={() => navigation.navigate('GameOver', {
              playerName,
              targetNumber,
              guessCount,
              gaveUp: true
            })}
          >
            Give Up
          </PrimaryButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: 'black',
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    color: 'black',
  },
  contentLandscape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  greeting: {
    fontSize: 18,
    marginBottom: 12,
    color: 'black',
  },
  guessCount: {
    fontSize: 16,
    marginTop: 20,
    color: 'white',
  },
  giveUpContainer: {
    marginTop: 20,
  },
  hint: {
    fontSize: 16,
    marginBottom: 5,
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
});

export default GameScreen;
