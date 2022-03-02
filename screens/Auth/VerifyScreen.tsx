
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import validator from 'validator';
import NetInfo from '@react-native-community/netinfo';
import AppColors from '../../assets/values/colors';
import AppDimensions from '../../assets/values/dimensions';
import UIButton from '../../components/UIButton';
import UITextInput from '../../components/UITextInput';
import { AuthTabParamList } from './AuthScreens';
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import firebaseApp from '../../repositories/firebase.config';
import { FirebaseError } from 'firebase/app';
import { useErrorMessage } from '../../hooks/errorHook';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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

  const navigation = useNavigation<NativeStackNavigationProp<AuthTabParamList>>();

  const { params: { id, phoneNumber} } = useRoute<RouteProp<AuthTabParamList, 'Verify'>>();

  const [loading, setLoading] = useState(false);

  const [code, setCode] = useState('');

  const [codeError, setCodeError] = useState('');

  const auth = useMemo(()=> getAuth(firebaseApp), []);

  const signIn = async () => {
    try {
      const credential = PhoneAuthProvider.credential(id, code);
      await signInWithCredential(auth, credential);
      setLoading(false);
      navigation.navigate('AddDetails');
    } catch (error) {
      setLoading(false);
      if (error instanceof FirebaseError)
        setCodeError(errorMessage(error.code));
      else 
        setCodeError(errorMessage(''));
    }
  }

  const submit = () => {

    if (validator.isEmpty(code) || !validator.isLength(code, { max: 6, min: 6 })) {
      setCodeError(t('_verification_code_invalid'));
    } else {
      setCodeError('');
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          alert(t('No_network_connection'));
        } else {
          setLoading(true);
          signIn();
        }
      });
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
        placeholder={t('Eg__', { number: '394939' })}
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
