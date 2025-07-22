// App.tsx - With Challenge Implementations
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import your screen components
import StartGameScreen from './screens/StartGameScreen';
import GameScreen from './screens/GameScreen';
import GameOverScreen from './screens/GameOverScreen';

// Import shared navigation types
import { RootStackParamList } from './types/navigation';

// Create the stack navigator instance with proper typing
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      {/* 
      CHALLENGE 1: Customize Header Styles
      - Added screenOptions to customize header appearance for all screens
      - Set background color to purple and text to white
      - Added bold font weight to header title
      
      CHALLENGE 3: Add Animation to Screen Transitions
      - Added animation preset for screen transitions
      - Using SlideFromRightIOS which is similar to forHorizontalIOS
      */}
      <Stack.Navigator 
        initialRouteName="StartGame"
        screenOptions={{
          // Challenge 1: Custom Header Styles
          headerStyle: {
            backgroundColor: '#6a1b9a', // Purple header background
          },
          headerTintColor: '#fff', // White text color
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          // Challenge 3: Screen Transitions
          // Using native stack animation options
          animation: 'slide_from_right',
          // You can also try: 'slide_from_bottom', 'fade', etc.
        }}
      >
        <Stack.Screen 
          name="StartGame" 
          component={StartGameScreen} 
          options={{
            title: 'Guess My Number' // Custom header title
          }}
        />
        
        {/* 
        CHALLENGE 2: Add a Custom Back Button
        - Using options as a function to access navigation prop
        - Replacing default back button with custom icon button
        */}
        <Stack.Screen 
          name="Game" 
          component={GameScreen} 
          options={({ navigation }) => ({
            title: 'Playing Game',
            // Challenge 2: Custom Back Button
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => navigation.goBack()}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            ),
          })}
        />
        
        <Stack.Screen 
          name="GameOver" 
          component={GameOverScreen} 
          options={{
            title: 'Game Over',
            // We can also customize individual screens with different styles
            headerStyle: {
              backgroundColor: '#d32f2f', // Red background for Game Over screen
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
