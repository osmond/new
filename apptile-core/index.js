import React from 'react';
import { useWindowDimensions, Text } from 'react-native';

export function connectWidget(name, Component) {
  return function ConnectedWidget(props) {
    return <Component {...props} />;
  };
}

export function useApptileWindowDims() {
  return useWindowDimensions();
}

export function navigateToScreen(screen, params) {
  return { type: 'NAVIGATE', screen, params };
}

export function Icon({ name, size = 16, color = 'black' }) {
  return <Text style={{ fontSize: size, color }}>{name}</Text>;
}
