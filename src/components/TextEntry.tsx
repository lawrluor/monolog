import React, { useEffect } from 'react';
import { View, Pressable, Text, TextInput, StyleSheet} from 'react-native';
import { colors, spacings, text, sizes, debug, dimensions } from '../styles';

type Props = {
  children?: any,
  label?: string,
  keyboardType?: string,
  editable: boolean,
  secureTextEntry?: boolean,  // similar to type union undefined | boolean
  placeholderValue?: string,
  returnKeyType?: string,
  isTextBox?: boolean,
  onFinish?: Function,
  autoCapitalize?: string
}

const TextEntry = ({ children, textState, setTextState, id, innerRef, label, autoCapitalize, editable, keyboardType, secureTextEntry, placeholderValue, returnKeyType, isTextBox, onChangeText, onFinish }: Props): JSX.Element => {
    return (
    <>
      {label
      ?
      <Text style={styles.label}>{label}</Text>
      :
      null}

      <TextInput
        ref={innerRef}
        keyboardType={keyboardType}
        value={textState}
        onChangeText={setTextState}
        editable={editable}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        underlineColorAndroid={'transparent'}
        secureTextEntry={secureTextEntry || false}
        maxLength={50}
        placeholder={placeholderValue || ""}
        placeholderTextColor={colors.TERTIARY}
        returnKeyType={returnKeyType || 'done'}
        onSubmitEditing={() => onFinish(id+1, id, text) || null}  // id+1 will focus on next TextEntry
        style={isTextBox ? styles.fieldBox : styles.field}
        onFinish={onFinish}
      >
      </TextInput>
    </>
  )
}

export const SearchEntry = ({ children, editable, keyboardType, secureTextEntry, placeholderValue, returnKeyType, onBlur, onFinish, modalShown, setModal }: any): JSX.Element => {
  // const [hasEdited, setHasEdited] = React.useState<boolean>(false);
  const [iconPlaceholder, setIconPlaceholder] = React.useState<boolean>(false);
  const [text, setText] = React.useState<string>("");

  const textRef = React.createRef();

  // Sample keywords that will signal to users that they can search videos by keyword
  const defaultQueryPlaceholder: string = "Search: 'improve', 'balance' ";

  console.log(`modalShown: ${modalShown}`);

  const focus = () => {
    console.log(`Textbox focused, text: ${text}`);
    // Whenever textbox is focused, hide icon (hide placeholder)
    // We need this "custom placeholder" functionality because icon can't go directly into TextInput
    setIconPlaceholder(false);
  }

  const blur = () => {
    console.log(`Text unfocused, text: ${text}`);
    // Whenever textbox unfocuses, check if anything was searched
    // If a search exists, do nothing (keep the search text)
    // If no search was made (user deleted search text or never typed any), return the placeholder

    // TODO: do we always query, or only when search is not empty?
    // Perhaps this component shouldn't be making the above decision, but instead a parent or context
    if (text==="") {
      setModal(false);  // Don't minimize searchbox if a term has been searched
    }

    onFinish(text);
  }

  // TODO: unable to unfocus properly from the "search screen"
  useEffect(() => {
    modalShown ? textRef.current.focus() : null;
  }, [modalShown]); // only refocus if the modal is showing

  return (
    <View style={styles.searchContainer}>
      <TextInput
        ref={textRef}
        value={text}
        editable={editable}
        autoCapitalize="none"
        autoCorrect={false}
        underlineColorAndroid={'transparent'}
        secureTextEntry={secureTextEntry || false}
        maxLength={50}
        placeholder={placeholderValue || defaultQueryPlaceholder}
        placeholderTextColor={colors.TERTIARY}
        returnKeyType={returnKeyType || 'done'}
        onSubmitEditing={() => onFinish(text)}  // id+1 will focus on next TextEntry
        onFocus={focus}
        onBlur={blur}
        onChangeText={setText}
        style={styles.searchBox}
      >
        {(text==="" && iconPlaceholder) ? children : null}
      </TextInput>
    </View>
  )
}

