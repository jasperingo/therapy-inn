
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FloatingAction } from "react-native-floating-action";
import AppDimensions from '../../assets/values/dimensions';
import AppColors from '../../assets/values/colors';
import { useAppAuthUser } from '../../hooks/userHook';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArticlesStackParamList } from './ArticlesScreen';
import ArticleItem from '../../components/ArticleItem';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'relative',
  },

  text: {
    fontSize: AppDimensions.large
  }
});

const ArticleListScreen = () => {

  const user = useAppAuthUser();

  const navigation = useNavigation<NativeStackNavigationProp<ArticlesStackParamList>>();

  return (
    <View style={styles.container}>
      
      <FlatList 
        data={[1, 2, 3, 4, 5]}
        renderItem={({ item })=> (
          <ArticleItem key={item} />
        )}
        keyExtractor={(item)=> String(item)}
        />

      {
        user !== null && 
        <FloatingAction
          actions={[{ 
            name: 'add_article',
            icon: <Ionicons name='add' size={30} color={AppColors.colorOnPrimary} style={{ textAlign: 'center' }} />
          }]}
          color={AppColors.colorPrimary}
          onPressItem={() => navigation.navigate('ArticleCreate')}
          overrideWithAction={true}
          />
      }
    </View>
  );
}

export default ArticleListScreen;
