
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';
import { useErrorMessage } from '../hooks/errorHook';
import { useTherapistFetch } from '../hooks/userHook';
import User from '../models/User';
import Loading from './Loading';
import LoadingError from './LoadingError';
import UIButton from './UIButton';
import UIPhoto from './UIPhoto';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  box: {
    alignItems: 'center',
    padding: AppDimensions.small,
    backgroundColor: AppColors.colorSurface
  },

  heading: {
    fontSize: AppDimensions.large,
    fontWeight: AppDimensions.fontBold,
    marginBottom: AppDimensions.small
  },

  image: {
    width: 100, 
    height: 100,
    borderRadius: 50,
    marginBottom: AppDimensions.xSmall
  },

  name: {
    textAlign: 'center',
    fontSize: AppDimensions.medium,
    fontWeight: AppDimensions.fontBold
  }
});

const GetHelpContact = ({ onContactButtonClick }: { onContactButtonClick: (user: User, messagingListId: string | undefined)=> void }) => {

  const { t } = useTranslation();

  const errorMessage = useErrorMessage();

  const [
    load, 
    therapist, 
    messagingListId, 
    loading, 
    success, 
    error,
    retry
  ] = useTherapistFetch();

  useEffect(()=> load(), [load]);

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        {
          !success &&
          <Text style={styles.heading}>{ t('Fetching_therapist') }</Text>
        }

        {
          success && 
          <View>
             <UIPhoto photo={therapist?.photoURL as string} imageStyle={styles.image} />
            <Text style={styles.name}>{ therapist?.displayName }</Text>
            <UIButton 
              loading={false} 
              text={t('Contact_therapist')} 
              onClick={()=> onContactButtonClick(therapist as User, messagingListId)} 
              />
          </View>
        }

        {
          loading && <Loading />
        }

        {
          error !== null && 
          <LoadingError error={errorMessage(error ?? '')} onReloadPress={retry} />
        }
      </View>
    </View>
  );
}

export default GetHelpContact;
