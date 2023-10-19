import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function ScannedDataScreen(props: any) {
  return (
    <View style={styles.container}>
      <Text>Scanned Data: {props.data}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScannedDataScreen;