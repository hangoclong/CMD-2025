import React, { useContext } from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FavoritesContext } from '../context/favorites-context';

function FavoriteButton({ movieId }: { movieId: number }) {
  const favoritesCtx = useContext(FavoritesContext);
  const isFavorite = favoritesCtx.ids.includes(movieId);

  function toggleFavorite() {
    if (isFavorite) {
      favoritesCtx.removeFavorite(movieId);
    } else {
      favoritesCtx.addFavorite(movieId);
    }
  }

  return (
    <Pressable 
      onPress={toggleFavorite} 
      style={({ pressed }) => [{
        padding: 8,
        opacity: pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.95 : 1 }],
      }]}
    >
      <Ionicons
        name={isFavorite ? 'star' : 'star-outline'}
        size={28}
        color="gold"
      />
    </Pressable>
  );
}

export default FavoriteButton;
