import React, { useEffect } from 'react';
import AppNavigator from './screens/AppNavigator';
import { DataProvider } from './contexts/DataContext';
import { registerBackgroundFetchAsync } from './services/BackgroundTask';

export default function App() {
  useEffect(() => {
    registerBackgroundFetchAsync();
  }, []);
  
  return (
    <>
      <DataProvider>
        <AppNavigator/>
      </DataProvider>
    </>
  );
}
