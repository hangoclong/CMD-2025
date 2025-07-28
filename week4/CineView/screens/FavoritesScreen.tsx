import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import FavoriteButton from '../components/FavoriteButton';
import { FavoritesContext } from '../context/favorites-context';

// Movie type definition
type Movie = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  vote_average: number;
};

function FavoritesScreen() {
  // 1. Start in a loading state by default
  const [isLoading, setIsLoading] = useState(true);

  // 2. Data will be an array of movies, initially empty
  const [data, setData] = useState<Movie[]>([]);

  // 3. Error will be null initially
  const [error, setError] = useState<Error | null>(null);

  // Get the favorites context
  const favoritesCtx = useContext(FavoritesContext);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Using the API key provided by Dr. Long
        const response = await fetch(
          'https://api.themoviedb.org/3/movie/popular?api_key=7ec7d584b11035c6ddb69c329786369a'
        );
        const json = await response.json();
        setData(json.results); // Set data on success
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred')); // Set error on failure
      } finally {
        // This block runs regardless of success or failure
        setIsLoading(false); // Stop loading
      }
    };

    fetchMovies();
  }, []); // Empty array means this runs only ONCE

  // 1. Handle the loading state
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  // 2. Handle the error state
  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Failed to fetch movies. Please check your connection.</Text>
      </View>
    );
  }

  // Filter movies to only show favorites
  const favoriteMovies = data.filter(movie => 
    favoritesCtx.ids.includes(movie.id)
  );

  // 3. Handle the success state
  return (
    <SafeAreaView style={styles.container}>
      {favoriteMovies.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyMessage}>No favorite movies yet. Add some from the Movies tab!</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteMovies}
          keyExtractor={({ id }) => id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.movieItem}>
              {item.poster_path && (
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w92${item.poster_path}` }}
                  style={styles.poster}
                />
              )}
              <View style={styles.movieInfo}>
                <Text style={styles.movieTitle}>{item.title}</Text>
                <Text style={styles.releaseDate}>Release Date: {item.release_date}</Text>
                <Text style={styles.rating}>Rating: {item.vote_average.toFixed(1)}/10</Text>
              </View>
              <FavoriteButton movieId={item.id} />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Slightly different background to differentiate from Movies screen
  },
  listContent: {
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  movieItem: {
    margin: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    borderLeftWidth: 3,
    borderLeftColor: '#ffd700', // Gold border to indicate favorites
  },
  poster: {
    width: 50,
    height: 75,
    borderRadius: 4,
    marginRight: 12,
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  releaseDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  rating: {
    fontSize: 14,
    color: '#5c6bc0',
  },
});

export default FavoritesScreen;
