import React, { useRef, useEffect } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

interface AnimatedFABProps {
  onPress: () => void;
  isTablet: boolean;
}

const FABContainer = styled(Animated.View)<{ isTablet: boolean }>`
  position: absolute;
  bottom: ${props => props.isTablet ? '40px' : '30px'};
  right: ${props => props.isTablet ? '40px' : '30px'};
  width: ${props => props.isTablet ? '64px' : '56px'};
  height: ${props => props.isTablet ? '64px' : '56px'};
  border-radius: ${props => props.isTablet ? '32px' : '28px'};
  background-color: #2196f3;
  justify-content: center;
  align-items: center;
  elevation: 8;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
`;

const FABText = styled.Text`
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

export default function AnimatedFAB({ onPress, isTablet }: AnimatedFABProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de pulsação
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    return () => pulse.stop();
  }, []);

  const handlePress = () => {
    // Animação de rotação ao clicar
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
      onPress();
    });
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <FABContainer
        isTablet={isTablet}
        style={{
          transform: [
            { scale: scaleAnim },
            { rotate: rotate }
          ],
        }}
      >
        <FABText>+</FABText>
      </FABContainer>
    </TouchableOpacity>
  );
}