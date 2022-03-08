
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../App';
import AppColors from '../../assets/values/colors';
import AppDimensions from '../../assets/values/dimensions';
import AuthNow from '../../components/AuthNow';
import GetHelpIntro from '../../components/GetHelpIntro';
import GetHelpSurvey from '../../components/GetHelpSurvey';
import { useAuthUser } from '../../hooks/userHook';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: AppDimensions.medium
  },

  topButton: {
    marginHorizontal: AppDimensions.medium
  }
});


const RestartButton = ({ onRestartClicked }: { onRestartClicked: ()=> void }) => {

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onRestartClicked} style={styles.topButton}>
      <Ionicons name='refresh-circle' size={AppDimensions.xLarge} color={AppColors.colorOnPrimary} />
    </TouchableOpacity>
  );
}

const GetHelpScreen = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Main'>>();

  const user = useAuthUser();

  const [stage, setStage] = useState<0 | 1 | 2>(0);

  useLayoutEffect(() => {
    if (user !== null) 
      navigation.setOptions({
        headerRight: () => (
          <RestartButton onRestartClicked={()=> setStage(0)} />
        ),
      });
  }, [user, navigation]);

  if (user === null) {
    return <AuthNow onClick={()=> navigation.navigate('Auth', { screen: 'PhoneNumber' })} />;
  }

  return (
    <View style={styles.container}>

      {
        stage === 0 && 
        <GetHelpIntro onAccept={()=> setStage(1)} />
      }

      {
        stage === 1 && 
        <GetHelpSurvey />
      }

      

      {/* <UIButton 
        loading={false} 
        text="Contact therapist" 
        onClick={()=> {
          navigation.navigate(
            'Messages', 
            { 
              name: "Jane", 
              phoneNumber: "+2349030572400",
              messagingListId: undefined,
              recipientId: 'bYnuaDQ2taahsN5xP0TIHldMCOC3'
            }
          );
        }}
        /> */}
    </View>
  );
}

export default GetHelpScreen;
