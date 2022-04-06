
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { RootStackParamList } from '../../App';
import AppDimensions from '../../assets/values/dimensions';
import AuthNow from '../../components/AuthNow';
import ChatItem from '../../components/ChatItem';
import { useChatList, useChatReadUpdate } from '../../hooks/chatHook';
import { useErrorMessage } from '../../hooks/errorHook';
import { useAuthUser } from '../../hooks/userHook';
import { useRenderListFooter } from '../../hooks/utilHook';
import Loading from '../../components/Loading';
import LoadingError from '../../components/LoadingError';
import LoadingEmpty from '../../components/LoadingEmpty';
import ERRORS from '../../assets/values/errors';
import { useNetInfo } from '@react-native-community/netinfo';

const styles = StyleSheet.create({

  list: {
    paddingTop: AppDimensions.small,
    marginBottom: AppDimensions.xSmall,
  }
});

const ChatsScreen = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Main'>>();

  const user = useAuthUser();
  
  const { t } = useTranslation();
  
  const errorMessage = useErrorMessage();

  const renderFooter = useRenderListFooter();

  const chatReadUpdater = useChatReadUpdate();

  const network = useNetInfo();

  const [
    fetchChats,
    fetchNewChats,
    fetchUpdatedChats,
    setError,
    list, 
    loading, 
    loaded,
    refreshing,
    error, 
    retryFetch,
    onRefresh
  ] = useChatList();

  useEffect(
    ()=> {
      if (user !== null && !network.isConnected && !loaded && error === null)
        setError(ERRORS.noInternetConnection);
      else if (user !== null && network.isConnected && !loaded && !loading) 
        fetchChats(user.id);
    },
    [user, network.isConnected, loaded, loading, error, fetchChats, setError]
  );
  
  useEffect(
    ()=> {
      if (user === null || !loaded) return;
      
      const unsubscribeNew = fetchNewChats(user.id);
      const unsubscribeUpdate = fetchUpdatedChats(user.id);

      return ()=> {
        unsubscribeNew();
        unsubscribeUpdate();
      }
    },
    [user, loaded, fetchNewChats, fetchUpdatedChats]
  );
  
  if (user === null) {
    return <AuthNow onClick={()=> navigation.navigate('Auth', { screen: 'PhoneNumber' })} />;
  }
  
  return (
    <View>
      
      <FlatList 
        data={list}
        style={styles.list}
        refreshing={refreshing}
        onRefresh={onRefresh}
        keyExtractor={(item)=> String(item.id)}
        renderItem={({ item })=> (
          <ChatItem 
            chat={item}
            onClick={()=> {
              if (!item.read)
                chatReadUpdater(item, user.id);

              navigation.navigate(
                'Messages', 
                { 
                  name: item.recipientDisplayName, 
                  phoneNumber: item.recipientPhoneNumber,
                  messagingListId: item.id as string,
                  recipientId: item.recipientId
                }
              );
            }}
            />
        )}
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
            render: ()=> <LoadingEmpty text={t('No_chat_found')} />
          }
        ])}
        />

    </View>
  );
}

export default ChatsScreen;
