
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';
import { useMessageCreate } from '../hooks/messageHook';
import Message from '../models/Message';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: AppDimensions.small,
    marginHorizontal: AppDimensions.small,
  },

  outContainer: {
    justifyContent: 'flex-end',
  },

  box: {
    borderWidth: 1,
    maxWidth: '70%',
    padding: AppDimensions.xSmall,
    borderColor: AppColors.colorGray,
    borderRadius: AppDimensions.xSmall,
    backgroundColor: AppColors.colorSurface
  },

  outBox: { 
    borderColor: AppColors.colorPrimary
  },

  bottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },

  status: {
    fontSize: AppDimensions.medium,
    marginRight: AppDimensions.xSmall
  },

  date: {
    color: AppColors.colorGray
  }
});

interface Props { 
  userId: string; 
  index: number;
  message: Message, 
  messagingListId?: string;
  onSend: (index: number, id: string, listId: string)=> void 
}

const MessageItem = (
  { 
    userId, 
    index, 
    messagingListId, 
    onSend, 
    message,
  }: Props
) => {

  const creator = useMessageCreate(message.id !== undefined);
  
  useEffect(
    () => {
      const sendMessage = async () => {
        const response = await creator(message, messagingListId);
        if (response !== undefined)
          onSend(index, ...response);
      }

      if (message.id === undefined) sendMessage();
    },
    [message, index, messagingListId, onSend, creator]
  );

  const { content, date, id, senderId } = message;
  
  return (
    <View style={[styles.container, senderId === userId ? styles.outContainer : null]}>
      <View style={[styles.box, senderId === userId ? styles.outBox : null]}>
        <Text>{ content }</Text>
        <View style={styles.bottom}>
          <Ionicons name={id !== undefined ? 'checkmark' : 'time'} color={AppColors.colorError} style={styles.status} />
          <Text style={styles.date}>{ (new Date(date)).toDateString() }</Text>
        </View>
      </View>
    </View>
  );
}

export default MessageItem;
