
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';

const styles = StyleSheet.create({
  name: {
    fontSize: AppDimensions.medium,
    color: AppColors.colorOnPrimary,
    fontWeight: AppDimensions.fontBold
  },

  number: {
    fontSize: AppDimensions.small,
    color: AppColors.colorOnPrimary,
  }
});

const ChatHeader = () => {
  return (
    <View>
      <Text style={styles.name}>Dr rice beans</Text>
      <Text style={styles.number}>09030572411</Text>
    </View>
  );
}

export default ChatHeader;
