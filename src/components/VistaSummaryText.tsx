import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { colors, spacings, text } from '../styles';
import { ActionButton } from './SignInButton';

type Props = {
  summaryText: string;
  callback?: () => void;
}

const VistaSummaryText = ({ summaryText, callback }: Props) => {
  return (
    <View>
      <Text style={styles.summaryText}>{summaryText}</Text>
      {callback && <View style={{ alignItems: 'center', marginTop: spacings.MEDIUM }}>
        <ActionButton callback={callback} text={"Record"} />
      </View>}
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