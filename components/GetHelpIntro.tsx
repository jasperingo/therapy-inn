
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
    padding: AppDimensions.xSmall,
    backgroundColor: AppColors.colorSurface
  },

  text: {
    fontSize: AppDimensions.large,
    lineHeight: AppDimensions.xxLarge,
  }
});

const GetHelpIntro = ({ onAccept }: { onAccept: ()=> void }) => {

  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.text}>
          Welcome to the Therapy inn&apos;s Get help. Here, you can get a 
          therapist to attend to you by taking a 
          quick survey which will help us determine the extent of your depression.
        </Text>
        <UIButton text={t('Take_survey')} loading={false} onClick={onAccept} />
      </View>
    </View>
  );
}

export default GetHelpIntro;
