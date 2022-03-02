
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { ApplicationVerifier, getAuth, PhoneAuthProvider } from "firebase/auth";
import NetInfo from '@react-native-community/netinfo';
import validator from 'validator';
import AppDimensions from '../../assets/values/dimensions';
import UIButton from '../../components/UIButton';
import UITextInput from '../../components/UITextInput';
import firebaseApp from '../../repositories/firebase.config';
import { FirebaseError } from 'firebase/app';
import { useErrorMessage } from '../../hooks/errorHook';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthTabParamList } from './AuthScreens';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: AppDimensions.large
  }
});

const PhoneNumberScreen = () => {

  const { t } = useTranslation();

  const errorMessage = useErrorMessage();

  const navigation = useNavigation<NativeStackNavigationProp<AuthTabParamList>>();

  const [loading, setLoading] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');

  const [phoneNumberError, setPhoneNumberError] = useState('');

  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal | null>(null);

  const auth = useMemo(()=> getAuth(firebaseApp), []);


  const sendPhoneNumberVerification = async () => {
    
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const id = await phoneProvider.verifyPhoneNumber(
        `+234${phoneNumber.substring(1)}`,
        recaptchaVerifier.current as ApplicationVerifier
      );
      
      setLoading(false);
      navigation.navigate('Verify', { id, phoneNumber });

    } catch (error) {
      setLoading(false);
      if (error instanceof FirebaseError)
        setPhoneNumberError(errorMessage(error.code));
      else 
        setPhoneNumberError(errorMessage(''));
    }
  }

  const submit = () => {
    if (validator.isEmpty(phoneNumber)) {
      setPhoneNumberError(t('_phone_number_required'));
    } else if (!validator.isMobilePhone(phoneNumber, 'en-NG')) {
      setPhoneNumberError(t('_phone_number_invalid'));
    } else {
      setPhoneNumberError('');
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          alert(t('No_network_connection'));
        } else {
          setLoading(true);
          sendPhoneNumberVerification();
        }
      });
    }
  }

  return (
    <View style={styles.container}>

      <UITextInput 
        maxLength={11}
        disabled={loading}
        value={phoneNumber}
        keyboardType='phone-pad'
        error={phoneNumberError}
        label={t('Enter_your_phone_number')}
        placeholder={t('Eg__', { number: '0903-057-2411' })}
        onChangeText={(value)=> setPhoneNumber(value)}
        />

      <UIButton 
        text={t('Continue')}
        loading={loading}
        onClick={submit}
        />

      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseApp.options}
        />

    </View>
  );
}

export default PhoneNumberScreen;
