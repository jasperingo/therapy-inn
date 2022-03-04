
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppDimensions from '../assets/values/dimensions';

const styles = StyleSheet.create({
  container: {
    marginVertical: AppDimensions.large,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  text: {
    textAlign: 'center',
    fontWeight: AppDimensions.fontBold,
    marginRight: AppDimensions.large,
  }
});

interface Props {
  error: string;
  onReloadPress: ()=> void
}

const LoadingError = ({ error, onReloadPress }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{ error }</Text>
      <TouchableOpacity 
        activeOpacity={0.6} 
        onPress={onReloadPress} 
        accessibilityLabel="Retry load of data"
        > 
        <Ionicons name="reload" size={AppDimensions.xLarge} />
      </TouchableOpacity>
    </View>
  );
}

export default LoadingError;
