import React, { useEffect, useReducer, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import i18n from './assets/strings/i18next.config';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme, Theme, NavigatorScreenParams  } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainScreens, { MainTabParamList } from './screens/Main/MainScreens';
import AppColors from './assets/values/colors';
import AuthScreens, { AuthTabParamList } from './screens/Auth/AuthScreens';
import UserReducer from './context/UserReducer';
import AppContext from './context/AppContext';
import { useAuthUserFetch } from './hooks/userHook';
import Article from './models/Article';
import ArticleReducer from './context/ArticleReducer';

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
  Main: NavigatorScreenParams<MainTabParamList>;
  Auth: NavigatorScreenParams<AuthTabParamList>;
};

const ReadyApp = () => {

  const authUserFetch = useAuthUserFetch();

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(
    () => {
      (async ()=> {
        try {

          if (appIsReady) return;
          
          await SplashScreen.preventAutoHideAsync();

          const ready = await authUserFetch();

          setAppIsReady(ready);

        } catch (error) {
          setAppIsReady(true);
          console.error(error);
        }
      })();
    }, 
    [appIsReady, authUserFetch]
  );

  useEffect(
    () => {
      if (appIsReady) {
        (async ()=> await SplashScreen.hideAsync())();
      }
    },
    [appIsReady]
  );

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen name="Main" component={MainScreens} />
          <Stack.Screen name="Auth" component={AuthScreens} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const App = ()=> {

  const articlesArr: Array<Article> = [];

  const [user, userDispatch] = useReducer(UserReducer, null);

  const [articles, articleDispatch] = useReducer(ArticleReducer, articlesArr);

  return (
    <AppContext.Provider value={{
      user,
      userDispatch,
      articles, 
      articleDispatch
    }}
    >
      <ReadyApp />
    </AppContext.Provider>
  );
}

export default App;
