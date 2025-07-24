# Week 3, Session 8: Data Flow & Componentization

**Objective:** To master data flow between screens using React Navigation's route parameters and learn how to break down complex UIs into reusable components for the "GuessQuest" project.

> **Note:** This session continues directly from Session 7. You should have completed the React Navigation setup from the previous session and have a working GuessQuest app with navigation between screens.

---

## Session Outline

1. **Data Flow Between Screens:** Learn how to pass data from one screen to another using navigation parameters.
2. **Type-Safe Routes:** Use TypeScript to make navigation data predictable and safe from bugs.
3. **Componentization:** Break down complex UIs into small, reusable pieces for cleaner, more professional code.
4. **Student Task:** Practice passing data between screens in the GuessQuest app.

![React Logo](https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg)

---

## Review: Where We Left Off

In our last session, we built the complete navigation structure for "GuessQuest".

* We implemented a `Stack.Navigator` with three screens: `StartGame`, `Game`, and `GameOver`.
* We successfully used the `navigation` prop to move from one screen to the next with `navigation.navigate('Game')`.
* We customized the header for our start screen using the `options` prop.
* We completed several challenges including custom header styles, a custom back button, and screen transitions.

The question we ended with was: "How do we make our screens talk to each other?"

> **Starting Point:** Your GuessQuest project should already have the navigation structure set up from Session 7. If you haven't completed Session 7, please do so before continuing.

---

## Review: How We Pass Data Between Screens

In the challenges for Session 7, you already implemented the core logic for passing data. Specifically, you updated the `StartGameScreen` to send the player's name to the `GameScreen`.

Let's quickly review the two key pieces of code that make this work:

1.  **Sending Data (`StartGameScreen.tsx`):**
    We passed a second argument to `navigation.navigate`, containing the data we wanted to send.

    ```tsx
    // In handleStartGame() in StartGameScreen.tsx
    navigation.navigate('Game', { 
      playerName: playerName.trim() || 'Player' 
    });
    ```

2.  **Receiving Data (`GameScreen.tsx`):**
    We used the `route` prop, which every screen component receives, to access the data via `route.params`.

    ```tsx
    // At the top of the GameScreen component
    const { playerName } = route.params;
    ```

This works, but it has a weakness: TypeScript doesn't know what's inside `route.params`, which can lead to bugs. In this session, we will fix that and make our code more robust.

---

## Part 1: Typing Your Routes for Safety and Autocompletion

**Why is this important?** Without types, TypeScript doesn't know what `route.params` might contain. You could misspell `userNumber` and your code would crash at runtime without any prior warning from the editor.

The solution is to create a central type definition that tells TypeScript the "shape" of our navigation stack and the parameters each screen expects.

