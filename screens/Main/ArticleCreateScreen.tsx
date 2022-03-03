
import React from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import AppDimensions from '../../assets/values/dimensions';
import UIButton from '../../components/UIButton';
import UITextInput from '../../components/UITextInput';
import UIPhotoPicker, { PhotoDefaultTypes } from '../../components/UIPhotoPicker';

const styles = StyleSheet.create({
  container: {
    padding: AppDimensions.small
  },

  image: {
    width: '100%',
    height: 200
  }
});

const ArticleCreateScreen = () => {

  const { t } = useTranslation();

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
      <View>
      
        <UIPhotoPicker 
          photo='' 
          error='' 
          loading={false} 
          onPhotoPicked={()=> 2} 
          imageStyle={styles.image}
          defaultPhoto={PhotoDefaultTypes.ARTICLE}
          />

        <UITextInput 
          label={t('Title')}
          onChangeText={()=> 1}
          value=""
          />

        <UITextInput 
          label={t('Link_to_article')}
          onChangeText={()=> 1}
          value=""
          keyboardType='url'
          />

        <UIButton
          loading={false}
          onClick={()=> 1}
          text={t('Create')}
          />

      </View>
    </KeyboardAvoidingView>
  );
}

export default ArticleCreateScreen;
