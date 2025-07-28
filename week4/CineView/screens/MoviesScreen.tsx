import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import FavoriteButton from '../components/FavoriteButton';

// Movie type definition
type Movie = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  vote_average: number;
};

function MoviesScreen() {
  // 1. Start in a loading state by default
  const [isLoading, setIsLoading] = useState(true);

  // 2. Data will be an array of movies, initially empty
  const [data, setData] = useState<Movie[]>([]);

  // 3. Error will be null initially
  const [error, setError] = useState<Error | null>(null);
  
  // 4. New state for pull-to-refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // 5. New state for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Refactored fetchMovies to handle pagination
  const fetchMovies = async (page = 1, shouldReplace = true) => {
    try {
      // Using the API key provided by Dr. Long
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=7ec7d584b11035c6ddb69c329786369a&page=${page}`
      );
      const json = await response.json();
      
      if (shouldReplace) {
        // Replace existing data (for initial load or refresh)
        setData(json.results);
      } else {
        // Append new data (for infinite scroll)
        setData(prevData => [...prevData, ...json.results]);
      }
      
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false); // Also handle the refreshing state
    }
  };
  
  // Handler for pull-to-refresh
  const handleRefresh = async () => {
    console.log('Refreshing movie list...');
    setIsRefreshing(true);
    await fetchMovies(1, true); // Fetch page 1 and replace existing data
  };
  
  // Handler for infinite scroll
  const loadMoreMovies = () => {
    console.log('Loading more movies, page:', currentPage + 1);
    fetchMovies(currentPage + 1, false); // Fetch next page and append data
  };

  useEffect(() => {
    fetchMovies(1, true); // Initial fetch
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

  // 3. Handle the success state
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
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
        // Pull-to-refresh props
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        // Infinite scroll props
        onEndReached={loadMoreMovies}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

export default MoviesScreen;
