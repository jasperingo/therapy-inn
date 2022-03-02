
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import validator from 'validator';
import NetInfo from '@react-native-community/netinfo';
import AppColors from '../../assets/values/colors';
import AppDimensions from '../../assets/values/dimensions';
import UIButton from '../../components/UIButton';
import UITextInput from '../../components/UITextInput';
import { useAuthUser } from '../../hooks/userHook';
import UserRepository from '../../repositories/UserRepository';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { FirebaseError } from 'firebase/app';
import { useErrorMessage } from '../../hooks/errorHook';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { User } from 'firebase/auth';

const styles = StyleSheet.create({
  container: {
    padding: AppDimensions.medium
  },

  imageBox: {
    alignItems: 'center',
    marginBottom: AppDimensions.xLarge
  },

  image: {
    width: 100, 
    height: 100,
    borderRadius: 50,
    marginBottom: AppDimensions.xSmall
  },

  imageButton: {
    padding: AppDimensions.xSmall,
    borderRadius: AppDimensions.xSmall,
    backgroundColor: AppColors.colorPrimary
  },

  imageButtonText: {
    color: AppColors.colorOnPrimary
  }
});

const AddDetailsScreen = () => {

  const { t } = useTranslation();

  const user = useAuthUser();

  const errorMessage = useErrorMessage();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Auth'>>();

  const [photo, setPhoto] = useState('');

  const [photoError, setPhotoError] = useState('');

  const [fullName, setFullName] = useState(user?.displayName ?? '');

  const [fullNameError, setFullNameError] = useState('');

  const [loading, setLoading] = useState(false);

  const [choosePhoto, setChoosePhoto] = useState(false);

  useEffect(
    ()=> {
      const storage = getStorage();
      getDownloadURL(ref(storage, (user as User).photoURL as string))
      .then(setPhoto)
      .catch(console.error);
    },
    [user]
  );

  const finishAuth = async () => {
    try {
      await UserRepository.create(fullName, photo, choosePhoto);
      setLoading(false);
      navigation.replace('Main', { screen: 'Articles' });
    } catch (error) {
      setLoading(false);
      if (error instanceof FirebaseError)
        alert(errorMessage(error.code));
      else 
        alert(errorMessage(''));
    }
  }

  const submit = () => {

    let error = false;

    if (validator.isEmpty(fullName)) {
      error = true;
      setFullNameError(t('This_field_is_required'));
    }

    if (validator.isEmpty(photo)) {
      error = true;
      setPhotoError(t('This_field_is_required'));
    }

    if (!error) {
      setPhotoError('');
      setFullNameError('');
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          alert(t('No_network_connection'));
        } else {
          setLoading(true);
          finishAuth();
        }
      });
    }
  }

  const pickPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    
    if (pickerResult.cancelled !== true) {
      setPhoto(pickerResult.uri);
      setChoosePhoto(true);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageBox}>
        <Image source={photo !== '' ? { uri: photo } : require('../../assets/photos/user.png')} style={styles.image} /> 
        <TouchableOpacity activeOpacity={0.7} style={styles.imageButton} onPress={pickPhoto}>
          <Text style={styles.imageButtonText}>{ t('Choose_photo') }</Text>
        </TouchableOpacity>
        {
          photoError !== '' && 
          <Text style={{ color: AppColors.colorError }}>{ photoError }</Text>
        }
      </View>
      
      <UITextInput
        value={fullName}
        disabled={loading}
        error={fullNameError}
        label={t('Full_name')}
        onChangeText={(value)=> setFullName(value)}
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
