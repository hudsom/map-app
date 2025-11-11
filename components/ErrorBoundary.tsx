import React, { Component, ReactNode } from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
`;

const ErrorTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #d32f2f;
  margin-bottom: 16px;
  text-align: center;
`;

const ErrorMessage = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
  line-height: 24px;
`;

const ErrorIcon = styled.Text`
  font-size: 48px;
  margin-bottom: 20px;
`;

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>Ops! Algo deu errado</ErrorTitle>
          <ErrorMessage>
            Ocorreu um erro inesperado.{'\n'}
            Tente reiniciar o aplicativo.
          </ErrorMessage>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;