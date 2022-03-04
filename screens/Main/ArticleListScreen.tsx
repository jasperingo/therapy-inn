
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from "@react-native-community/netinfo";
import { FloatingAction } from "react-native-floating-action";
import AppDimensions from '../../assets/values/dimensions';
import AppColors from '../../assets/values/colors';
import { useAppAuthUser } from '../../hooks/userHook';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArticlesStackParamList } from './ArticlesScreen';
import ArticleItem from '../../components/ArticleItem';
import { useArticleFetch } from '../../hooks/articleHook';
import { useTranslation } from 'react-i18next';
import { useRenderListFooter } from '../../hooks/utilHook';
import Loading from '../../components/Loading';
import LoadingError from '../../components/LoadingError';
import LoadingEmpty from '../../components/LoadingEmpty';
import { useErrorMessage } from '../../hooks/errorHook';
import ERRORS from '../../assets/values/errors';

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

const ArticleListScreen = () => {

  const user = useAppAuthUser();

  const { t } = useTranslation();
  
  const errorMessage = useErrorMessage();

  const renderFooter = useRenderListFooter();

  const navigation = useNavigation<NativeStackNavigationProp<ArticlesStackParamList>>();

  const [started, setStarted] = useState(false);

  const [screenError, setScreenError] = useState<string | null>(null);

  const [
    fetch,
    list, 
    loading, 
    page,
    refreshing,
    error, 
    onRefresh
  ] = useArticleFetch();

  const getArticles = useCallback(
    async () => {
      try {
        const state = await NetInfo.fetch();

        if (!state.isConnected) {
          setScreenError(ERRORS.noInternetConnection);
        } else {
          fetch();
          setScreenError(null);
        }
      } catch {
        setScreenError(ERRORS.unknown);
      }
    },
    [fetch]
  );
  
  const refreshArticles = useCallback(
    async () => {
      try {
        const state = await NetInfo.fetch();

        if (!state.isConnected) {
          alert(t('No_network_connection'));
        } else {
          onRefresh();
        }
      } catch {
        alert(t('_unknown_error_occured'))
      }
    },
    [onRefresh, t]
  );
  
  useEffect(
    ()=> {
      if (!started) {
        setStarted(true);
        getArticles();
      }
    },
    [started, getArticles]
  );
  
  const getScreenError = ()=> error || screenError;
  
  return (
    <View style={styles.container}>
      
      <FlatList 
        data={list}
        style={styles.list}
        refreshing={refreshing}
        onRefresh={refreshArticles}
        renderItem={({ item })=> (
          <ArticleItem article={item} />
        )}
        keyExtractor={(item)=> String(item.id)}
        onEndReached={getArticles}
        ListFooterComponent={renderFooter([
          {
            canRender: loading,
            render: ()=> <Loading />
          },
          {
            canRender: getScreenError() !== null,
            render: ()=> <LoadingError error={errorMessage(getScreenError() ?? '')} onReloadPress={getArticles} />
          },
          {
            canRender: page > -1 && list.length === 0,
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

export default ArticleListScreen;
