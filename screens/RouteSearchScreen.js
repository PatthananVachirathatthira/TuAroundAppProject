import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RouteSearchScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default RouteSearchScreen