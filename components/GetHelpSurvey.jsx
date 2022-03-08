
import React from 'react' ;
import { ScrollView, StyleSheet, Text } from 'react-native';

const SYMPTOMS = [
  'LOW MOOD',
  'LOSS OF INTEREST IN REGULAR ACTIVITIES',
  'CHANGE IN APPETITE',
  'FEELING WORTHLESS',
  'FEELING EXESSIVELY GUILTY',
  'SLEEPING TOO MUCH',
  'SLEEPING TOO LITTLE',
  'POOR CONCENTRATION',
  'RESTLESSNESS',
  'SLOWNESS',
  'LOSS OF ENERGY',
  'RECURRENT THOUGHTS OF SUCIDE'
];

const styles = StyleSheet.create({
  container: {

  }
});

const GetHelpSurvey = () => {
  return (
    <ScrollView style={styles.container}>
      <Text>GetHelpSurvey { SYMPTOMS[0] }</Text>
    </ScrollView>
  );
}

export default GetHelpSurvey;
