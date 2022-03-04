
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.colorSurface,
    paddingVertical: AppDimensions.xxLarge,
  },
  
  text: {
    textAlign: 'center',
    fontSize: AppDimensions.xLarge
  }
});

const LoadingEmpty = ({ text }: { text: string }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{ text }</Text>
    </View>
  );
}

export default LoadingEmpty;
