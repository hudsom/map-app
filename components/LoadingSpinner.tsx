import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
`;

const SpinnerContainer = styled(Animated.View)`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  border: 4px solid #e3f2fd;
  border-top-color: #2196f3;
`;

const LoadingText = styled.Text`
  margin-top: 20px;
  font-size: 16px;
  color: #666;
  text-align: center;
`;

const LocationIcon = styled.Text`
  font-size: 40px;
  margin-bottom: 20px;
`;

interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({ text = "Carregando localização..." }: LoadingSpinnerProps) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );

    spin.start();

    return () => spin.stop();
  }, []);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Container>
      <LocationIcon>📍</LocationIcon>
      <SpinnerContainer style={{ transform: [{ rotate }] }} />
      <LoadingText>{text}</LoadingText>
    </Container>
  );
}