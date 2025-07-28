import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import FavoriteButton from '../components/FavoriteButton';
import { FavoritesContext } from '../context/favorites-context';

// Movie type definition
type Movie = {
  id: number;
  title: string;
  release_date: string;
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
    <View style={styles.container}>
      {favoriteMovies.length === 0 ? (
        <View style={styles.centered}>
          <Text>No favorite movies yet. Add some from the Movies tab!</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteMovies}
          keyExtractor={({ id }) => id.toString()}
          renderItem={({ item }) => (
            <View style={styles.movieItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.movieTitle}>{item.title}</Text>
                <Text>Release Date: {item.release_date}</Text>
              </View>
              <FavoriteButton movieId={item.id} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FavoritesScreen;
