import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FavoriteLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  color: string;
}

const STORAGE_KEY = 'favorite_locations';

export const useLocations = () => {
  const [locations, setLocations] = useState<FavoriteLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLocations(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar localizações:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveLocation = async (location: Omit<FavoriteLocation, 'id'>) => {
    try {
      const newLocation: FavoriteLocation = {
        ...location,
        id: Date.now().toString(),
      };
      const updatedLocations = [...locations, newLocation];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocations));
      setLocations(updatedLocations);
      return newLocation;
    } catch (error) {
      console.error('Erro ao salvar localização:', error);
      throw error;
    }
  };

  const updateLocation = async (id: string, updates: Partial<FavoriteLocation>) => {
    try {
      const updatedLocations = locations.map(loc => 
        loc.id === id ? { ...loc, ...updates } : loc
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocations));
      setLocations(updatedLocations);
    } catch (error) {
      console.error('Erro ao atualizar localização:', error);
      throw error;
    }
  };

  const deleteLocation = async (id: string) => {
    try {
      const updatedLocations = locations.filter(loc => loc.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocations));
      setLocations(updatedLocations);
    } catch (error) {
      console.error('Erro ao deletar localização:', error);
      throw error;
    }
  };

  return {
    locations,
    loading,
    saveLocation,
    updateLocation,
    deleteLocation,
  };
};