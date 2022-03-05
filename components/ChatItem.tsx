
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: AppDimensions.xSmall,
    borderRadius: AppDimensions.xSmall,
    marginVertical: AppDimensions.xSmall,
    marginHorizontal: AppDimensions.small,
    backgroundColor: AppColors.colorSurface
  },

  iamge: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: AppDimensions.xSmall
  },

  body: {
    flexGrow: 1,
  },

  nameDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  name: {
    flexGrow: 1,
    fontWeight: AppDimensions.fontBold
  },

  message: {
    color: AppColors.colorGray
  },

  date: {
    color: AppColors.colorGray,
    fontSize: AppDimensions.small
  }
});

const ChatItem = ({ onClick }: { onClick: ()=> void }) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.6} onPress={onClick}>
      <Image source={require('../assets/photos/user.png')} style={styles.iamge} />
      <View style={styles.body}>
        <View style={styles.nameDate}>
          <Text style={styles.name}>Dr. Price Ifeanyi</Text>
          <Text style={styles.date}>20 Feb 2022</Text>
        </View>
        <Text style={styles.message}>Hello, how are you</Text>
      </View>
    </TouchableOpacity>
  );
}

export default ChatItem;
