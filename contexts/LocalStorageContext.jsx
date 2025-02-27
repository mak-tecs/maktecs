import useLocalStorage from '@/app/hooks/useLocalStorage';
import React, { createContext, useContext } from 'react';

const LocalStorageContext = createContext();

export const LocalStorageProvider = ({ children }) => {
  const [cart, setCart] = useLocalStorage('cart', []);
  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  
  const value = {
    cart, setCart,
    favorites, setFavorites
  };

  return (
    <LocalStorageContext.Provider value={value}>
      {children}
    </LocalStorageContext.Provider>
  );
};

export const useLocalStorageContext = () => {
  return useContext(LocalStorageContext);
};