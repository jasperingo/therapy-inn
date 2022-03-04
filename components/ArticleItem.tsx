
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';
import { useArticleDelete } from '../hooks/articleHook';
import { useErrorMessage } from '../hooks/errorHook';
import { usePhotoDownloadURL } from '../hooks/photoHook';
import { useAuthUser } from '../hooks/userHook';
import Article from '../models/Article';

const styles = StyleSheet.create({
  container: {
    borderRadius: AppDimensions.xSmall,
    marginVertical: AppDimensions.small,
    marginHorizontal: AppDimensions.small,
    backgroundColor: AppColors.colorSurface
  },

  photo: {
    height: 200,
    width: '100%',
  },

  title: {
    padding: AppDimensions.small,
    fontSize: AppDimensions.xLarge,
    fontWeight: AppDimensions.fontBold,
  },

  linkBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: AppDimensions.small,
    paddingHorizontal: AppDimensions.small,
  },

  link: {
    borderWidth: 1,
    borderRadius: AppDimensions.large,
    padding: AppDimensions.xSmall,
    borderColor: AppColors.colorLink,
    color: AppColors.colorLink,
  }
});

const ArticleItem = ({ article }: { article: Article }) => {

  const { t } = useTranslation();

  const user = useAuthUser();
  
  const errorMessage = useErrorMessage();

  const getPhotoURL = usePhotoDownloadURL();

  const [photo, setPhoto] = useState('');

  const [onSubmit, loading, error] = useArticleDelete();

  useEffect(
    ()=> {
      (async ()=> {
        if (photo !== '') return;
        try {
          setPhoto(await getPhotoURL(article.photoURL));
        } catch(error) {
          console.log(error);
        }
      })();
    },
    [article.photoURL, photo, getPhotoURL]
  );

  useEffect(
    () => {
      if (error !== null) {
        alert(errorMessage(error));
      }
    },
    [error, errorMessage]
  );
  
  const confirmDelete = () => {
    Alert.alert(
      t('Confirm'),
      t('_confirm_delete_article'),
      [
        {
          text: t('No'),
          style: "cancel"
        },
        { 
          text: t('Yes'), 
          onPress: ()=> onSubmit(article)
        }
      ]
    );
  }
  
  return (
    <View style={styles.container}>
      <Image source={{ uri: photo || article.photoURL }} style={styles.photo} />
      <Text style={styles.title}>{ article.title }</Text>
      <View style={styles.linkBox}>
        <TouchableOpacity activeOpacity={0.6} onPress={()=> Linking.openURL(article.link)}>
          <Text style={styles.link}>{ t('Read_article') }</Text>
        </TouchableOpacity>
        {
          user?.uid === article.userId &&
          <TouchableOpacity activeOpacity={0.6} onPress={confirmDelete}>
            { 
              loading ?
              <ActivityIndicator color={AppColors.colorPrimary} size="small" />
              :
              <Ionicons name='trash-bin' size={AppDimensions.large} color={AppColors.colorError} />
            }
          </TouchableOpacity>
        }
      </View>
    </View>
  );
}

export default ArticleItem;
