import React from 'react';

import { Picker } from '@react-native-picker/picker';

import { StyleSheet, Text } from 'react-native';

import { text } from '../styles';

const DropDown = ({ title, options, selectedValue, setSelectedValue }: any): JSX.Element => {
  return (
    <>
      <Text style={styles.pickerTitle}>{title}</Text>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue):void => setSelectedValue(itemValue)}
        style={styles.picker}
        itemStyle={styles.pickerItem}
      >
        {options.map((option: any, key: number) => <Picker.Item key={key} label={option.label} value={option.value} />)}
      </Picker>
    </>
  )
}

const styles = StyleSheet.create({
  pickerTitle: {
    ...text.h3,
  },
  picker: {
    height: 140,
    marginTop: -20,
  },
  // Note: The highlight color on the selected item cannot be changed (easily) yet.
  // Could have a flag on if item is selected, dynamically assign style as variable in the component
  pickerItem: {
    ...text.h3,
    height: 140,
    // padding: 20  Unsure how to make the highlight region taller/larger
  },
});

export default DropDown;