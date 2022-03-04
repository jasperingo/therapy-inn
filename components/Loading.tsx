
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import AppColors from '../assets/values/colors';

const Loading = () => {
  return (
    <View>
      <ActivityIndicator color={AppColors.colorPrimary} size="large" />
    </View>
  );
}

export default Loading;
