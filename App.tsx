import React from 'react';
import { StatusBar } from 'expo-status-bar';
import i18n from './assets/strings/i18next.config';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme, Theme  } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainScreens from './screens/MainScreens';
import AppColors from './assets/values/colors';
import AppDimensions from './assets/values/dimensions';

const Stack = createNativeStackNavigator();

const MyTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: AppColors.colorPrimary,
    card: AppColors.colorPrimary,
    background: AppColors.colorBackground,
    text: AppColors.colorOnSurface
  }
};

const screenOptions: NativeStackNavigationOptions = {
  title: i18n.t('App_name'),
  headerTitleStyle: {
    fontSize: AppDimensions.xLarge,
    color: AppColors.colorOnPrimary,
  },
};

const App = ()=> {

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={MyTheme}>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="Main" component={MainScreens} />
      </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
