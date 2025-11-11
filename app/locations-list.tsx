import React from 'react';
import { FlatList, Alert, Dimensions } from 'react-native';
import { router } from 'expo-router';
import styled from 'styled-components/native';
import { useLocations } from '../hooks/useLocations';
import { useResponsive } from '../hooks/useResponsive';



const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

const ListItem = styled.TouchableOpacity<{ isTablet: boolean; numColumns: number }>`
  background-color: white;
  margin: 8px;
  padding: ${props => props.isTablet ? '20px' : '16px'};
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  flex: ${props => props.numColumns > 1 ? '1' : 'none'};
  min-height: ${props => props.isTablet ? '80px' : '70px'};
`;

const ColorIndicator = styled.View<{ color: string; isTablet: boolean }>`
  width: ${props => props.isTablet ? '24px' : '20px'};
  height: ${props => props.isTablet ? '24px' : '20px'};
  border-radius: ${props => props.isTablet ? '12px' : '10px'};
  background-color: ${props => props.color};
  margin-right: ${props => props.isTablet ? '20px' : '15px'};
`;

const TextContainer = styled.View`
  flex: 1;
`;

const LocationName = styled.Text<{ isTablet: boolean }>`
  font-size: ${props => props.isTablet ? '18px' : '16px'};
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
`;

const LocationCoords = styled.Text<{ isTablet: boolean }>`
  font-size: ${props => props.isTablet ? '16px' : '14px'};
  color: #666;
`;

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const EmptyText = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
`;

export default function LocationsListScreen() {
  const { locations, deleteLocation } = useLocations();
  const { isTablet, isLandscape, width } = useResponsive();
  
  const numColumns = isTablet ? (isLandscape ? 3 : 2) : 1;

  const handleLocationPress = (location: any) => {
    Alert.alert(
      location.name,
      `Lat: ${location.latitude.toFixed(6)}\nLng: ${location.longitude.toFixed(6)}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ver', onPress: () => {
          router.back();
          // Navegar para o mapa e centralizar na localização
          setTimeout(() => {
            router.push(`/?lat=${location.latitude}&lng=${location.longitude}`);
          }, 100);
        }},
        { text: 'Editar', onPress: () => router.push(`/edit-location?id=${location.id}`) },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: () => handleRemoveLocation(location.id)
        }
      ]
    );
  };

  const handleRemoveLocation = (id: string) => {
    Alert.alert(
      'Confirmar',
      'Deseja remover esta localização?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: () => deleteLocation(id)
        }
      ]
    );
  };

  const renderLocationItem = ({ item }: { item: any }) => (
    <ListItem 
      isTablet={isTablet} 
      numColumns={numColumns}
      onPress={() => handleLocationPress(item)}
    >
      <ColorIndicator color={item.color} isTablet={isTablet} />
      <TextContainer>
        <LocationName isTablet={isTablet}>{item.name}</LocationName>
        <LocationCoords isTablet={isTablet}>
          {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
        </LocationCoords>
      </TextContainer>
    </ListItem>
  );

  if (locations.length === 0) {
    return (
      <Container>
        <EmptyContainer>
          <EmptyText>
            Nenhuma localização salva.{'\n'}
            Adicione uma localização no mapa!
          </EmptyText>
        </EmptyContainer>
      </Container>
    );
  }

  return (
    <Container>
      <FlatList
        data={locations}
        renderItem={renderLocationItem}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        key={`${numColumns}-${isTablet}`}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={8}
        getItemLayout={(data, index) => ({
          length: isTablet ? 80 : 70,
          offset: (isTablet ? 80 : 70) * index,
          index,
        })}
        contentContainerStyle={{ 
          paddingVertical: 8,
          paddingHorizontal: isTablet ? 16 : 8
        }}
      />
    </Container>
  );
}