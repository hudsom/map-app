import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import styled from 'styled-components/native';
import { useLocations } from '../hooks/useLocations';
import { useUserLocation } from '../hooks/useUserLocation';
import { useResponsive } from '../hooks/useResponsive';
import { useDebounce } from '../hooks/useDebounce';

const Container = styled.ScrollView`
  flex: 1;
  background-color: #f5f5f5;
`;

const ResponsiveFormContainer = styled.View<{ isTablet: boolean; isLandscape: boolean }>`
  padding: ${props => props.isTablet ? '40px' : '20px'};
  max-width: ${props => props.isTablet ? (props.isLandscape ? '600px' : '500px') : '100%'};
  align-self: center;
  width: 100%;
`;

const Input = styled.TextInput<{ isTablet?: boolean }>`
  background-color: white;
  padding: ${props => props.isTablet ? '18px' : '15px'};
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  font-size: ${props => props.isTablet ? '18px' : '16px'};
  elevation: 1;
`;

const ColorContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const ColorButton = styled.TouchableOpacity<{ color: string; selected: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${props => props.color};
  border: ${props => props.selected ? '3px solid #000' : '2px solid #ccc'};
`;

const SaveButton = styled.TouchableOpacity`
  background-color: #2196f3;
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  margin-top: 10px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
`;

const colors = ['red', 'blue', 'green', 'orange', 'purple'];

export default function AddLocationScreen() {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [selectedColor, setSelectedColor] = useState('red');
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedName = useDebounce(name, 300);
  const debouncedLat = useDebounce(latitude, 500);
  const debouncedLng = useDebounce(longitude, 500);
  
  const { saveLocation } = useLocations();
  const { location } = useUserLocation();
  const { isTablet, isLandscape } = useResponsive();

  const handleSave = async () => {
    if (!debouncedName.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }

    const lat = parseFloat(debouncedLat) || location?.latitude || 0;
    const lng = parseFloat(debouncedLng) || location?.longitude || 0;

    if (lat === 0 && lng === 0) {
      Alert.alert('Erro', 'Coordenadas inválidas');
      return;
    }

    setIsLoading(true);
    
    try {
      await saveLocation({
        name: debouncedName.trim(),
        latitude: lat,
        longitude: lng,
        color: selectedColor
      });
      
      Alert.alert('Sucesso', 'Localização salva!', [
        { text: 'OK', onPress: () => {
          router.back();
          setTimeout(() => {
            router.replace('/');
          }, 100);
        }}
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar localização');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <ResponsiveFormContainer isTablet={isTablet} isLandscape={isLandscape}>
        <Label>Nome da Localização</Label>
        <Input
          isTablet={isTablet}
          value={name}
          onChangeText={setName}
          placeholder="Ex: Minha Casa"
        />

        <Label>Latitude</Label>
        <Input
          isTablet={isTablet}
          value={latitude}
          onChangeText={setLatitude}
          placeholder={location?.latitude?.toString() || "Ex: -22.919594"}
          keyboardType="numeric"
        />

        <Label>Longitude</Label>
        <Input
          isTablet={isTablet}
          value={longitude}
          onChangeText={setLongitude}
          placeholder={location?.longitude?.toString() || "Ex: -43.234944"}
          keyboardType="numeric"
        />

        <Label>Cor do Marcador</Label>
        <ColorContainer>
          {colors.map(color => (
            <ColorButton
              key={color}
              color={color}
              selected={selectedColor === color}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </ColorContainer>

        <SaveButton onPress={handleSave} disabled={isLoading}>
          <ButtonText>{isLoading ? 'Salvando...' : 'Salvar Localização'}</ButtonText>
        </SaveButton>
      </ResponsiveFormContainer>
    </Container>
  );
}