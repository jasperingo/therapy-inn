
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import AppColors from '../assets/values/colors';

const Loading = ({ color = AppColors.colorPrimary, size = 'large' }: { color?: string, size?: 'large' | 'small' }) => {
  return (
    <View>
      <ActivityIndicator color={color} size={size} />
    </View>
  );
}

export default Loading;
