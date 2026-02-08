import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';

import { spacings } from '../styles';
import TextEntry, { PasswordEntry } from '../components/TextEntry';

type TextEntryGroupProps<T extends Record<string, string>> = {
  state: T;
  setState: React.Dispatch<React.SetStateAction<T>>;
  type: 'default' | 'password';
}

const TextEntryGroup = <T extends Record<string, string>>({ state, setState, type }: TextEntryGroupProps<T>) => {
  const stateNames = Object.keys(state) as Array<keyof T>;
  // Store refs in a ref to avoid recreating them on every render, but we need to initialize them once.
  const textRefs = React.useRef(stateNames.map(() => React.useRef<TextInput>(null))).current;

  const handleChange = (key: keyof T, value: string) => {
    setState((prev) => ({ ...prev, [key]: value } as T));
  };

  const handleSubmit = (nextIndex: number = 0, _currentIndex: number = 0, _text: string = '') => {
    if (nextIndex < textRefs.length) {
      textRefs[nextIndex]?.current?.focus();
    }
  };

  const renderEntries = () => {
    return stateNames.map((key, idx) => (
      <View key={String(key)} style={styles.textEntryContainer}>
        {type === 'password' ? (
          <PasswordEntry
            id={idx}
            label={String(key)}
            placeholderValue={String(key)}
            editable={true}
            secureTextEntry={true}
            returnKeyType="next"
            innerRef={textRefs[idx]}
            onChangeText={(_, val) => handleChange(key, val)}
            onFinish={handleSubmit}
            isTextBox={false}
          />
        ) : (
          <TextEntry
            id={idx}
            label={String(key)}
            placeholderValue={String(key)}
            editable={true}
            secureTextEntry={false}
            returnKeyType="next"
            innerRef={textRefs[idx]}
            textState={state[key] ?? ''}
            setTextState={(val) => {
              if (typeof val === 'function') {
                handleChange(key, val(state[key] ?? ''));
              } else {
                handleChange(key, val);
              }
            }}
            onFinish={handleSubmit}
            isTextBox={true}
          />
        )}
      </View>
    ));
  };

  return (
    <View style={styles.fieldContainer}>
      {renderEntries()}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    paddingVertical: spacings.HUGE,
    paddingHorizontal: spacings.MASSIVE
  },
  textEntryContainer: {
    marginVertical: spacings.MEDIUM
  }
})

export default TextEntryGroup;