
import React from 'react';
import AppDimensions from '../../assets/values/dimensions';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ArticleListScreen from './ArticleListScreen';
import ArticleCreateScreen from './ArticleCreateScreen';
import { useTranslation } from 'react-i18next';
import AppColors from '../../assets/values/colors';

const Stack = createNativeStackNavigator();

export type ArticlesStackParamList = {
  ArticleCreate: undefined;
  ArticleList: undefined;
};

const ArticlesScreen = () => {

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
        name="ArticleList" 
        component={ArticleListScreen} 
        options={{ title: t('App_name') }} 
        />

      <Stack.Screen 
        name="ArticleCreate" 
        component={ArticleCreateScreen} 
        options={{ title: t('Create_article') }} 
        />

    </Stack.Navigator>
  );
}

export default ArticlesScreen;
