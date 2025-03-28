import React from 'react';
import { View, StyleSheet } from 'react-native';
import GoogleAIDemo from '../components/GoogleAIDemo';

export default function GoogleAIScreen() {
  return (
    <View style={styles.container}>
      <GoogleAIDemo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
}); 