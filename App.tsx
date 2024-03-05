import React, { useEffect } from "react";
import AppNavigator from "./screens/AppNavigator";
import { DataProvider } from "./contexts/DataContext";
import { registerBackgroundFetchAsync } from "./services/BackgroundTask";
import PropTypes from "prop-types";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  useEffect(() => {
    registerBackgroundFetchAsync();
  }, []);

  return (
    <>
      <AuthProvider>
        <DataProvider>
          <AppNavigator />
        </DataProvider>
      </AuthProvider>
    </>
  );
}
