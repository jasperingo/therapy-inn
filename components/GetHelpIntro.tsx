
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';
import UIButton from './UIButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  box: {
    padding: AppDimensions.small,
    backgroundColor: AppColors.colorSurface
  },

  heading: {
    fontSize: AppDimensions.large,
    fontWeight: AppDimensions.fontBold,
  },

  text: {
    fontSize: AppDimensions.medium,
    lineHeight: AppDimensions.xxLarge,
  }
});

const GetHelpIntro = ({ onAccept }: { onAccept: ()=> void }) => {

  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.heading}>Welcome to the Therapy inn&apos;s Get help</Text>
        <Text style={styles.text}>
          You have to take a quick survey which will help us determine the extent of your depression.
          With this, we can know if you need a therapist or self-help solutions.
        </Text>
        <UIButton text={t('Take_survey')} loading={false} onClick={onAccept} />
      </View>
    </View>
  );
}

export default GetHelpIntro;
