import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.mock('../src/components/component', () => ({
  ReactComponent: () => null,
  WidgetConfig: {},
  WidgetEditors: {},
  PropertySettings: {}
}));

jest.mock("apptile-core", () => ({
  connectWidget: () => () => {
    const React = require("react");
    const { Text } = require("react-native");
    return <Text testID="mock-connected">Mock Connected</Text>;
  }
}));

test('renders connected component', () => {
  const { getByTestId } = render(<App />);
  expect(getByTestId('mock-connected')).toBeTruthy();
});
