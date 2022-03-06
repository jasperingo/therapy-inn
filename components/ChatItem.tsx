
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';
import { usePhotoDownloadURL } from '../hooks/photoHook';
import Chat from '../models/Chat';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: AppDimensions.xSmall,
    borderRadius: AppDimensions.xSmall,
    marginVertical: AppDimensions.xSmall,
    marginHorizontal: AppDimensions.small,
    backgroundColor: AppColors.colorSurface
  },

  iamge: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: AppDimensions.xSmall
  },

  body: {
    flexGrow: 1,
  },

  nameDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  name: {
    flexGrow: 1,
    fontWeight: AppDimensions.fontBold
  },

  message: {
    flexGrow: 1,
    color: AppColors.colorGray
  },

  date: {
    color: AppColors.colorGray,
    fontSize: AppDimensions.small
  },

  unread: {
    borderRadius: 50,
    width: AppDimensions.small,
    height: AppDimensions.small,
    backgroundColor: AppColors.colorPrimary
  }
});

const ChatItem = ({ chat, onClick }: { chat: Chat; onClick: ()=> void }) => {

  const getPhotoURL = usePhotoDownloadURL();

  const [photo, setPhoto] = useState('');

  useEffect(
    ()=> {
      (async ()=> {
        if (photo !== '') return;
        try {
          setPhoto(await getPhotoURL(chat.recipientPhotoURL));
        } catch(error) {
          console.log(error);
        }
      })();
    },
    [chat.recipientPhotoURL, photo, getPhotoURL]
  );

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.6} onPress={onClick}>
      <Image source={{ uri: photo || chat.recipientPhotoURL }} style={styles.iamge} />
      <View style={styles.body}>
        <View style={styles.nameDate}>
          <Text style={styles.name}>{ chat.recipientDisplayName }</Text>
          <Text style={styles.date}>{ (new Date(chat.date)).toDateString() }</Text>
        </View>
        <View style={styles.nameDate}>
          <Text style={styles.message}>{ chat.message }</Text>
          {
            !chat.read && 
            <Text style={styles.unread}></Text>
          }
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default ChatItem;
