import React, { memo } from 'react';
import { Marker } from 'react-native-maps';

interface OptimizedMarkerProps {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  pinColor: string;
  onPress: () => void;
}

const OptimizedMarker = memo(({ coordinate, title, pinColor, onPress }: OptimizedMarkerProps) => {
  return (
    <Marker
      coordinate={coordinate}
      title={title}
      pinColor={pinColor}
      onPress={onPress}
    />
  );
});

OptimizedMarker.displayName = 'OptimizedMarker';

export default OptimizedMarker;