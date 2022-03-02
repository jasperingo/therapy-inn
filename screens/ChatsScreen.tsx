
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../App';
import AppDimensions from '../assets/values/dimensions';

const styles = StyleSheet.create({
  container: {
    padding: AppDimensions.large
  },
  text: {
    fontSize: AppDimensions.large
  }
});

const ChatsScreen = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Chats'>>();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>ChatsScreen</Text>
      <Button title='Sign In' onPress={()=> navigation.navigate('Auth', { screen: 'PhoneNumber' })} />
    </View>
  );
}

export default ChatsScreen;
