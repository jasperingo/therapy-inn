
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';

const styles = StyleSheet.create({
  container: {
    marginVertical: AppDimensions.xSmall,
    backgroundColor: AppColors.colorSurface
  },

  text: {
    paddingVertical: AppDimensions.small,
    paddingHorizontal: AppDimensions.medium
  },

  buttonBox: {
    flexDirection: 'row'
  },

  button: {
    flexGrow: 1,
    padding: AppDimensions.medium
  },

  buttonActive: {
    backgroundColor: AppColors.colorPrimary
  },

  buttonText: {
    textAlign: 'center',
    fontWeight: AppDimensions.fontBold
  }
});

const ItemButton = ({ text, isChoosen, onclick }: { text: string; isChoosen: boolean; onclick: ()=> void }) => {

  return (
    <TouchableOpacity 
      onPress={onclick}
      activeOpacity={0.6}
      style={[styles.button, isChoosen ? styles.buttonActive : null]} 
      >
      <Text style={styles.buttonText}>{ text }</Text>
    </TouchableOpacity>
  );
}

export type ChoiceType = -1 | 0 | 1;

const SurveyItem = ({ item, index, onSelect }: { item: string; index: number, onSelect: (index: number, answer: ChoiceType)=> void }) => {

  const [choice, setChoice] = useState<ChoiceType>(-1);

  const onChoiceChange = (it: ChoiceType) => {
    setChoice(it);
    onSelect(index, it);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{ item }</Text>
      <View style={styles.buttonBox}>
        <ItemButton text='Yes' onclick={()=> onChoiceChange(1)} isChoosen={choice === 1} />
        <ItemButton text='No' onclick={()=> onChoiceChange(0)} isChoosen={choice === 0} />
      </View>
    </View>
  );
}

export default SurveyItem;
