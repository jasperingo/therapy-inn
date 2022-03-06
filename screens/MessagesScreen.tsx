
import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../App';
import AppDimensions from '../assets/values/dimensions';
import AppColors from '../assets/values/colors';
import MessageItem from '../components/MessageItem';
import ChatForm from '../components/ChatForm';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  list: {
    marginBottom: AppDimensions.xSmall
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

      <FlatList 
        data={[1, 2, 3, 4, 5]}
        style={styles.list}
        keyExtractor={(item)=> String(item)}
        inverted={true}
        renderItem={({ item })=> (
          <MessageItem num={item} />
        )}
        />

      <ChatForm onSend={(message)=> alert(`Sending: ${message}`)} />
    </View>
  );
}

export default MessagesScreen;
