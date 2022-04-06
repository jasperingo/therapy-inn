
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import validator from 'validator';
import AppColors from '../../assets/values/colors';
import AppDimensions from '../../assets/values/dimensions';
import UIButton from '../../components/UIButton';
import UITextInput from '../../components/UITextInput';
import { AuthTabParamList } from './AuthScreens';
import { useErrorMessage } from '../../hooks/errorHook';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUserSignIn } from '../../hooks/userHook';
import { useNetInfo } from '@react-native-community/netinfo';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: AppDimensions.large
  },

  note: {
    padding: AppDimensions.xSmall,
    fontWeight: AppDimensions.fontBold,
    borderRadius: AppDimensions.xSmall,
    marginVertical: AppDimensions.medium,
    backgroundColor: AppColors.colorSurface,
  }
});

const VerifyScreen = () => {

  const { t } = useTranslation();

  const errorMessage = useErrorMessage();

  const network = useNetInfo();

  const navigation = useNavigation<NativeStackNavigationProp<AuthTabParamList>>();

  const { params: { id, phoneNumber} } = useRoute<RouteProp<AuthTabParamList, 'Verify'>>();

  const [code, setCode] = useState('');

  const [codeError, setCodeError] = useState('');

  const  [
    onSubmit, 
    success, 
    loading, 
    error,
    resetStatus
  ] = useUserSignIn();

  useEffect(
    ()=> {
      
      if (success) {
        navigation.navigate('AddDetails');
        resetStatus();
      }

      if (error !== null) {
        alert(errorMessage(error));
        resetStatus();
      }

    },
    [success, error, navigation, errorMessage, resetStatus]
  );

  const submit = () => {

    if (validator.isEmpty(code) || !validator.isLength(code, { max: 6, min: 6 })) {
      setCodeError(t('_verification_code_invalid'));
    } else {
      setCodeError('');

      if (!network.isConnected) {
        alert(t('No_network_connection'));
        return;
      }

      onSubmit(id, code, phoneNumber);
    }
  }
  
  return (
    <View style={styles.container}>

      <Text style={styles.note}>
        { t('_verification_code_sent_to_your__phone_number', { number: phoneNumber })}
      </Text>

      <UITextInput 
        maxLength={6}
        disabled={loading}
        value={code}
        keyboardType='number-pad'
        error={codeError}
        label={t('Enter_verification_code')}
        placeholder={t('Eg__', { number: '663322' })}
        onChangeText={(value)=> setCode(value)}
        />

      <UIButton 
        text={t('Verify_phone_number')}
        loading={loading}
        onClick={submit}
        />

    </View>
  );
}

export default VerifyScreen;
