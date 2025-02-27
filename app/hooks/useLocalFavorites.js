import { useLocalStorageContext } from "@/contexts/LocalStorageContext";

export function useLocalFavorites() {
  const { favorites, setFavorites } = useLocalStorageContext();

  const addToFavorites = (productId) => {
    setFavorites((prevFavorites) => [...prevFavorites, productId]);
  };

  const removeFromFavorites = (productId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((id) => id !== productId)
    );
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
  };
}