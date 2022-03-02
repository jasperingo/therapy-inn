
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AppColors from '../../assets/values/colors';
import AppDimensions from '../../assets/values/dimensions';
import UIButton from '../../components/UIButton';
import UITextInput from '../../components/UITextInput';
import { useAuthUser } from '../../hooks/userHook';

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

  const [photo, setPhoto] = useState(user?.photoURL ?? '');

  const [fullName, setFullName] = useState(user?.displayName ?? '');

  const [fullNameError, ] = useState('');

  const submit = () => {
    alert('Submitting');
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
    }

  }

  return (
    <View style={styles.container}>
      <View style={styles.imageBox}>
        <Image source={photo !== '' ? { uri: photo } : require('../../assets/photos/user.png')} style={styles.image} /> 
        <TouchableOpacity activeOpacity={0.7} style={styles.imageButton} onPress={pickPhoto}>
          <Text style={styles.imageButtonText}>Pick photo</Text>
        </TouchableOpacity>
      </View>
      
      <UITextInput 
        value={fullName}
        error={fullNameError}
        label={t('Full_name')}
        onChangeText={(value)=> setFullName(value)}
        />

      <UIButton 
        text={t('Continue')}
        loading={false}
        onClick={submit}
        />

    </View>
  );
}

export default AddDetailsScreen;
