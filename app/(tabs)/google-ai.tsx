import React from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import GoogleAIDemo from '../../components/GoogleAIDemo';

export default function GoogleAIScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gemini AI</Text>
      </View>
      <GoogleAIDemo />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
}); 