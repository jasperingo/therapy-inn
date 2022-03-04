
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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

  name: {
    fontWeight: AppDimensions.fontBold
  },

  lastMessage: {
    color: AppColors.colorGray
  }
});

const ChatItem = () => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.6} onPress={()=> alert('Chat')}>
      <Image source={require('../assets/photos/user.png')} style={styles.iamge} />
      <View>
        <Text style={styles.name}>Dr. Price Ifeanyi</Text>
        <Text style={styles.lastMessage}>Hello, how are you</Text>
      </View>
    </TouchableOpacity>
  );
}

export default ChatItem;
