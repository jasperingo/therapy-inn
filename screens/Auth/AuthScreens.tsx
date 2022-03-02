
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PhoneNumberScreen from './PhoneNumberScreen';
import AppDimensions from '../../assets/values/dimensions';
import AppColors from '../../assets/values/colors';
import { useTranslation } from 'react-i18next';
import VerifyScreen from './VerifyScreen';
import AddDetailsScreen from './AddDetailsScreen';

const Stack = createNativeStackNavigator();

export type AuthTabParamList = {
  PhoneNumber: undefined;
  Verify: { id: string; phoneNumber: string };
  AddDetails: undefined;
};

const AuthScreen = () => {

  const { t } = useTranslation();

  return (
    <Stack.Navigator 
      screenOptions={{
        headerTitleStyle: {
          fontSize: AppDimensions.xLarge,
          color: AppColors.colorOnPrimary,
        },
        headerTintColor: AppColors.colorOnPrimary
      }}
      >
      <Stack.Screen 
        name="PhoneNumber" 
        component={PhoneNumberScreen} 
        options={{ title: t('Phone_number') }} 
        />

      <Stack.Screen 
        name="Verify" 
        component={VerifyScreen} 
        options={{ title: t('Verify_phone_number') }} 
        />

      <Stack.Screen 
        name="AddDetails" 
        component={AddDetailsScreen} 
        options={{ title: t('Update_profile') }} 
        />
    </Stack.Navigator>
  );
}

export default AuthScreen;
