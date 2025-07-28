import React, { createContext, useState, ReactNode } from 'react';

// Define the "shape" of our context data and functions
type FavoritesContextType = {
  ids: number[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
};

// Create the context with a default value
export const FavoritesContext = createContext<FavoritesContextType>({
  ids: [],
  addFavorite: (id: number) => {},
  removeFavorite: (id: number) => {},
});

// Create the provider component
function FavoritesContextProvider({ children }: { children: ReactNode }) {
  const [favoriteMovieIds, setFavoriteMovieIds] = useState<number[]>([]);

  function addFavorite(id: number) {
    setFavoriteMovieIds((currentIds) => [...currentIds, id]);
  }

  function removeFavorite(id: number) {
    setFavoriteMovieIds((currentIds) =>
      currentIds.filter((movieId) => movieId !== id)
    );
  }

  // The value that will be passed to all consuming components
  const value = {
    ids: favoriteMovieIds,
    addFavorite: addFavorite,
    removeFavorite: removeFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export default FavoritesContextProvider;
