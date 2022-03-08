
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import validator from 'validator';
import NetInfo from '@react-native-community/netinfo';
import AppDimensions from '../../assets/values/dimensions';
import UIButton from '../../components/UIButton';
import UITextInput from '../../components/UITextInput';
import { useAuthUser, useUserUpdate } from '../../hooks/userHook';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useErrorMessage } from '../../hooks/errorHook';
import UIPhotoPicker, { PhotoDefaultTypes } from '../../components/UIPhotoPicker';
import { usePhotoURIToBlob, usePhotoURLMaker } from '../../hooks/photoHook';
import UICheckBox from '../../components/UICheckBox';

const styles = StyleSheet.create({
  container: {
    padding: AppDimensions.medium
  }
});

const AddDetailsScreen = () => {

  const { t } = useTranslation();

  const user = useAuthUser();

  const errorMessage = useErrorMessage();

  const photoURIToBlob = usePhotoURIToBlob();

  const photoURLMaker = usePhotoURLMaker('users');

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Auth'>>();

  const [photo, setPhoto] = useState(user?.photoURL ?? '');

  const [photoError, setPhotoError] = useState('');

  const [fullName, setFullName] = useState(user?.displayName ?? '');

  const [fullNameError, setFullNameError] = useState('');

  const [therapist, setTherapist] = useState(user?.therapist ?? false);

  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);

  const [onSubmit, success, loading, error, resetStatus] = useUserUpdate();
  
  useEffect(
    ()=> {
      
      if (success) {
        navigation.replace('Main', { screen: 'Articles' });
      }

      if (error !== null) {
        alert(errorMessage(error));
        resetStatus();
      }
    },
    [success, error, navigation, resetStatus, errorMessage]
  );

  const submit = () => {

    let error = false;

    if (validator.isEmpty(fullName)) {
      error = true;
      setFullNameError(t('This_field_is_required'));
    } else {
      setFullNameError('');
    }

    if (validator.isEmpty(photo)) {
      error = true;
      setPhotoError(t('This_field_is_required'));
    } else {
      setPhotoError('');
    }

    if (!error) {
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          alert(t('No_network_connection'));
        } else {
          onSubmit(fullName, photo, therapist, photoBlob);
        }
      });
    }
  }

  const onPickPhoto = async (result: string) => {
    try {
      const blob = await photoURIToBlob(result);
      setPhotoBlob(blob);
      const url = photoURLMaker(user?.id as string, blob.type);
      setPhoto(url);
    } catch {
      alert(t('_error_while_converting_photo'));
    }
  }

  return (
    <View style={styles.container}>
      
      <UIPhotoPicker 
        photo={photo} 
        loading={loading}
        error={photoError}
        onPhotoPicked={onPickPhoto} 
        defaultPhoto={PhotoDefaultTypes.USER}
        />
      
      <UITextInput
        value={fullName}
        disabled={loading}
        error={fullNameError}
        label={t('Full_name')}
        onChangeText={(value)=> setFullName(value)}
        />

      <UICheckBox 
        checked={therapist}
        label={t('I_m_a_therapist')}
        onClick={()=> setTherapist(!therapist)}
        />

      <UIButton
        text={t('Continue')}
        loading={loading}
        onClick={submit}
        />

    </View>
  );
}

export default AddDetailsScreen;
