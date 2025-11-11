import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationData {
  latitude: number;
  longitude: number;
}

interface UseLocationReturn {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
}

export const useUserLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          // Usar localização padrão (Rio de Janeiro) se permissão negada
          setLocation({
            latitude: -22.919594,
            longitude: -43.234944,
          });
          setError('Localização não encontrada. Carregando no centro do Rio de Janeiro.');
          console.log('Localização não encontrada. Carregando no centro do Rio de Janeiro.');
          setLoading(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeout: 10000,
        });
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      } catch (err) {
        // Usar localização padrão se GPS falhar
        setLocation({
          latitude: -22.919594,
          longitude: -43.234944,
        });
        setError('Localização não encontrada. Carregando no centro do Rio de Janeiro.');
        console.log('Localização não encontrada. Carregando no centro do Rio de Janeiro.');
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  return { location, loading, error };
};