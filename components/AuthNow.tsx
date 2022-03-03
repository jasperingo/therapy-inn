
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';
import UIButton from './UIButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: AppDimensions.large
  },
  
  box: {
    padding: AppDimensions.small,
    backgroundColor: AppColors.colorSurface
  },

  header: {
    color: AppColors.colorPrimary,
    fontSize: AppDimensions.medium,
    marginBottom: AppDimensions.small,
    fontWeight: AppDimensions.fontBold
  },

  body: {
    fontSize: AppDimensions.medium
  }
});

const AuthNow = ({ onClick }: { onClick: ()=> void }) => {

  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.header}>{ t('_welcome') }</Text>
        <Text style={styles.body}>{ t('_sign_in_now') }</Text>
        <UIButton 
          loading={false}
          text={t('Sign_in')}
          onClick={onClick}
          />
      </View>
    </View>
  );
}

export default AuthNow;
