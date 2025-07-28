import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

// Import our MoviesScreen component
import MoviesScreen from '../../screens/MoviesScreen';

export default function HomeScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'CineView',
        headerStyle: {
          backgroundColor: '#4f46e5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />
      <MoviesScreen />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
