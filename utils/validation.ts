export const validateCoordinates = (lat: number, lng: number): boolean => {
  return (
    !isNaN(lat) && 
    !isNaN(lng) && 
    lat >= -90 && 
    lat <= 90 && 
    lng >= -180 && 
    lng <= 180
  );
};

export const validateLocationName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};

export const sanitizeLocationName = (name: string): string => {
  // Apenas remove espaços extras no início e fim
  return name.trim();
};

export const formatCoordinate = (coord: number): string => {
  return coord.toFixed(6);
};