
import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../App';
import AppDimensions from '../assets/values/dimensions';
import AppColors from '../assets/values/colors';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  container: {
    
  },

  inputBox: {
    padding: AppDimensions.xSmall,
    backgroundColor: AppColors.colorSurface
  },

  input: {
    borderWidth: 1,
    borderRadius: 50,
    padding: AppDimensions.xSmall,
    borderColor: AppColors.colorPrimary
  }
});

const CallButton = () => {

  return (
    <TouchableOpacity activeOpacity={0.6}>
      <Ionicons name='call' size={AppDimensions.large} color={AppColors.colorOnPrimary} />
    </TouchableOpacity>
  );
}

const MessagesScreen = () => {

  const { t } = useTranslation();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Messages'>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CallButton />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>

      <View style={styles.inputBox}>
        <TextInput 
          style={styles.input}
          placeholder={t('Enter_your_message')}
          />
      </View>
    </View>
  );
}

export default MessagesScreen;
