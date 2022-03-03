
import React from 'react';
import { StyleSheet, View } from 'react-native';
import CheckBox from 'react-native-check-box';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';

const styles = StyleSheet.create({
  container: {
    padding: AppDimensions.xSmall,
    marginBottom: AppDimensions.xSmall,
    borderRadius: AppDimensions.xSmall,
    backgroundColor: AppColors.colorSurface
  },
});

interface Props {
  label: string;
  checked: boolean;
  onClick: ()=> void;
}

const UICheckBox = ({ label, checked, onClick }: Props) => {
  return (
    <View style={styles.container}>
      <CheckBox
        onClick={onClick}
        isChecked={checked}
        rightText={label}
        checkBoxColor={AppColors.colorPrimary}
        />
    </View>
  );
}

export default UICheckBox;

