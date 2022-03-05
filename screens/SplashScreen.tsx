
import * as NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../App';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';
import ERRORS from '../assets/values/errors';
import Loading from '../components/Loading';
import LoadingError from '../components/LoadingError';
import { useErrorMessage } from '../hooks/errorHook';
import { useAuthUserFetch } from '../hooks/userHook';

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: AppColors.colorPrimary,
  },

  appName: {
    fontSize: 40,
    color: AppColors.colorOnPrimary,
    fontWeight: AppDimensions.fontBold
  },

  success: {
    fontSize: AppDimensions.large,
    color: AppColors.colorOnPrimary
  }

});

const SplashScreen = () => {

  const { t } = useTranslation();

  const errorMessage = useErrorMessage();

  const [retry, setRetry] = useState(0);

  const [screenError, setScreenError] = useState<string | null>(null);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Splash'>>();

  const [fetch, loading, success, error] = useAuthUserFetch();


  useEffect(
    () => {
      (async ()=> {
        try {

          const state = await NetInfo.fetch();

          if (!state.isConnected) {
            setScreenError(ERRORS.noInternetConnection);
          } else {
            fetch();
            setScreenError(null);
          }
        } catch {
          setScreenError(ERRORS.unknown);
        }
      })();
    }, 
    [retry, fetch]
  );

  useEffect(
    ()=> {
      if (success) 
        navigation.replace('Main', { screen: 'Articles' });
    },
    [success, navigation]
  );
  
  const getError = ()=> error || screenError;

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>{ t('App_name') }</Text>
      {
        loading &&
        <Loading color={AppColors.colorOnPrimary} />
      }
      {
        getError() !== null &&
        <LoadingError error={errorMessage(getError() ?? '')} onReloadPress={()=> setRetry(retry+1)} />
      }
      {
        success && 
        <Text style={styles.success}>{ t('All_set_let_s_go') }</Text>
      }
    </View>
  );
}

export default SplashScreen;
