import React, { useEffect, useState } from "react";
import AppNavigator from "./screens/AppNavigator";
import { DataProvider } from "./contexts/DataContext";
import { registerBackgroundFetchAsync } from "./services/BackgroundTask";
import PropTypes from "prop-types";
import { AuthProvider } from "./contexts/AuthContext";
import { isLatest } from "./services/FirebaseService";
import { checkInternetConnection } from "./services/NetworkService";
import { View, Text, StyleSheet } from "react-native";

export default function App() {
  const [hasLastversion, setIsLatest] = useState<boolean | (() => Promise<boolean>)>(false);

  useEffect(() => {
    const fetchData = async () => {
      const latest = await isLatest();
      setIsLatest(latest);
    };
    const checkConnection = async () => {
      if (await checkInternetConnection()) {
        fetchData();
      } else {
        setIsLatest(true);
      }
    };
    checkConnection();
    
    registerBackgroundFetchAsync();
  }, []);

  return (
    <>
      {hasLastversion && (
        <AuthProvider>
          <DataProvider>
            <AppNavigator />
          </DataProvider>
        </AuthProvider>
      )} 
      {/* esle show an error */}
      {!hasLastversion && (
        <View style={styles.container}>
          <Text style={styles.headerText}>Please update the app to the latest version</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
