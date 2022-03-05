import React, { useReducer } from 'react';
import { LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import i18n from './assets/strings/i18next.config';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme, Theme, NavigatorScreenParams  } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainScreens, { MainTabParamList } from './screens/Main/MainScreens';
import AppColors from './assets/values/colors';
import AuthScreens, { AuthTabParamList } from './screens/Auth/AuthScreens';
import UserReducer from './context/UserReducer';
import AppContext, { articlestate } from './context/AppContext';
import ArticleReducer from './context/ArticleReducer';
import SplashScreen from './screens/SplashScreen';
import MessagesScreen from './screens/MessagesScreen';
import ChatHeader from './components/ChatHeader';

LogBox.ignoreLogs(['Setting a timer for a long period of time'])

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
  headerShown: false,
};

export type RootStackParamList = {
  Splash: undefined;
  Messages: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  Auth: NavigatorScreenParams<AuthTabParamList>;
};

const App = ()=> {

  const [user, userDispatch] = useReducer(UserReducer, null);

  const [articles, articleDispatch] = useReducer(ArticleReducer, articlestate);

  return (
    <AppContext.Provider value={{
      user,
      userDispatch,
      articles, 
      articleDispatch
    }}
    >
      <SafeAreaProvider>
        <StatusBar style="light" />
        <NavigationContainer theme={MyTheme}>
          <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Main" component={MainScreens} />
            <Stack.Screen name="Auth" component={AuthScreens} />
            <Stack.Screen 
              name="Messages" 
              component={MessagesScreen} 
              options={{ 
                headerShown: true,
                headerTitle: ()=> <ChatHeader />,
                headerTintColor: AppColors.colorOnPrimary
              }} 

              />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AppContext.Provider>
  );
}

export default App;
