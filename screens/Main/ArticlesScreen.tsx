
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FloatingAction } from "react-native-floating-action";
import AppDimensions from '../../assets/values/dimensions';
import AppColors from '../../assets/values/colors';
import { useAuthUser } from '../../hooks/userHook';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ArticleItem from '../../components/ArticleItem';
import { useArticleFetch } from '../../hooks/articleHook';
import { useTranslation } from 'react-i18next';
import { useRenderListFooter } from '../../hooks/utilHook';
import Loading from '../../components/Loading';
import LoadingError from '../../components/LoadingError';
import LoadingEmpty from '../../components/LoadingEmpty';
import { useErrorMessage } from '../../hooks/errorHook';
import { RootStackParamList } from '../../App';


const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'relative',
  },

  list: {
    paddingTop: AppDimensions.small,
    marginBottom: AppDimensions.xSmall,
  }
});

const ArticlesScreen = () => {

  const user = useAuthUser();

  const { t } = useTranslation();
  
  const errorMessage = useErrorMessage();

  const renderFooter = useRenderListFooter();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Main'>>();

  const [
    fetch,
    list, 
    loading, 
    loaded,
    refreshing,
    error, 
    onRefresh,
    retryFetch
  ] = useArticleFetch();
  
  useEffect(
    ()=> {
      if (!loaded) fetch();
    },
    [loaded, fetch]
  );
  
  return (
    <View style={styles.container}>
      
      <FlatList 
        data={list}
        style={styles.list}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item })=> (
          <ArticleItem article={item} />
        )}
        keyExtractor={(item)=> String(item.id)}
        ListFooterComponent={renderFooter([
          {
            canRender: loading,
            render: ()=> <Loading />
          },
          {
            canRender: error !== null,
            render: ()=> <LoadingError error={errorMessage(error ?? '')} onReloadPress={retryFetch} />
          },
          {
            canRender: loaded && list.length === 0,
            render: ()=> <LoadingEmpty text={t('No_article_found')} />
          }
        ])}
        />

      {
        user !== null && 
        <FloatingAction
          actions={[{ 
            name: 'add_article',
            icon: <Ionicons name='add' size={30} color={AppColors.colorOnPrimary} style={{ textAlign: 'center' }} />
          }]}
          color={AppColors.colorPrimary}
          onPressItem={() => navigation.navigate('ArticleCreate')}
          overrideWithAction={true}
          />
      }
    </View>
  );
}

export default ArticlesScreen;
