
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';
import Message from '../models/Message';
import MessageRepository from '../repositories/MessageRepository';

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
  onSend: (index: number, id: string)=> void 
}

const MessageItem = (
  { 
    userId, 
    index, 
    messagingListId, 
    onSend, 
    message: { content, date, id, senderId, receiverId } 
  }: Props
) => {

  useEffect(
    () => {
      const send = async () => {

        try {
          const messageId = await MessageRepository.create({ content, date, senderId, receiverId }, messagingListId);
          onSend(index, messageId);
        } catch(error) {
          console.error(error);
        }

      }

      if (id === undefined) send();
    },
    [content, date, id, senderId, index, messagingListId, receiverId, onSend]
  );
  
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
