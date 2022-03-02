
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InfoScreen from './InfoScreen';
import ChatsScreen from './ChatsScreen';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';
import { useTranslation } from 'react-i18next';


const Tab = createBottomTabNavigator();

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
            case 'Chats':
              iconName = 'chatbubble';
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
          fontSize: AppDimensions.xLarge,
          color: AppColors.colorOnPrimary,
        },
        headerTintColor: AppColors.colorOnPrimary
      })}
      >
      <Tab.Screen name="Articles" component={InfoScreen} options={{ title: t('App_name') }} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
    </Tab.Navigator>
  );
}

export default MainScreens;

