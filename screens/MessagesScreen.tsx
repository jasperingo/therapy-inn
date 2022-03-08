
import React, { useEffect, useLayoutEffect } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../App';
import AppDimensions from '../assets/values/dimensions';
import AppColors from '../assets/values/colors';
import MessageItem from '../components/MessageItem';
import ChatForm from '../components/ChatForm';
import ChatHeader from '../components/ChatHeader';
import Message from '../models/Message';
import { useAuthUser } from '../hooks/userHook';
import { User } from 'firebase/auth';
import { useRenderListFooter } from '../hooks/utilHook';
import Loading from '../components/Loading';
import { useErrorMessage } from '../hooks/errorHook';
import LoadingError from '../components/LoadingError';
import { useMessageList } from '../hooks/messageHook';

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
  
  const errorMessage = useErrorMessage();

  const renderFooter = useRenderListFooter();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Messages'>>();

  const [
    load, 
    list, 
    loading, 
    error, 
    onNewMessage, 
    onMessageSent
  ] = useMessageList(messagingListId, user.uid);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: ()=> <ChatHeader fullName={name} phoneNumber={phoneNumber} />,
      headerRight: () => (
        <CallButton phoneNumber={phoneNumber} />
      ),
    });
  }, [name, phoneNumber, navigation]);

  useEffect(()=> load(), [load]);

  const sendMessage = (content: string) => {
    
    const message: Message = {
      content,
      date: Date.now(),
      senderId: user.uid,
      receiverId: recipientId
    };

    onNewMessage(message);
  }

  const messageSent = (index: number, id: string, listId: string) => {
    onMessageSent(index, id);
    if (messagingListId === undefined) {
      navigation.setParams({ messagingListId: listId });
    }
  }

  return (
    <View style={styles.container}>

      <FlatList 
        data={list}
        style={styles.list}
        keyExtractor={(item)=> `message-${item.id}-${item.date}`}
        inverted={true}
        onEndReached={load}
        renderItem={({ item, index })=> (
          <MessageItem 
            message={item} 
            userId={user.uid} 
            index={index}
            onSend={messageSent} 
            messagingListId={messagingListId}
            />
        )}
        ListFooterComponent={renderFooter([
          {
            canRender: loading,
            render: ()=> <Loading />
          },
          {
            canRender: error !== null,
            render: ()=> <LoadingError error={errorMessage(error ?? '')} onReloadPress={load} />
          }
        ])}
        />

      <ChatForm onSend={sendMessage} />
    </View>
  );
}

export default MessagesScreen;
