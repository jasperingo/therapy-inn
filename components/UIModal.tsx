
import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import AppColors from '../assets/values/colors';
import AppDimensions from '../assets/values/dimensions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },

  text: {
    width: '90%',
    padding: AppDimensions.small,
    borderRadius: AppDimensions.xSmall,
    backgroundColor: AppColors.colorSurface
  }
});

interface Props {
  show: boolean;
  onRequestClose: ()=> void
}

const UIModal = ({ show, onRequestClose }: Props) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onRequestClose={onRequestClose}
      >
      <View style={styles.container}>
        <Text style={styles.text}>This is a modal</Text>
      </View>
    </Modal>
  );
}

export default UIModal;
