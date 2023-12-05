import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ConfirmDataScreen({ data }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{data}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    padding: 20,
  },
});
