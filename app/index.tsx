import React, { useEffect } from 'react';
import { StyleSheet, Alert, ToastAndroid, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useUserLocation } from '../hooks/useUserLocation';
import { useLocations } from '../hooks/useLocations';
import { useResponsive } from '../hooks/useResponsive';
import { useMapRef } from '../hooks/useMapRef';
import styled from 'styled-components/native';
import AnimatedFAB from '../components/AnimatedFAB';
import LoadingSpinner from '../components/LoadingSpinner';
import OptimizedMarker from '../components/OptimizedMarker';



const ResponsiveContainer = styled.View<{ isTablet: boolean; isLandscape: boolean }>`
  flex: 1;
  flex-direction: ${props => props.isTablet ? 'row' : 'column'};
`;

const MapContainer = styled.View<{ isTablet: boolean; isLandscape: boolean }>`
  flex: ${props => props.isTablet ? '2' : '1'};
  position: relative;
`;

const SidePanel = styled.View`
  flex: 1;
  background-color: #f5f5f5;
  padding: 16px;
  border-left-width: 1px;
  border-left-color: #ddd;
`;

const SidePanelTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
`;

const LocationsList = styled.ScrollView`
  flex: 1;
`;

const LocationCard = styled.TouchableOpacity`
  background-color: white;
  padding: 12px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
`;

const ColorDot = styled.View<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: ${props => props.color};
  margin-right: 12px;
`;

const LocationInfo = styled.View`
  flex: 1;
`;

const LocationTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
`;

const LocationCoords = styled.Text`
  font-size: 12px;
  color: #666;
`;

const EmptyMessage = styled.Text`
  color: #666;
  text-align: center;
  font-size: 14px;
  margin-top: 20px;
`;

const HeaderButton = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 8px;
`;

const HeaderButtonText = styled.Text`
  font-size: 20px;
`;

export default function MapScreen() {
  const { location, loading, error } = useUserLocation();
  const { locations } = useLocations();
  const { isTablet, isLandscape } = useResponsive();
  const { mapRef, goToLocation } = useMapRef();
  const { lat, lng } = useLocalSearchParams();

  useEffect(() => {
    if (error) {
      const message = 'Localização não encontrada. Carregando no centro do Rio de Janeiro.';
      if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.LONG);
      } else {
        Alert.alert('Aviso', message);
      }
    }
  }, [error]);

  useEffect(() => {
    console.log('Localizações atualizadas:', locations.length, locations.map(l => l.id));
  }, [locations]);

  useEffect(() => {
    // Centralizar mapa se coordenadas foram passadas via parâmetros
    if (lat && lng) {
      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lng as string);
      
      if (!isNaN(latitude) && !isNaN(longitude)) {
        setTimeout(() => {
          goToLocation(latitude, longitude);
        }, 1000);
      }
    }
  }, [lat, lng, goToLocation]);

  const handleAddLocation = () => {
    router.push('/add-location');
  };



  const handleMarkerPress = (loc: any) => {
    Alert.alert(
      loc.name,
      `Lat: ${loc.latitude.toFixed(6)}\nLng: ${loc.longitude.toFixed(6)}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ver', onPress: () => goToLocation(loc.latitude, loc.longitude) },
        { text: 'Editar', onPress: () => router.push(`/edit-location?id=${loc.id}`) }
      ]
    );
  };

  if (loading) {
    return <LoadingSpinner text="Carregando localização..." />;
  }

  if (!location) {
    return <LoadingSpinner text="Localização não disponível" />;
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Localizações Favoritas',
          headerBackVisible: false,
          headerRight: () => (
            <HeaderButton onPress={() => router.push('/locations-list')}>
              <HeaderButtonText>📋</HeaderButtonText>
            </HeaderButton>
          )
        }}
      />
      <ResponsiveContainer isTablet={isTablet} isLandscape={isLandscape}>
        <MapContainer isTablet={isTablet} isLandscape={isLandscape}>
          <MapView
            ref={mapRef}
            key={`map-${locations.length}-${locations.map(l => l.id).join('-')}`}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {locations.map((loc) => (
              <OptimizedMarker
                key={loc.id}
                id={loc.id}
                coordinate={{
                  latitude: loc.latitude,
                  longitude: loc.longitude,
                }}
                title={loc.name}
                pinColor={loc.color}
                onPress={() => handleMarkerPress(loc)}
              />
            ))}
          </MapView>
          
          <AnimatedFAB isTablet={isTablet} onPress={handleAddLocation} />
        </MapContainer>
        
        {isTablet && (
          <SidePanel>
            <SidePanelTitle>📍 Localizações ({locations.length})</SidePanelTitle>
            <LocationsList>
              {locations.length === 0 ? (
                <EmptyMessage>Nenhuma localização salva</EmptyMessage>
              ) : (
                locations.map((loc) => (
                  <LocationCard key={loc.id} onPress={() => router.push(`/edit-location?id=${loc.id}`)}>
                    <ColorDot color={loc.color} />
                    <LocationInfo>
                      <LocationTitle>{loc.name}</LocationTitle>
                      <LocationCoords>{loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}</LocationCoords>
                    </LocationInfo>
                  </LocationCard>
                ))
              )}
            </LocationsList>
          </SidePanel>
        )}
      </ResponsiveContainer>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});