# Week 3, Session 9: Building Adaptive User Interfaces

**Project: "GuessQuest" - A Number Guessing Game**

---

## Today's Goals

In our last session, we built a functional two-screen app. Today, we will make it look professional and polished on **any device**. We'll learn how to make our UI adapt to different screen sizes, orientations (portrait vs. landscape), and platforms (iOS vs. Android).

1.  **Reusable Components:** Create additional UI components to improve our app structure.
2.  **The Safe Area:** Learn how to prevent our app from being hidden behind phone notches and home bars using `<SafeAreaView>`.
3.  **Platform-Specific Styles:** Apply different styles for iOS and Android using the `Platform` API to respect design conventions.
4.  **Dynamic Sizing:** Use the `useWindowDimensions` hook to get the screen size and make our layout respond to device rotation.
5.  **Code-Along:** Apply these concepts step-by-step to our "GuessQuest" app.

---

## Review: Where We Left Off (End of Session 8)

Our app is functional:
*   [StartGameScreen](cci:1://file:///Users/hangoclong/Repos/Code-CMD/week3/GuessQuest/screens/StartGameScreen.tsx:20:0-53:1) collects a player's name.
*   It navigates to [GameScreen](cci:1://file:///Users/hangoclong/Repos/Code-CMD/week3/GuessQuest/screens/GameScreen.tsx:21:0-85:1), passing the name.
*   The layout is built with reusable `<Card>` and `<PrimaryButton>` components.

**The Problem:** Our layout is static. It looks okay on one specific device but will break on phones with different screen sizes or when rotated.

---

## Step 1: Creating Essential UI Components

Before we implement adaptive layouts, we need to create two reusable components that will help us structure our UI better.

### Task 1: Create a Title Component

Let's create a standardized way to display screen titles across our app.

1. Create a new file `components/Title.tsx`
2. Add the following code:

```tsx
// components/Title.tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';

type TitleProps = {
  children: React.ReactNode;
};

function Title({ children }: TitleProps) {
  return <Text style={styles.title}>{children}</Text>;
}

export default Title;

const styles = StyleSheet.create({
  title: {
    // Note: If you don't have the open-sans-bold font, you can use fontWeight instead
    // fontFamily: 'open-sans-bold',
    fontWeight: 'bold',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: 'white',
    padding: 12,
    marginBottom: 24,
  },
});
```

### Task 2: Create a NumberContainer Component

Next, let's create a component to display numbers in a stylized container.

1. Create a new file `components/NumberContainer.tsx`
2. Add the following code:

```tsx
// components/NumberContainer.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type NumberContainerProps = {
  children: React.ReactNode;
};

function NumberContainer({ children }: NumberContainerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.numberText}>{children}</Text>
    </View>
  );
}

export default NumberContainer;

const styles = StyleSheet.create({
  container: {
    borderWidth: 4,
    borderColor: '#ddb52f',
    padding: 24,
    margin: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: '#ddb52f',
    fontSize: 36,
    fontWeight: 'bold',
  },
});
```

---

## Step 2: Respecting the Safe Area

Modern phones have notches, camera cutouts, and home indicators that can overlap with our app's UI. The "Safe Area" is the part of the screen that is guaranteed to be visible.

**The Fix:** We will use the `<SafeAreaView>` component to ensure our content stays within this visible area.

### Task: Update [StartGameScreen.tsx](cci:7://file:///Users/hangoclong/Repos/Code-CMD/week3/GuessQuest/screens/StartGameScreen.tsx:0:0-0:0)

Let's wrap our [StartGameScreen](cci:1://file:///Users/hangoclong/Repos/Code-CMD/week3/GuessQuest/screens/StartGameScreen.tsx:20:0-53:1) with `<SafeAreaView>`.

1.  Open [screens/StartGameScreen.tsx](cci:7://file:///Users/hangoclong/Repos/Code-CMD/week3/GuessQuest/screens/StartGameScreen.tsx:0:0-0:0).
2.  Import `SafeAreaView` from `react-native`.
3.  Replace the top-level `<View>` with `<SafeAreaView>` and give it a style of `flex: 1`.

**Your [screens/StartGameScreen.tsx](cci:7://file:///Users/hangoclong/Repos/Code-CMD/week3/GuessQuest/screens/StartGameScreen.tsx:0:0-0:0) should look like this:**

```tsx
// screens/StartGameScreen.tsx

import React, { useState } from 'react';
// 1. Import SafeAreaView
import { View, Text, StyleSheet, TextInput, Image, SafeAreaView } from 'react-native';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type StartGameScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'StartGame'>;
};

function StartGameScreen({ navigation }: StartGameScreenProps) { 
  const [playerName, setPlayerName] = useState('');
  
  function handleStartGame() {
    navigation.navigate('Game', { 
      playerName: playerName.trim() || 'Player' 
    }); 
  }

  return (
    // 2. Replace View with SafeAreaView and add flex: 1
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Image 
          source={require('../assets/quest-icon.png')} 
          style={styles.logo}
        />
        <Text style={styles.title}>Welcome to GuessQuest!</Text>
        <Card>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={playerName}
            onChangeText={setPlayerName}
          />
          <PrimaryButton onPress={handleStartGame}>Start Game</PrimaryButton>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 3. Add a new 'screen' style
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  // ... other styles remain the same
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#6a1b9a',
  },
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
```

> **Repeat this process for [GameScreen.tsx](cci:7://file:///Users/hangoclong/Repos/Code-CMD/week3/GuessQuest/screens/GameScreen.tsx:0:0-0:0) and `GameOverScreen.tsx`** to ensure all screens are safe.
>
> For `GameOverScreen.tsx`, follow the same pattern:
> 1. Import `SafeAreaView` from `react-native`
> 2. Wrap the top-level `<View>` with `<SafeAreaView style={styles.screen}>`
> 3. Add a `screen: { flex: 1 }` style to your StyleSheet

---

## Step 3: Platform-Specific Shadows

iOS and Android have different design languages. iOS uses soft, layered shadows, while Android uses a concept called "elevation" to show depth. Our `<Card>` component should respect this.

**The Fix:** We will use the `Platform` API to apply different styles based on the operating system.

### Task: Update [Card.tsx](cci:7://file:///Users/hangoclong/Repos/Code-CMD/week3/GuessQuest/components/Card.tsx:0:0-0:0)

1.  Open [components/Card.tsx](cci:7://file:///Users/hangoclong/Repos/Code-CMD/week3/GuessQuest/components/Card.tsx:0:0-0:0).
2.  Import `Platform` from `react-native`.
3.  Use `Platform.select()` to provide different shadow styles for `ios` and `android`.

**Your [components/Card.tsx](cci:7://file:///Users/hangoclong/Repos/Code-CMD/week3/GuessQuest/components/Card.tsx:0:0-0:0) should look like this:**

```tsx
// components/Card.tsx

import React from 'react';
// 1. Import Platform
import { View, StyleSheet, Platform } from 'react-native';

type CardProps = {
  children: React.ReactNode;
};

function Card({ children }: CardProps) {
  return <View style={styles.card}>{children}</View>;
}

export default Card;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginTop: 36,
    marginHorizontal: 24,
    backgroundColor: '#3b021f',
    borderRadius: 8,
    // 2. Replace existing shadow/elevation with Platform.select
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.25,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
```

---

## Step 4: Handling Device Rotation

What happens when a user rotates their phone? The width and height change, and our layout should adapt.

**The Modern Solution:** The `useWindowDimensions` hook. This hook automatically provides the latest screen `width` and `height` and re-renders your component whenever they change.

### Task: Implement a Landscape Layout for [GameScreen.tsx](cci:7://file:///Users/hangoclong/Repos/Code-CMD/week3/GuessQuest/screens/GameScreen.tsx:0:0-0:0)

Our goal is to create a different layout for landscape mode where the controls are next to the number, not below it.

1.  Open [screens/GameScreen.tsx](cci:7://file:///Users/hangoclong/Repos/Code-CMD/week3/GuessQuest/screens/GameScreen.tsx:0:0-0:0).
2.  Import `useWindowDimensions` and `SafeAreaView`.
3.  Use the hook to get the `width` and `height`.
4.  Create a boolean `isLandscape` to check if `width > height`.
5.  Use an `if` statement to render a different JSX structure for the landscape layout.

**Your final [screens/GameScreen.tsx](cci:7://file:///Users/hangoclong/Repos/Code-CMD/week3/GuessQuest/screens/GameScreen.tsx:0:0-0:0) should look like this:**

```tsx
// screens/GameScreen.tsx

import React, { useState } from 'react';
// 1. Import SafeAreaView and useWindowDimensions
import { View, Text, Button, StyleSheet, Alert, SafeAreaView, useWindowDimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
// 2. Import our new components
import NumberContainer from '../components/NumberContainer';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import Title from '../components/Title';

type GameScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Game'>;
  route: RouteProp<RootStackParamList, 'Game'>;
};

function GameScreen({ navigation, route }: GameScreenProps) {
  const { playerName } = route.params;
  const [targetNumber] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guessCount, setGuessCount] = useState(0);

  // 3. Use the hook to get dynamic dimensions
  const { width, height } = useWindowDimensions();

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

  // 4. Determine orientation
  const isLandscape = width > height;

  // 5. Define content conditionally
  let content = (
    <>
      <NumberContainer>{targetNumber}</NumberContainer>
      <Card>
        <Text style={{ color: 'white' }}>Higher or Lower?</Text>
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
        <Title>Opponent's Guess</Title>
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
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  // 6. Add styles for the landscape layout
  contentLandscape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  // ... other styles
});

export default GameScreen;
```

---

## Session Recap

Congratulations! You now have the core skills to build UIs that look great everywhere.

*   **`<SafeAreaView>`** is essential for avoiding physical screen obstructions.
*   **`Platform.select()`** is the clean way to handle design differences between iOS and Android.
*   **`useWindowDimensions`** is the modern, powerful hook for creating layouts that respond to screen rotation and size changes.
*   **Conditional Rendering** (`if/else` or ternary operators) allows you to serve completely different JSX based on screen dimensions.