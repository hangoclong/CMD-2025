// components/NumberContainer.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type NumberContainerProps = {
  children: React.ReactNode;
};

function NumberContainer({ children }: NumberContainerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.numberText}>{children}</Text>
    </View>
  );
}

export default NumberContainer;

const styles = StyleSheet.create({
  container: {
    borderWidth: 4,
    borderColor: '#ddb52f',
    padding: 24,
    margin: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: '#ddb52f',
    fontSize: 36,
    fontWeight: 'bold',
  },
});
