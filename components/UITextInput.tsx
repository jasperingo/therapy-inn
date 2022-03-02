
import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';

const styles = StyleSheet.create({
  container: {
    padding: AppDimensions.xSmall,
    marginBottom: AppDimensions.xSmall,
    borderRadius: AppDimensions.xSmall,
    backgroundColor: AppColors.colorSurface
  },

  label: {
    marginBottom: 2,
  },

  input: {
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: AppDimensions.xSmall,
    borderColor: AppColors.colorPrimary
  },

  error: {
    color: AppColors.colorError
  }
});

interface Props {
  label: string;
  value: string;
  error?: string;
  maxLength?: number;
  disabled?: boolean;
  placeholder?: string;
  passwordInput?: boolean;
  keyboardType?: KeyboardTypeOptions; 
  onChangeText: (value: string)=> void
}

const UITextInput = (
  { 
    label,
    value,
    error = '', 
    maxLength,
    placeholder,
    disabled = false, 
    passwordInput = false, 
    keyboardType = 'default', 
    onChangeText
  }: Props
) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{ label }</Text>
      <TextInput 
        value={value}
        editable={!disabled}
        maxLength={maxLength}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={passwordInput}
        onChangeText={(text)=> onChangeText(text)}
        style={[styles.input, error !== '' ? { borderColor: AppColors.colorError } : null]} 
        />
      {
        error !== '' && 
        <Text style={styles.error}>{ error }</Text>
      }
    </View>
  );
}

export default UITextInput;
