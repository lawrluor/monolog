import React from 'react';
import { StyleSheet, View } from 'react-native';

import { spacings } from '../styles';

import TextEntry, { PasswordEntry } from '../components/TextEntry';


// The TextEntryGroup state is an object that holds state and initial value for each child TextEntry
// Every TextEntry can be instantiated with a single TextEntryGroup instead of 4 separate state variables per text input.
  // This means we will have to programmatically generate:
  // 0. reducer function
  // 1. textRefs: the array of text refs
  // 2. JSX for TextEntry components. Can be complex due to a mixture of TextEntry elements
      // To alleviate this, we can use multiple TextEntryGroup containers in a single component
      // For example, SignUp can have a TextEntryGroup for plaintext states and another TextEntryGroup for password states

const TextEntryGroup = React.forwardRef(( { initialState, type }, ref): JSX.Element => {
  const stateNames:string[] = Object.keys(initialState);  // Extract just the array of string state names 

  // calls to dispatch() are processed here
  // action.type is the state name, action.payload is the new value to be assigned to that state
  const textInputReducer = (state, action) => {
    let stateType = stateNames[action.type];
    return {...state, [stateType]: action.payload }  // [stateType] ensures use of the variable, instead of literal string 'stateType'
  }

  const [state, dispatch] = React.useReducer(textInputReducer, initialState);
  const textRefs = stateNames.map(() => React.createRef());

  // See: https://stackoverflow.com/questions/27864951/how-to-access-a-childs-state-in-react
  // 1. This, combined with forwardRef(), allows us to directly access this component's state from a parent component
  // 2. Although a more React-y way to do this is to define and pass the state to this component from the parent,
    // not doing this because that would require me to define all the state and reducer logic in the parent component 
  // 3. That would defeat the purpose of extracting the holistic state logic to the TextEntryGroup in the first place
  // 4. There may be a way to handle this more gracefully using React hooks, but for now this seems like the best solution
  React.useImperativeHandle(ref, () => ({getState: () => {return state}}), [state]);

  // Handles logic for selecting the next TextEntry based on the current ref id
  // Check range before focusing on next TextEntry to avoid out-of-bounds errors
  // If out-of-bounds, meaning all TextEntries on the component have been finished, will not attempt to focus on a non-existent TextEntry
  const selectTextRef = (index: number) => {
    if (index < textRefs.length) {
      textRefs[index].current.focus();
    }
  }

  // Called after TextEntry is submitted done or is blurred
  // Updates state using reducer, which has action.type referring to which state to update, and action.payload for the value to store
  // Then, uses selectTextRef to refocus on the next/following text entry

  // nextTextRef is passed as id+1. 
  // TODO: Manage the currently focused TextEntry (text ref) in state from TextEntryGroup and pass down to each child TextEntry
  // TODO: try to validate the bounds of id+1 earlier
  const submitTextEntry = (nextTextRef: number, stateId: number, changedTextValue: string) => {
    dispatch({ type: stateId, payload: changedTextValue });    
    selectTextRef(nextTextRef);
    // setCurrentTextRef(currentTextRef + 1);  // TODO: Wrap further for bounds
  }

  // OPTIONAL: Can use this function to update the parent state EACH time the text entry updates (i.e. after each character typed)
  // Usually, the text entry will only update the parent state AFTER clicking "done" or on blur, calling submitTextEntry()
  // Can be useful if trying to give immediate feedback for user's text entries 
  // Example: immediately showing that a password is valid or invalid
  // Therefore, we use this callback in PasswordEntry, where immediate feedback is useful
  const onChangeText = (stateId: number, changedTextValue: string) => {
    dispatch({ type: stateId, payload: changedTextValue });  
  }

  // TODO Optional: Have two separate functions, renderTextEntries and renderPasswordEntries 
  // These could be passed in as a prop (which would be a flag), which has a downside of adding complexity to the parent
  // OR, create a 3rd parent that is not directly used but that these two components inherit from
  const renderTextEntries = () => {
    let stateNames = Object.keys(initialState);  // first extract list of object keys, which are the names of the states
    // TODO: map the internal names of the state to the display names, or add literal mapping data to the main state itself

    
    switch(type) {
      case 'password':
        return stateNames.map((name: string, idx: number) => <View style={styles.textEntryContainer}><PasswordEntry key={idx} id={idx} label={name} placeholderValue={name} editable={true} secureTextEntry={true} returnKeyType="next" innerRef={textRefs[idx]} onChangeText={onChangeText} onFinish={submitTextEntry}/></View> )
      default:
        return stateNames.map((name: string, idx: number) => <View style={styles.textEntryContainer}><TextEntry key={idx} id={idx} label={name} placeholderValue={name} editable={true} secureTextEntry={false} returnKeyType="next" innerRef={textRefs[idx]} onFinish={submitTextEntry}/></View> )
    }
  }

  return (
    <View style={styles.fieldContainer}>
      {renderTextEntries()}
    </View>
  )
})

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