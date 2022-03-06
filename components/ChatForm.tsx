
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';

const styles = StyleSheet.create({
  inputBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: AppDimensions.xSmall,
    backgroundColor: AppColors.colorSurface
  },

  input: {
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 50,
    padding: AppDimensions.xSmall,
    borderColor: AppColors.colorPrimary
  },

  sendButton: {
    borderRadius: 50,
    padding: AppDimensions.xSmall,
    marginLeft: AppDimensions.small,
    backgroundColor: AppColors.colorPrimary
  },

  icon: {
    textAlign: 'center',
    fontSize: AppDimensions.xxLarge
  }
});

const ChatForm = ({ onSend }: { onSend: (message: string)=> void }) => {

  const { t } = useTranslation();

  const [message, setMessage] = useState('');

  const send = () => {
    onSend(message);
    setMessage('');
  }

  return (
    <View style={styles.inputBox}>
      <TextInput 
        value={message}
        style={styles.input}
        onChangeText={(text)=> setMessage(text)}
        placeholder={t('Enter_your_message')}
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          activeOpacity={0.6} 
          disabled={message.trim() === ''}
          onPress={send}
          >
          <Ionicons name='send' color={AppColors.colorOnPrimary} style={styles.icon} />
        </TouchableOpacity>
    </View>
  );
}

export default ChatForm;
