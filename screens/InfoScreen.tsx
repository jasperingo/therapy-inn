
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppDimensions from '../assets/values/dimensions';

const styles = StyleSheet.create({
  text: {
    fontSize: AppDimensions.large
  }
});

const InfoScreen = () => {
  return (
    <View>
      <Text style={styles.text}>InfoScreen</Text>
    </View>
  );
}

export default InfoScreen;
