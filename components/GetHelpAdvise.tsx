
import React from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';

const SELF_HELP = [
  'Get some exercise',
  'Challenge the negative thoughts that comes to your head',
  'Regularly eat wholesome foods',
  'Try to get adequate sleep',
  'Drink plenty of water',
  'Engage in activities that will make you laugh',
  'Make a change in your normal routine'
];


const styles = StyleSheet.create({
  container: {
    padding: AppDimensions.small,
  },

  heading: {
    padding: AppDimensions.xSmall,
    fontSize: AppDimensions.medium,
    fontWeight: AppDimensions.fontBold,
    marginBottom: AppDimensions.medium,
    backgroundColor: AppColors.colorSurface
  },

  item: {
    padding: AppDimensions.xSmall,
    marginBottom: AppDimensions.small,
    backgroundColor: AppColors.colorSurface
  }
});

const GetHelpAdvise = () => {
  return (
    <FlatList 
      data={SELF_HELP}
      style={styles.container}
      keyExtractor={(item)=> item}
      renderItem={({ item, index }) => (
        <Text style={styles.item}>{ (index+1) }. { item }</Text>
      )}
      ListHeaderComponent={(
        <Text style={styles.heading}>
          To help elevate your feeling of depression, we have provided self-help solution you can try out.
        </Text>
      )}
      />
  );
}

export default GetHelpAdvise;
