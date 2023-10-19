import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ScannedScreenProps {
  data: string;
}

export default function ScannedScreen({ data }: ScannedScreenProps) {
  return (
    <View style={styles.container}>
      <Text>Scanned Data:</Text>
      <Text>{data}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