// TODO: attempting to edit text AFTER onBlur/submitting text clears the textbox. Not happening for other TextEntry components
export const PasswordEntry = ({ label, id, innerRef, onChangeText, editable, secureTextEntry, placeholderValue, returnKeyType, isTextBox, onFinish }: Props): JSX.Element => {
  const [isSecure, setIsSecure] = React.useState<boolean|undefined>(secureTextEntry);
  const [text, setText] = React.useState<string>("");

  // Updates both parent state and the state of this TextEntry
  // Technically, we could just use the parent state,
  // but this allows flexibility if we don't want parent state to always update
  // See explanation in SignUp.tsx, onChangeText function
  const setTextStates = (changedTextValue: string) => {
    setText(changedTextValue);  // update self state
    onChangeText(id, changedTextValue);  // update parent state by state id
  }

  return (
    <View style={styles.passwordEntry}>
      {label
      ?
      <Text style={styles.label}>{label}</Text>
      :
      null}

      <View>
        <TextInput
          ref={innerRef}
          value={text}
          editable={editable}
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid={'transparent'}
          secureTextEntry={isSecure || false}
          maxLength={50}
          placeholder={placeholderValue || ""}
          placeholderTextColor={colors.TERTIARY}
          returnKeyType={returnKeyType || 'done'}
          onSubmitEditing={onFinish || null}
          onChangeText={(changedTextValue) => setTextStates(changedTextValue)}
          style={isTextBox ? styles.fieldBox : styles.field}
        />

        <Pressable onPress={() => {setIsSecure(!isSecure)}} style={ ({pressed}) => [styles.showPasswordContainer, {opacity: pressed ? 0.3 : 1}] }>
          {
            isSecure
            ?
            <Text style={styles.showPassword}>Show</Text>
            :
            <Text style={styles.showPassword}>Hide</Text>
          }
        </Pressable>
      </View>
    </View>
  )
}

// This component is a larger, multiline text input for paragraph style entry.
// NOTE: returnKeyType sets the return key to a new line char instead of finish when multiline=true
// Can disable this behavior by explicitly setting property blurOnSubmit=true for a multiline TextInput
export const TextArea = ({ value, onChange, editable, placeholder }: any) => {
  return (
    <TextInput
      value={value}
      style={textAreaStyles.textArea}
      editable={editable}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={colors.TERTIARY}
      multiline={true}
    >
    </TextInput>
  )
}

const styles = StyleSheet.create({
  label: {
    ...text.h4,
    marginBottom: spacings.MEDIUM
  },
  field: {
    ...text.h4,
    color: colors.SECONDARY,
    borderBottomWidth: 1,
    borderBottomColor: colors.BACKGROUND,
  },
  fieldBox: {
    ...text.h4,
    color: colors.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.BACKGROUND,
    backgroundColor: colors.BACKGROUND,
    width: sizes.SCREEN_WIDTH_66,
    borderRadius: 15,
    padding: spacings.LARGE,
    shadowColor: '#000000',
    shadowOffset: { width: 5, height: 5},
    shadowOpacity: 0.2
  },
  searchBox: {
    ...text.h4,
    color: colors.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    width: Math.min(sizes.SCREEN_WIDTH_66, 800),
    aspectRatio: 7 / 1,
    borderRadius: sizes.HUGE / 2,
    borderWidth: 1,
    borderColor: colors.BACKGROUND,
    backgroundColor: colors.BACKGROUND,
    paddingLeft: spacings.LARGE,
    shadowColor: '#000000',
    shadowOffset: { width: 5, height: 5},
    shadowOpacity: 0.2
  },
  searchContainer: {
    justifyContent: 'center'
  },
  showPassword: {
    ...text.h5,
  },
  showPasswordContainer: {
    alignSelf: 'flex-end',
    position: 'absolute'
  },
  searchIconContainer: {
    ...debug,
    position: 'absolute',
    left: spacings.MEDIUM,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  }
});

const textAreaStyles = StyleSheet.create({
  textArea: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.BACKGROUND,
    aspectRatio: 4 / 1,
    backgroundColor: colors.BACKGROUND,
    shadowColor: '#000000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.2,
    borderRadius: 20,
    lineHeight: 16,
    paddingHorizontal: spacings.LARGE,
    paddingTop: spacings.MEDIUM
  },
})

export default TextEntry;
