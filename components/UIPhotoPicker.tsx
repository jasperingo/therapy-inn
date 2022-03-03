
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ImageStyle, StyleProp, StyleSheet, Text, View } from 'react-native';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';
import { usePhotoDownloadURL, usePickPhoto } from '../hooks/photoHook';
import UIButton from './UIButton';

const styles = StyleSheet.create({
  container: {
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

export enum PhotoDefaultTypes {
  USER = 'USER',
  ARTICLE = 'ARTICLE'
}

interface Props {
  photo: string;
  error: string;
  loading: boolean;
  defaultPhoto: PhotoDefaultTypes;
  imageStyle?: StyleProp<ImageStyle>;
  onPhotoPicked: (imageResult: string)=> void
}

const UIPhotoPicker = ({ photo, error, loading, defaultPhoto, imageStyle = styles.image, onPhotoPicked }: Props) => {

  const { t } = useTranslation();

  const photoPicker = usePickPhoto();

  const getPhotoURL = usePhotoDownloadURL();

  const [pic, setPic] = useState('');

  useEffect(
    ()=> {
      (async ()=> {
        if (pic !== '' || photo === '') return;
        try {
          const response = await getPhotoURL(photo);
          setPic(response);
        } catch {
          alert(t('_error_while_loading_photo'));
        }
      })();
    },
    [photo, pic, getPhotoURL, t]
  );
  
  const pickPhoto = async () => {
   
    try {
      const response = await photoPicker();
      
      if (response === false) {
        alert(t('_photo_permission_not_granted'));
      } else if (response.cancelled !== true) {
        setPic(response.uri);
        onPhotoPicked(response.uri);
      }
    } catch {
      alert(t('_error_while_picking_photo'));
    }
  }

  const getDefaultPhoto = () => {
    switch(defaultPhoto) {
      case PhotoDefaultTypes.ARTICLE:
        return require('../assets/photos/depressed-article.jpg');
      default:
        return require('../assets/photos/user.png');
    }
  }

  return (
    <View style={styles.container}>
      <Image 
        style={imageStyle} 
        source={pic !== '' ? { uri: pic } : getDefaultPhoto()} 
        /> 
      <UIButton
        text={t('Choose_photo')}
        loading={loading}
        onClick={pickPhoto}
      />
      {
        error !== '' && 
        <Text style={{ color: AppColors.colorError }}>{ error }</Text>
      }
    </View>
  );
}

export default UIPhotoPicker;
