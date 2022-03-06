
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ArticlesScreen from './ArticlesScreen';
import ChatsScreen from './ChatsScreen';
import AppColors from '../../assets/values/colors';
import AppDimensions from '../../assets/values/dimensions';
import { useTranslation } from 'react-i18next';
import ProfileScreen from './ProfileScreen';
import GetHelpScreen from './GetHelpScreen';


const Tab = createBottomTabNavigator();

export type MainTabParamList = {
  Articles: undefined;
  Chats: undefined;
  Profile: { id: string }
};

const MainScreens = () => {

  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          switch (route.name) {
            case  'Articles': 
              iconName = 'newspaper';
              break;
            case 'GetHelp':
              iconName = 'heart';
              break;
            case 'Chats':
              iconName = 'chatbubble';
              break;
            case 'Profile':
              iconName = 'person';
              break;

            default:
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: AppColors.colorOnPrimary,
        tabBarLabelStyle: {
          marginBottom: AppDimensions.xSmall
        },
        tabBarStyle: {
          height: 60
        },
        headerTitleStyle: {
          fontSize: AppDimensions.xLarge
        },
        headerTintColor: AppColors.colorOnPrimary
      })}
      >
      <Tab.Screen name="Articles" component={ArticlesScreen} options={{ title: t('App_name'), tabBarLabel: t('Articles') }} />
      <Tab.Screen name="GetHelp" component={GetHelpScreen} options={{ title: t('Get_help'), tabBarLabel: t('Get_help') }} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default MainScreens;

