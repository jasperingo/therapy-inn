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
import ArticleCreateScreen from './screens/ArticleCreateScreen';
import AppDimensions from './assets/values/dimensions';
import MessageReducer from './context/MessageReducer';
import { useFonts } from 'expo-font';

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
  ArticleCreate: undefined;
  Messages: { name: string; phoneNumber: string; messagingListId?: string; recipientId: string; };
  Main: NavigatorScreenParams<MainTabParamList>;
  Auth: NavigatorScreenParams<AuthTabParamList>;
};

const App = ()=> {

  const [user, userDispatch] = useReducer(UserReducer, null);

  const [articles, articleDispatch] = useReducer(ArticleReducer, articlestate);

  const [message, messageDispatch] = useReducer(MessageReducer, '');

  const [fontLoaded] = useFonts({
    'SecularOne-Regular': require('./assets/fonts/SecularOne-Regular.ttf')
  });

  if (!fontLoaded) return null;

  return (
    <AppContext.Provider value={{
      user,
      userDispatch,
      articles, 
      articleDispatch,
      message, 
      messageDispatch
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
              name="ArticleCreate" 
              component={ArticleCreateScreen} 
              options={{ 
                headerShown: true,
                title: i18n.t('Create_article'),
                headerTintColor: AppColors.colorOnPrimary,
                headerTitleStyle: {
                  fontSize: AppDimensions.xLarge,
                },
              }} 
              />
            <Stack.Screen 
              name="Messages" 
              component={MessagesScreen} 
              options={{ 
                headerShown: true,
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
