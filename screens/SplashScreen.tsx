
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
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

  nameIconContainer: {
    alignItems: 'center'
  },

  appName: {
    fontSize: 40,
    color: AppColors.colorOnPrimary,
    fontFamily: 'SecularOne-Regular'
  },

  appIcon: {
    fontSize: 80,
    color: AppColors.colorOnPrimary
  },

  success: {
    fontSize: AppDimensions.large,
    color: AppColors.colorOnPrimary
  }

});

const SplashScreen = () => {

  const { t } = useTranslation();

  const errorMessage = useErrorMessage();

  const network = useNetInfo();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Splash'>>();

  const [fetchUser, setError, loading, success, error, retryFetch] = useAuthUserFetch();

  useEffect(
    () => {
      if (success) return;

      if (!network.isConnected && error === null)
        setError(ERRORS.noInternetConnection);
      else if (network.isConnected && !loading)
        fetchUser();
    }, 
    [success, loading, error, network.isConnected, fetchUser, setError]
  );

  useEffect(
    ()=> {
      if (success) 
        navigation.replace('Main', { screen: 'Articles' });
    },
    [success, navigation]
  );

  return (
    <View style={styles.container}>
      <View style={styles.nameIconContainer}>
        <Ionicons name="medkit-outline" style={styles.appIcon} />
        <Text style={styles.appName}>{ t('App_name') }</Text>
      </View>
      {
        loading &&
        <Loading color={AppColors.colorOnPrimary} />
      }
      {
        error !== null &&
        <LoadingError error={errorMessage(error ?? '')} onReloadPress={retryFetch} />
      }
      {
        success && 
        <Text style={styles.success}>{ t('All_set_let_s_go') }</Text>
      }
    </View>
  );
}

export default SplashScreen;
