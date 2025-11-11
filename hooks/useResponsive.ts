import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export interface ResponsiveInfo {
  width: number;
  height: number;
  isTablet: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
}

export const useResponsive = (): ResponsiveInfo => {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      console.log('Dimensões mudaram:', window.width, 'x', window.height);
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;
  const isTablet = Math.min(width, height) >= 600;
  const isLandscape = width > height;
  const isPortrait = height >= width;

  console.log('Responsive:', { width, height, isTablet, isLandscape, isPortrait });

  return {
    width,
    height,
    isTablet,
    isLandscape,
    isPortrait,
  };
};