// components/Title.tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';

type TitleProps = {
  children: React.ReactNode;
};

function Title({ children }: TitleProps) {
  return <Text style={styles.title}>{children}</Text>;
}

export default Title;

const styles = StyleSheet.create({
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: 'white',
    padding: 12,
    marginBottom: 24,
  },
});
