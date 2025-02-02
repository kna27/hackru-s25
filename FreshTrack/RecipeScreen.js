import React from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import styles from './styles';

const RecipeScreen = () => {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>AI Recipe Suggestions</Text>
      </View>
    </SafeAreaView>
  );
};

export default RecipeScreen;
