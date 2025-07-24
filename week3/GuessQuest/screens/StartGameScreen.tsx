// screens/StartGameScreen.tsx
// CHALLENGE 4: Pass Data Between Screens
// This file implements the first part of Challenge 4, which involves:
// 1. Adding a TextInput to collect the player's name
// 2. Storing the name in state with useState
// 3. Passing the name as a parameter when navigating to the Game screen

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, SafeAreaView } from 'react-native';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Import shared navigation types
import { RootStackParamList } from '../types/navigation';

type StartGameScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'StartGame'>;
};

function StartGameScreen({ navigation }: StartGameScreenProps) { 
  // Added state to store the player's name
  const [playerName, setPlayerName] = useState('');
  
  function handleStartGame() {
    // Pass the player name as a parameter when navigating
    // If no name is entered, default to 'Player'
    navigation.navigate('Game', { 
      playerName: playerName.trim() || 'Player' 
    }); 
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
      <Image 
        source={require('../assets/quest-icon.png')} 
        style={styles.logo}
        onError={() => console.log('Image could not be loaded')}
      />
      <Text style={styles.title}>Welcome to GuessQuest!</Text>
      <Card>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={playerName}
          onChangeText={setPlayerName}
          autoCorrect={false}
          maxLength={20}
        />
        <PrimaryButton onPress={handleStartGame}>Start Game</PrimaryButton>
      </Card>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 50, // Add padding to avoid status bar overlap
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#6a1b9a', // Matching the header color
  },
  // Added input style for the TextInput
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    width: '80%',
    marginBottom: 24,
    fontSize: 16,
    backgroundColor: 'white',
  },
});

export default StartGameScreen;
