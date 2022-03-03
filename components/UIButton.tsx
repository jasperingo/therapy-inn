
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';

const styles = StyleSheet.create({
  container: {
    marginVertical: AppDimensions.small
  },

  button: {
    padding: AppDimensions.small,
    borderRadius: AppDimensions.xSmall,
    backgroundColor: AppColors.colorPrimary
  },

  dangerButton: {
    backgroundColor: AppColors.colorError
  },

  text: {
    textAlign: 'center',
    color: AppColors.colorOnPrimary,
    fontWeight: AppDimensions.fontBold,
  }
});

interface Props {
  text: string;
  danger?: boolean;
  loading: boolean;
  onClick: ()=> void
}

const UIButton = ({ text, loading, danger = false, onClick }: Props) => {

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, danger ? styles.dangerButton : null]} 
        activeOpacity={0.6}
        onPress={onClick}
        >
         { 
        loading ?
          <ActivityIndicator color={AppColors.colorOnPrimary} size="small" />
          :
          <Text style={styles.text}>{ text }</Text>
        }
      </TouchableOpacity>
    </View>
  );
}

export default UIButton;
