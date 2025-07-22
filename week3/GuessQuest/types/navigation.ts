// types/navigation.ts
// This file contains shared type definitions for navigation
// Used across all screens to ensure consistency

/**
 * RootStackParamList defines the parameters for each route in our navigation stack
 * - StartGame: No parameters needed
 * - Game: Requires playerName
 * - GameOver: Requires game results (playerName, targetNumber, guessCount, optional gaveUp)
 */
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
