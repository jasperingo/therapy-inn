
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ImageStyle, StyleProp, StyleSheet, View } from 'react-native'
import AppDimensions from '../assets/values/dimensions';
import { usePhotoDownloadURL } from '../hooks/photoHook';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: AppDimensions.medium
  },
});

interface Props {
  photo: string;
  imageStyle?: StyleProp<ImageStyle>;
}

const UIPhoto = ({ photo, imageStyle }: Props) => {

  const { t } = useTranslation();

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

  return (
    <View style={styles.container}>
       <Image 
        style={imageStyle} 
        source={pic !== '' ? { uri: pic } : require('../assets/photos/user.png')} 
        /> 
    </View>
  );
}

export default UIPhoto;
