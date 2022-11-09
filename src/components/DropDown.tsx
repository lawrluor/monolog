import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const DropDown = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <Text>This is a drop down</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red'
  }
});

export default DropDown;