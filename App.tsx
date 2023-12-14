import React from 'react';
import AppNavigator from './screens/AppNavigator';
import { DataProvider } from './contexts/DataContext';

export default function App() {
  return (
    <>
      <DataProvider>
        <AppNavigator/>
      </DataProvider>
    </>
  );
}
