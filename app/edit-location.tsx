import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import styled from 'styled-components/native';
import { useLocations } from '../hooks/useLocations';
import { useResponsive } from '../hooks/useResponsive';
import { validateCoordinates, validateLocationName } from '../utils/validation';

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

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 15px;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: #4CAF50;
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  flex: 1;
`;

const DeleteButton = styled.TouchableOpacity`
  background-color: #f44336;
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  flex: 1;
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

export default function EditLocationScreen() {
  const { id } = useLocalSearchParams();
  const { locations, updateLocation, deleteLocation } = useLocations();
  const { isTablet, isLandscape } = useResponsive();
  
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [selectedColor, setSelectedColor] = useState('red');

  useEffect(() => {
    const location = locations.find(loc => loc.id === id);
    if (location) {
      setName(location.name);
      setLatitude(location.latitude.toString());
      setLongitude(location.longitude.toString());
      setSelectedColor(location.color);
    }
  }, [id, locations]);

  const handleSave = async () => {
    const trimmedName = name.trim();
    
    if (!validateLocationName(trimmedName)) {
      Alert.alert('Erro', 'Nome deve ter entre 2 e 50 caracteres');
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (!validateCoordinates(lat, lng)) {
      Alert.alert('Erro', 'Coordenadas inválidas\nLatitude: -90 a 90\nLongitude: -180 a 180');
      return;
    }

    try {
      await updateLocation(id as string, {
        name: trimmedName,
        latitude: lat,
        longitude: lng,
        color: selectedColor
      });

      Alert.alert('Sucesso', 'Localização atualizada!', [
        { text: 'OK', onPress: () => {
          router.back();
          setTimeout(() => {
            router.replace('/locations-list');
          }, 100);
        }}
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar localização');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta localização?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteLocation(id as string);
              Alert.alert('Sucesso', 'Localização excluída!', [
                { text: 'OK', onPress: () => {
                  router.back();
                  // Forçar refresh da tela anterior
                  setTimeout(() => {
                    router.replace('/');
                  }, 100);
                }}
              ]);
            } catch (error) {
              Alert.alert('Erro', 'Falha ao excluir localização');
            }
          }
        }
      ]
    );
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
          placeholder="Ex: -22.919594"
          keyboardType="numeric"
        />

        <Label>Longitude</Label>
        <Input
          isTablet={isTablet}
          value={longitude}
          onChangeText={setLongitude}
          placeholder="Ex: -43.234944"
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

        <ButtonContainer>
          <SaveButton onPress={handleSave}>
            <ButtonText>Salvar</ButtonText>
          </SaveButton>
          
          <DeleteButton onPress={handleDelete}>
            <ButtonText>Excluir</ButtonText>
          </DeleteButton>
        </ButtonContainer>
      </ResponsiveFormContainer>
    </Container>
  );
}