import React from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import styles from './styles';

const ScanScreen = () => {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Scan or Enter a Product</Text>
      </View>
    </SafeAreaView>
  );
};

export default ScanScreen;
