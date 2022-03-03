
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';

const styles = StyleSheet.create({
  container: {
    borderRadius: AppDimensions.xSmall,
    marginVertical: AppDimensions.small,
    marginHorizontal: AppDimensions.small,
    backgroundColor: AppColors.colorSurface
  },

  photo: {
    width: '100%',
    height: 200
  },

  title: {
    padding: AppDimensions.small,
    fontSize: AppDimensions.xLarge,
    fontWeight: AppDimensions.fontBold,
  },

  linkBox: {
    flex: 1,
    alignItems: 'flex-start',
    paddingBottom: AppDimensions.small,
    paddingHorizontal: AppDimensions.small,
  },

  link: {
    borderWidth: 1,
    borderRadius: AppDimensions.large,
    padding: AppDimensions.xSmall,
    borderColor: AppColors.colorLink,
    color: AppColors.colorLink,
  }
});

const ArticleItem = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/photos/user.png')} style={styles.photo} />
      <Text style={styles.title}>ArticleItem</Text>
      <View style={styles.linkBox}>
        <Text style={styles.link}>Read Article</Text>
      </View>
    </View>
  );
}

export default ArticleItem;
