
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NetInfo from "@react-native-community/netinfo";
import { RootStackParamList } from '../App';
import AppDimensions from '../assets/values/dimensions';
import AppColors from '../assets/values/colors';
import MessageItem from '../components/MessageItem';
import ChatForm from '../components/ChatForm';
import ChatHeader from '../components/ChatHeader';
import Message from '../models/Message';
import { useAuthUser } from '../hooks/userHook';
import { User } from 'firebase/auth';
import { useMessageList } from '../hooks/messageHook';
import { useRenderListFooter } from '../hooks/utilHook';
import Loading from '../components/Loading';
import { useTranslation } from 'react-i18next';
import { useErrorMessage } from '../hooks/errorHook';
import ERRORS from '../assets/values/errors';
import LoadingError from '../components/LoadingError';
import LoadingEmpty from '../components/LoadingEmpty';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  list: {
    marginBottom: AppDimensions.xSmall
  }
});

const CallButton = ({ phoneNumber }: { phoneNumber: string }) => {

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={()=> Linking.openURL(`tel:${phoneNumber}`)}>
      <Ionicons name='call' size={AppDimensions.large} color={AppColors.colorOnPrimary} />
    </TouchableOpacity>
  );
}

const MessagesScreen = () => {

  const { 
    params: { 
      name, 
      phoneNumber, 
      messagingListId,
      recipientId 
    } 
  } = useRoute<RouteProp<RootStackParamList, 'Messages'>>();

  const user = useAuthUser() as User;

  const { t } = useTranslation();
  
  const errorMessage = useErrorMessage();

  const renderFooter = useRenderListFooter();

  const [started, setStarted] = useState(false);

  const [screenError, setScreenError] = useState<string | null>(null);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Messages'>>();

  const [fetch, list, loading, page, error, onNewMessage, onMessageSent] = useMessageList(messagingListId);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: ()=> <ChatHeader fullName={name} phoneNumber={phoneNumber} />,
      headerRight: () => (
        <CallButton phoneNumber={phoneNumber} />
      ),
    });
  }, [name, phoneNumber, navigation]);

  useEffect(
    ()=> {

      const startFetch = async () => {
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
      }

      if (!started) {
        setStarted(true);
        startFetch();
      }
    },
    [started, fetch]
  );
  
  const getError = ()=> error || screenError;

  const sendMessage = (content: string) => {
    
    const message: Message = {
      content,
      date: Date.now(),
      senderId: user.uid,
      receiverId: recipientId
    };

    onNewMessage(message);
  }

  return (
    <View style={styles.container}>

      <FlatList 
        data={list}
        style={styles.list}
        keyExtractor={(item)=> `message-${item.id}-${item.date}`}
        inverted={true}
        renderItem={({ item, index })=> (
          <MessageItem 
            message={item} 
            userId={user.uid} 
            index={index} 
            onSend={onMessageSent} 
            messagingListId={messagingListId}
            />
        )}
        ListFooterComponent={renderFooter([
          {
            canRender: loading,
            render: ()=> <Loading />
          },
          {
            canRender: getError() !== null,
            render: ()=> <LoadingError error={errorMessage(getError() ?? '')} onReloadPress={()=> setStarted(false)} />
          },
          {
            canRender: page > -1 && list.length === 0,
            render: ()=> <LoadingEmpty text={t('No_article_found')} />
          }
        ])}
        />

      <ChatForm onSend={sendMessage} />
    </View>
  );
}

export default MessagesScreen;
