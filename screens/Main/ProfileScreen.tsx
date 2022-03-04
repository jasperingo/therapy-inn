
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../App';
import AppColors from '../../assets/values/colors';
import AppDimensions from '../../assets/values/dimensions';
import AuthNow from '../../components/AuthNow';
import UIButton from '../../components/UIButton';
import UIPhoto from '../../components/UIPhoto';
import { useErrorMessage } from '../../hooks/errorHook';
import { useAppAuthUser, useUserSignOut } from '../../hooks/userHook';
import User from '../../models/User';

const styles = StyleSheet.create({
  container: {
    padding: AppDimensions.medium
  },

  image: {
    width: 100, 
    height: 100,
    borderRadius: 50,
    marginBottom: AppDimensions.xSmall
  },

  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: AppDimensions.xSmall,
    marginBottom: AppDimensions.small,
    backgroundColor: AppColors.colorSurface
  },

  icon: {
    marginRight: AppDimensions.xSmall
  }
});

const Detail = ({ data, icon }: { data: string; icon: string }) => {
  return (
    <View style={styles.detail}>
      <Ionicons 
        name={icon} 
        style={styles.icon} 
        size={AppDimensions.xxLarge} 
        color={AppColors.colorPrimary} 
        />
      <Text>{ data }</Text>
    </View>
  );
}

const ProfileScreen = () => {

  const { t } = useTranslation();

  const errorMessage = useErrorMessage();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Main'>>();

  const user = useAppAuthUser() as User;

  const [
    onSignOut, 
    signOutSuccess, 
    signOutLoading, 
    signOutError, 
    resetStatus
  ] = useUserSignOut();

  useEffect(
    ()=> {
      
      if (signOutSuccess) {
        navigation.navigate('Main', { screen: 'Articles' });
      }

      if (signOutError !== null) {
        alert(errorMessage(signOutError));
      }
      
      resetStatus();
    },
    [signOutSuccess, signOutError, navigation, resetStatus, errorMessage]
  );
  
  const onSignOutClicked = () => {
    Alert.alert(
      t('Confirm'),
      t('_confirm_sign_out'),
      [
        {
          text: t('No'),
          style: "cancel"
        },
        { 
          text: t('Yes'), 
          onPress: onSignOut
        }
      ]
    );
  }

  if (user === null) {
    return <AuthNow onClick={()=> navigation.navigate('Auth', { screen: 'PhoneNumber' })} />;
  }
  
  return (
    <View style={styles.container}>
      <UIPhoto photo={user.photoURL} imageStyle={styles.image} />
      <Detail data={user.displayName} icon='person' />
      <Detail data={user.phoneNumber} icon='call' />
      {
        user.therapist && 
        <Detail data={t('I_m_a_therapist')} icon='medkit' />
      }

      <UIButton 
        danger={true}
        text={t('Sign_out')}
        loading={signOutLoading}
        onClick={onSignOutClicked}
        />
      
    </View>
  );
}

export default ProfileScreen;