You can learn more from the official docs: [React Navigation: Type checking with TypeScript](https://reactnavigation.org/docs/typescript/)

### Code: Typing the `RootStackParamList`

We'll define a type for our navigation stack. This is often done in `App.tsx` or a dedicated `navigation/types.ts` file.

```tsx
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define all screens and the params they expect
export type RootStackParamList = {
  StartGame: undefined;
  Game: { 
    playerName: string;
  };
  GameOver: { 
    playerName: string;
    targetNumber: number;
    guessCount: number;
    gaveUp?: boolean;
  };
};

// Define the prop types for a specific screen
export type GameScreenProps = NativeStackScreenProps<RootStackParamList, 'Game'>;
```

> **Note:** Your GuessQuest project already has a `types/navigation.ts` file with a similar structure. It defines the parameters for each screen including `playerName`, `targetNumber`, `guessCount`, and `gaveUp`.

### Code: Using Typed Props in a Screen

Now, let's use these types in our `GameScreen` for full type safety and editor autocompletion.

```tsx
// In screens/GameScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// Import our navigation types
import { RootStackParamList } from '../types/navigation';

// Define the props type for our GameScreen
type GameScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Game'>;
  route: RouteProp<RootStackParamList, 'Game'>;
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
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  button: {
    width: '80%',
  },
  guessCount: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  giveUpButtonContainer: {
    width: '60%',
  },
});

export default GameScreen;
```

---

## Part 2: Componentization

### What is Componentization?

Componentization is the process of breaking down a large user interface into smaller, independent, and reusable pieces called **components**.

Before (One big file) 
```jsx
<View style={card}>
  <Text>Title</Text>
  <TextInput />
  <View>
    <Pressable style={btn1}>...</Pressable>
    <Pressable style={btn2}>...</Pressable>
  </View>
</View>
```
After (Using Components)

```jsx
<Card>
  <TitleText>Title</TitleText>
  <NumberInput />
  <PrimaryButton>...</PrimaryButton>
  <PrimaryButton>...</PrimaryButton>
</Card>
```

The "After" version is much easier to read, debug, and maintain.

### The DRY Principle: Don't Repeat Yourself

Writing the same styling for every button or every card is tedious and error-prone. If you need to change the style, you have to find and edit every single instance.

**Componentization helps us by:**
* **Reusability:** Build a `<PrimaryButton>` once, use it everywhere.
* **Maintainability:** Need to change the button color? Edit one file: `PrimaryButton.tsx`.
* **Readability:** `<Card>...</Card>` is much clearer than a `<View>` with 10 different style properties.

### Refactoring Step 1: Creating `Card.tsx`

Our `StartGameScreen` uses a container with shadows and rounded corners. Let's turn this into a `Card` component.

```tsx
### Step 0: Create the `components` Directory

First, create a new folder named `components` in the root of your `GuessQuest` project. This is where we will store all our reusable components.

### Refactoring Step 1: Creating `Card.tsx`
import React from 'react'; // Import React
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
```

### Refactoring Step 2: Creating `PrimaryButton.tsx`

We will have many buttons in our app. Let's create a standard, reusable button component.

```tsx
// In components/PrimaryButton.tsx
import React from 'react'; // Import React
import { View, Text, Pressable, StyleSheet } from 'react-native';

// Define the props type for our PrimaryButton component
type PrimaryButtonProps = {
  children: React.ReactNode; // The text or content inside the button
  onPress: () => void; // The function to call when button is pressed
};

// Create the PrimaryButton component with typed props
function PrimaryButton({ children, onPress }: PrimaryButtonProps) {
  // This function handles the press state for iOS (Android uses ripple effect)
  function pressHandler(pressed: boolean) {
    return pressed ? [styles.buttonInnerContainer, styles.pressed] : styles.buttonInnerContainer;
  }

  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable 
        style={({pressed}) => pressHandler(pressed)} 
        onPress={onPress} 
        android_ripple={{ color: '#640233' }}
      >
        <Text style={styles.buttonText}>{children}</Text>
      </Pressable>
    </View>
  );
}

export default PrimaryButton;

// Complete styles for our button
const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 28,
    margin: 4,
    overflow: 'hidden', // Ensures the ripple doesn't exceed the container
    width: '40%', // Takes up 40% of the parent width
  },
  buttonInnerContainer: {
    backgroundColor: '#72063c',
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Style for pressed state on iOS
  pressed: {
    opacity: 0.75,
  },
});
```

### The Final Result: A Clean `StartGameScreen.tsx`

After creating our new components, we can import and use them. Look how much cleaner our screen code becomes!

```tsx
// In screens/StartGameScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Import our custom components
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';

// Import our navigation types
import { RootStackParamList } from '../types/navigation';

// Define the props type for our StartGameScreen
type StartGameScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'StartGame'>;
};

function StartGameScreen({ navigation }: StartGameScreenProps) {
  // State for the player's name and the selected difficulty
  const [playerName, setPlayerName] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  
  // Handler for resetting the input
  function resetInputHandler() {
    setPlayerName('');
    setDifficulty('medium');
  }
  
  // Handler for confirming and starting the game
  function confirmInputHandler() {
    // Basic validation
    if (playerName.trim().length === 0) {
      Alert.alert(
        'Invalid input',
        'Please enter your name to start the game.',
        [{ text: 'Okay', style: 'destructive' }]
      );
      return;
    }
    
    // Navigate to the Game screen with parameters
    navigation.navigate('Game', {
      playerName: playerName.trim(),
      difficulty: difficulty
    });
  }
  
  // Function to handle difficulty selection
  function selectDifficulty(level: 'easy' | 'medium' | 'hard') {
    setDifficulty(level);
  }

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome to GuessQuest!</Text>
      <Card>
        <Text style={styles.instructionText}>Enter Your Name</Text>
        <TextInput 
          style={styles.input}
          placeholder="Your Name"
          value={playerName}
          onChangeText={setPlayerName}
          maxLength={20}
          autoCorrect={false}
        />
        
        <Text style={styles.instructionText}>Select Difficulty</Text>
        <View style={styles.difficultyContainer}>
          <PrimaryButton 
            onPress={() => selectDifficulty('easy')}
          >
            Easy
          </PrimaryButton>
          <PrimaryButton 
            onPress={() => selectDifficulty('medium')}
          >
            Medium
          </PrimaryButton>
          <PrimaryButton 
            onPress={() => selectDifficulty('hard')}
          >
            Hard
          </PrimaryButton>
        </View>
        
        <Text style={styles.selectedText}>Selected: {difficulty}</Text>
        
        <View style={styles.buttonsContainer}>
          <PrimaryButton onPress={resetInputHandler}>Reset</PrimaryButton>
          <PrimaryButton onPress={confirmInputHandler}>Start Game</PrimaryButton>
        </View>
      </Card>
    </View>
  );
}

// Complete styles for our screen
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    marginTop: 100,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
  },
  instructionText: {
    color: '#ddb52f',
    fontSize: 16,
    marginBottom: 12,
  },
  input: {
    height: 50,
    width: '100%',
    fontSize: 16,
    borderBottomColor: '#ddb52f',
    borderBottomWidth: 2,
    color: '#ddb52f',
    marginVertical: 8,
    fontWeight: 'bold',
    padding: 8,
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  selectedText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});

export default StartGameScreen;
```

### Visualizing the New Component Structure

Our screen is no longer one monolithic block. It's a tree of simple, reusable components:

```
StartGame Screen
    |
    v
   Card
    |
   / \
  /   \
TextInput  Buttons Container
           /           \
          /             \
PrimaryButton:Reset    PrimaryButton:Confirm
```

---

## Your Task (15 minutes)

### Your Goal: Enhance the GuessQuest App

Apply what you just learned about data flow and componentization.

**The Task:**
1. Create a new reusable `Card` component in a `components` folder that can be used across multiple screens.
2. Create a new reusable `PrimaryButton` component that can be used for all buttons in the app.
3. Refactor the `StartGameScreen` to use these new components.
4. Add a new feature: Allow the player to set a difficulty level (Easy, Medium, Hard) on the `StartGameScreen` and pass this information to the `GameScreen`.

**Hint:** Use the existing parameter passing mechanism in the app as a reference. The process for passing the difficulty level will be similar to how the player name is currently passed.

### Task Hint & AI Assist

**Remember to update your types!**

First, update your `RootStackParamList` in `types/navigation.ts` to include the new difficulty parameter:

```tsx
// In types/navigation.ts
// This file contains shared type definitions for navigation
// Used across all screens to ensure consistency

/**
 * RootStackParamList defines the parameters for each route in our navigation stack
 * - StartGame: No parameters needed
 * - Game: Requires playerName and difficulty level
 * - GameOver: Requires game results (playerName, targetNumber, guessCount, optional gaveUp)
 */
export type RootStackParamList = {
  StartGame: undefined;
  Game: { 
    playerName: string;
    difficulty: 'easy' | 'medium' | 'hard'; // <-- Add this new parameter
  };
  GameOver: { 
    playerName: string;
    targetNumber: number;
    guessCount: number;
    gaveUp?: boolean;
  };
};
```

**AI Assist Prompt:** "Ask an AI to explain the difference between passing data with route params versus using a global state management solution like React Context for sharing data between screens. What are the pros and cons of each approach in the context of our 'GuessQuest' game?"

---

## Wrap-up & Next Steps

### Session Recap

**Congratulations! Your screens can now communicate.**

* Passed data between screens using `navigation.navigate('Screen', { params })`.
* Received data on a new screen using the `route.params` object.
* Ensured type safety for our routes using TypeScript.
* Understood the importance of Componentization and the DRY principle.
* Refactored our UI into clean, reusable `<Card>` and `<PrimaryButton>` components.

### Conceptual Bridge to Session 9

**Looking Ahead:**
"Our app is functional and well-structured, but it might look strange on different phones. Let's learn how to build adaptive UIs that work everywhere."

**Next time:** We will learn how to make our app's layout responsive to different screen sizes, orientations, and platforms using the `Dimensions` and `Platform` APIs. We'll build on the componentization principles we've learned today to create flexible, responsive components.
