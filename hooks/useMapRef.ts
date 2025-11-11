import { useRef } from 'react';
import MapView from 'react-native-maps';

export const useMapRef = () => {
  const mapRef = useRef<MapView>(null);

  const goToLocation = (latitude: number, longitude: number) => {
    if (!mapRef.current || !latitude || !longitude) {
      return;
    }
    
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  };

  return { mapRef, goToLocation };
};