
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: AppDimensions.small,
    marginHorizontal: AppDimensions.small,
  },

  outContainer: {
    justifyContent: 'flex-end',
  },

  box: {
    borderWidth: 1,
    maxWidth: '70%',
    padding: AppDimensions.xSmall,
    borderColor: AppColors.colorGray,
    borderRadius: AppDimensions.xSmall,
    backgroundColor: AppColors.colorSurface
  },

  outBox: { 
    borderColor: AppColors.colorPrimary
  },

  bottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },

  status: {
    fontSize: AppDimensions.medium,
    marginRight: AppDimensions.xSmall
  },

  date: {
    color: AppColors.colorGray
  }
});

const MessageItem = ({ num }: { num: number }) => {
  return (
    <View style={[styles.container, num % 2 === 0 ? styles.outContainer : null]}>
      <View style={[styles.box, num % 2 === 0 ? styles.outBox : null]}>
        <Text>MessageItem</Text>
        <View style={styles.bottom}>
          <Ionicons name='checkmark' color={AppColors.colorError} style={styles.status} />
          <Text style={styles.date}>23 April 2022</Text>
        </View>
      </View>
    </View>
  );
}

export default MessageItem;
