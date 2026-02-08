import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { text } from '../styles';

type Props = {
  title: string;
  options: {
    label: string;
    value: string;
  }[];
  selectedValue: string;
  setSelectedValue: (itemValue: string) => void;
}

const DropDown = ({ title, options, selectedValue, setSelectedValue }: Props) => {
  return (
    <>
      <Text style={styles.pickerTitle}>{title}</Text>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => setSelectedValue(itemValue)}
        style={styles.picker}
        itemStyle={styles.pickerItem}
      >
        {options.map((option: any, idx: number) => <Picker.Item key={idx} label={option.label} value={option.value} />)}
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
  },
});

export default DropDown;