import React from 'react';
import { ReactComponent, WidgetConfig, WidgetEditors, PropertySettings } from './src/components/component';
import { connectWidget } from 'apptile-core';

const Connected = connectWidget(
  'plantdashboard',
  ReactComponent,
  WidgetConfig,
  null,
  WidgetEditors,
  { propertySettings: PropertySettings, widgetStyleConfig: [], pluginListing: {} }
);

export default function App() {
  return <Connected model={{ get: () => {} }} />;
}
