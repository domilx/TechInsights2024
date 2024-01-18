import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'ascii-capable' | 'numbers-and-punctuation' | 'url' | 'number-pad' | 'phone-pad' | 'name-phone-pad' | 'decimal-pad' | 'twitter' | 'web-search' | 'visible-password';
  maxLength?: number | null;
}

export const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, keyboardType = 'default' }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value.toString()}
      onChangeText={onChange}
      keyboardType={keyboardType}
    />
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
    padding: 10,
    marginHorizontal: 20,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#A0A0A0",
    borderRadius: 15,
    padding: 10,
    width: "100%",
    fontSize: 16,
    color: "#333",
  },
});
