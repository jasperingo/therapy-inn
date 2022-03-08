
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NetInfo from "@react-native-community/netinfo";
import { FlatList, StyleSheet, View } from 'react-native';
import { RootStackParamList } from '../../App';
import AppDimensions from '../../assets/values/dimensions';
import ERRORS from '../../assets/values/errors';
import AuthNow from '../../components/AuthNow';
import ChatItem from '../../components/ChatItem';
import { useChatList, useChatReadUpdate } from '../../hooks/chatHook';
import { useErrorMessage } from '../../hooks/errorHook';
import { useAppAuthUser } from '../../hooks/userHook';
import { useRenderListFooter } from '../../hooks/utilHook';
import Loading from '../../components/Loading';
import LoadingError from '../../components/LoadingError';
import LoadingEmpty from '../../components/LoadingEmpty';

const styles = StyleSheet.create({

  list: {
    paddingTop: AppDimensions.small,
    marginBottom: AppDimensions.xSmall,
  }
});

const ChatsScreen = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Main'>>();

  const user = useAppAuthUser();
  
  const { t } = useTranslation();
  
  const errorMessage = useErrorMessage();

  const renderFooter = useRenderListFooter();

  const chatReadUpdater = useChatReadUpdate();

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
  ] = useChatList();

  const getChats = useCallback(
    async () => {
      try {
        const state = await NetInfo.fetch();

        if (!state.isConnected) {
          setScreenError(ERRORS.noInternetConnection);
        } else {
          fetch();
          setScreenError(null);
        }
      } catch (error) {
        console.log(error)
        setScreenError(ERRORS.unknown);
      }
    },
    [fetch]
  );
  
  const refreshChats = useCallback(
    async () => {
      try {
        const state = await NetInfo.fetch();

        if (!state.isConnected) {
          alert(t('No_network_connection'));
        } else {
          onRefresh();
        }
      } catch (error) {
        console.log(error)
        alert(t('_unknown_error_occured'))
      }
    },
    [onRefresh, t]
  );
  
  useEffect(
    ()=> {
      if (!started) {
        setStarted(true);
        getChats();
      }
    },
    [started, getChats]
  );
  
  const getScreenError = ()=> error || screenError;

  if (user === null) {
    return <AuthNow onClick={()=> navigation.navigate('Auth', { screen: 'PhoneNumber' })} />;
  }

  return (
    <View>
      
      <FlatList 
        data={list}
        style={styles.list}
        refreshing={refreshing}
        onRefresh={refreshChats}
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
        onEndReached={getChats}
        ListFooterComponent={renderFooter([
          {
            canRender: loading,
            render: ()=> <Loading />
          },
          {
            canRender: getScreenError() !== null,
            render: ()=> <LoadingError error={errorMessage(getScreenError() ?? '')} onReloadPress={getChats} />
          },
          {
            canRender: page > -1 && list.length === 0,
            render: ()=> <LoadingEmpty text={t('No_chat_found')} />
          }
        ])}
        />

    </View>
  );
}

export default ChatsScreen;
