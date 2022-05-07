import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { colors, spacings, text } from '../styles';

import { RecordActionButton } from './SignInButton';

const VistaSummaryText = ({ summaryText, callback }: any) => {
  return (
    <View>
      <Text style={styles.summaryText}>{summaryText}</Text>
      <View style={{ alignItems: 'center', marginTop: spacings.MEDIUM }}><RecordActionButton callback={callback}/></View>
    </View>
  )
}

const styles = StyleSheet.create({
  summaryText: {
    ...text.p, 
    color: colors.SECONDARY,
  }  
});

export default VistaSummaryText;