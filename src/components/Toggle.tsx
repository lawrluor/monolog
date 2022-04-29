import React from 'react';
import { View, Text, Button } from 'react-native';

// not currently used
const Toggle = (status, optionTrue, optionFalse, onPress) => {
  return (
    <View>
      <Button
        title={status ? optionTrue : optionFalse}
        onPress={onPress}
      />
    </View>
  )
}

export default Toggle;