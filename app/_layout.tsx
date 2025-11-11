import { Stack } from 'expo-router';
import ErrorBoundary from '../components/ErrorBoundary';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Localizações Favoritas'
          }} 
        />
        <Stack.Screen 
          name="add-location" 
          options={{ 
            title: 'Adicionar Localização',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="locations-list" 
          options={{ 
            title: 'Lista de Localizações'
          }} 
        />
        <Stack.Screen 
          name="edit-location" 
          options={{ 
            title: 'Editar Localização'
          }} 
        />
      </Stack>
    </ErrorBoundary>
  );
}