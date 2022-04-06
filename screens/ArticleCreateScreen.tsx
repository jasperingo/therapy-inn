
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import validator from 'validator';
import AppDimensions from '../assets/values/dimensions';
import UIButton from '../components/UIButton';
import UITextInput from '../components/UITextInput';
import UIPhotoPicker, { PhotoDefaultTypes } from '../components/UIPhotoPicker';
import { useArticleCreate } from '../hooks/articleHook';
import { usePhotoURIToBlob } from '../hooks/photoHook';
import { useErrorMessage } from '../hooks/errorHook';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useNetInfo } from '@react-native-community/netinfo';

const styles = StyleSheet.create({
  container: {
    padding: AppDimensions.small,
    marginBottom: AppDimensions.xSmall
  },

  image: {
    width: '100%',
    height: 200
  }
});

const ArticleCreateScreen = () => {

  const { t } = useTranslation();

  const photoURIToBlob = usePhotoURIToBlob();

  const errorMessage = useErrorMessage();

  const network = useNetInfo();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'ArticleCreate'>>();

  const [title, setTitle] = useState('');

  const [titleError, setTitleError] = useState('');

  const [link, setLink] = useState('');

  const [linkError, setLinkError] = useState('');

  const [photo, setPhoto] = useState<Blob | null>(null);

  const [photoError, setPhotoError] = useState('');

  const [
    onSubmit, 
    success, 
    loading, 
    error, 
    resetStatus
  ] = useArticleCreate();

  useEffect(
    ()=> {
      
      if (success) {
        navigation.navigate('Main', { screen: 'Articles' });
        resetStatus();
      }

      if (error !== null) {
        alert(errorMessage(error));
        resetStatus();
      }

    },
    [success, error, navigation, resetStatus, errorMessage]
  );
  
  const onSubmitClicked = () => {
    
    let error = false;

    if (validator.isEmpty(title)) {
      error = true;
      setTitleError(t('This_field_is_required'));
    } else {
      setTitleError('');
    }

    if (validator.isEmpty(link) || !validator.isURL(link, { protocols: ['https', 'http'], require_protocol: true })) {
      error = true;
      setLinkError(t('This_field_is_required'));
    } else {
      setLinkError('');
    }

    if (photo === null) {
      error = true;
      setPhotoError(t('This_field_is_required'));
    } else {
      setPhotoError('');
    }

    if (error) return;

    if (!network.isConnected) {
      alert(t('No_network_connection'));
      return;
    }

    onSubmit(title, link, photo as Blob);
  }

  const onPickPhoto = async (result: string) => {
    try {
      setPhoto(await photoURIToBlob(result));
    } catch {
      alert(t('_error_while_converting_photo'));
    }
  }

  return (
    <KeyboardAvoidingView 
      keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 100}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
      <ScrollView style={styles.container}>
      
        <UIPhotoPicker 
          photo=''
          error={photoError}
          loading={loading} 
          imageStyle={styles.image}
          onPhotoPicked={onPickPhoto} 
          defaultPhoto={PhotoDefaultTypes.ARTICLE}
          />

        <UITextInput 
          value={title}
          disabled={loading}
          label={t('Title')}
          error={titleError}
          onChangeText={(value)=> setTitle(value)}
          />

        <UITextInput 
          value={link}
          error={linkError}
          keyboardType='url'
          disabled={loading}
          label={t('Link_to_article')}
          onChangeText={(value)=> setLink(value)}
          />

        <UIButton
          loading={loading}
          text={t('Create')}
          onClick={onSubmitClicked}
          />

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default ArticleCreateScreen;
