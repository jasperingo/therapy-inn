
import { t } from 'i18next';
import React, { useState } from 'react' ;
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet } from 'react-native';
import AppDimensions from '../assets/values/dimensions';
import SurveyItem, { ChoiceType } from './SurveyItem';
import UIButton from './UIButton';

const SYMPTOMS = t('__symptoms', { returnObjects: true }) as Array<string>;
// [
//   'LOW MOOD',
//   'LOSS OF INTEREST IN REGULAR ACTIVITIES',
//   'CHANGE IN APPETITE',
//   'FEELING WORTHLESS',
//   'FEELING EXESSIVELY GUILTY',
//   'SLEEPING TOO MUCH',
//   'SLEEPING TOO LITTLE',
//   'POOR CONCENTRATION',
//   'RESTLESSNESS',
//   'SLOWNESS',
//   'LOSS OF ENERGY',
//   'RECURRENT THOUGHTS OF SUCIDE'
// ];

const styles = StyleSheet.create({
  container: {
    padding: AppDimensions.small,
    marginBottom: AppDimensions.small
  }
});

const GetHelpSurvey = ({ onDone }: { onDone: (to: 2 | 3)=> void }) => {

  const { t } = useTranslation();

  const [answers, setAnswers] = useState<Array<ChoiceType>>(Array(SYMPTOMS.length).fill(-1));

  const onAnswer = (index: number, answer: ChoiceType) => {
    setAnswers((old)=> {
      old[index] = answer;
      return old;
    });
  }

  const onSubmit = () => {
    const error = answers.find(i=> i === -1);
    
    if (error !== undefined) {
      alert(t('_incomplete_survey_error'));
      return;
    }
    
    const positives = answers.reduce<number>((old, cur)=> old + cur, 0);

    if (positives < 5) {
      onDone(2);
    } else {
      onDone(3);
    }
  }

  return (
    <FlatList 
      data={SYMPTOMS}
      style={styles.container}
      keyExtractor={(item)=> item}
      nestedScrollEnabled={true}
      renderItem={({ item, index })=> (
        <SurveyItem 
          item={item} 
          index={index}
          onSelect={onAnswer}
          />
      )}
      ListFooterComponent={(
        <UIButton 
          loading={false}
          text={t('Submit')}
          onClick={onSubmit}
          />
      )}
      />
  );
}

export default GetHelpSurvey;
