
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { RootStackParamList } from '../../App';
import AppDimensions from '../../assets/values/dimensions';
import AuthNow from '../../components/AuthNow';
import ChatItem from '../../components/ChatItem';
import { useAppAuthUser } from '../../hooks/userHook';

const styles = StyleSheet.create({

  list: {
    paddingTop: AppDimensions.small,
    marginBottom: AppDimensions.xSmall,
  }
});

const ChatsScreen = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Main'>>();

  const user = useAppAuthUser();

  if (user === null) {
    return <AuthNow onClick={()=> navigation.navigate('Auth', { screen: 'PhoneNumber' })} />;
  }

  return (
    <View>
      
      <FlatList 
        data={[1, 2, 3, 4, 5]}
        style={styles.list}
        keyExtractor={(item)=> String(item)}
        renderItem={()=> (
          <ChatItem 
            onClick={()=> navigation.navigate('Messages')}
            />
        )}
        />

    </View>
  );
}

export default ChatsScreen;
