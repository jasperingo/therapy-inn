
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Subscription } from 'expo-modules-core';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useCallback } from 'react';
import { RootStackParamList } from '../App';
import Chat from '../models/Chat';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function schedulePushNotification(chat: Chat) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${chat.recipientDisplayName} sent a message`,
      body: chat.message,
      data: { ...chat },
    },
    trigger: { seconds: 1 },
  });
}

export const useNotification = ()=> {

  const responseListener = useRef<Subscription>();
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Main'>>();

  useEffect(
    () => {
      
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        const item = response.notification.request.content.data;
        navigation.navigate('Messages',
        { 
          name: item.recipientDisplayName as string, 
          phoneNumber: item.recipientPhoneNumber as string,
          messagingListId: item.id as string,
          recipientId: item.recipientId as string
        });
      });

      return () => {
        Notifications.removeNotificationSubscription(responseListener.current as Subscription);
      };
    }, 
    [navigation]
  );
  
  return useCallback(
    async (chat: Chat)=> {
      await schedulePushNotification(chat);
    }, 
    []
  );
}

