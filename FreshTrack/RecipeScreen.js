import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const RecipeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>AI Recipe Suggestions</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RecipeScreen;
