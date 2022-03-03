
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../App';
import AppDimensions from '../../assets/values/dimensions';
import AuthNow from '../../components/AuthNow';
import { useAppAuthUser } from '../../hooks/userHook';
import User from '../../models/User';

const styles = StyleSheet.create({
  container: {
    padding: AppDimensions.large
  },
  text: {
    fontSize: AppDimensions.large
  }
});

const ChatsScreen = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Main'>>();

  const user = useAppAuthUser() as User;

  if (user === null) {
    return <AuthNow onClick={()=> navigation.navigate('Auth', { screen: 'PhoneNumber' })} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>ChatsScreen</Text>
    </View>
  );
}

export default ChatsScreen;
