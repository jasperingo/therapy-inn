
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
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
    flexDirection: 'row',
    padding: AppDimensions.xSmall,
    marginBottom: AppDimensions.small,
    backgroundColor: AppColors.colorSurface
  },

  itemNumber: {
    marginRight: AppDimensions.xSmall,
    fontWeight: AppDimensions.fontBold
  }
});

const GetHelpAdvise = () => {
  return (
    <FlatList 
      data={SELF_HELP}
      style={styles.container}
      keyExtractor={(item)=> item}
      renderItem={({ item, index }) => (
        <View style={styles.item}>
          <Text style={styles.itemNumber}>{ (index+1) }.</Text>
          <Text>{ item }</Text>
        </View>
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
