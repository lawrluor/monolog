import React from 'react';
import { ScrollView, StyleSheet, View, Pressable, Text, TextInput, Platform, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';

import { Spinner } from './Spinner';
import CustomIcon from './CustomIcon';

import VideosContext from '../context/VideosContext';

import { writeFinalTranscript, getTranscriptContent } from '../utils/localStorageUtils';

import { dimensions, icons, text, spacings } from '../styles';

type Props = {
  setModalShown: any,
  modalShown: boolean,
  textContent: string,
  transcriptUri: string,
  date: string
}

// This component is a modal with text that pops up when when the full transcript should be revealed.
// Essentially, it is the transcript part itself that has been factored out, and is editable 
// Its props include modalShown and setModalShown, which come from the parent VideoPlayer component.
// and can set this to be visible or not visible depending on if the `show transcript` icon is pressed.
const TranscriptEditor = ({ setModalShown, modalShown, transcriptUri, date }: Props) => {
  const textRef = React.useRef();

  const { toggleVideosRefresh } = React.useContext(VideosContext);

  const [textIsEditable, setTextIsEditable] = React.useState<boolean>(false);
  const [pointerEvents, setPointerEvents] = React.useState('none');
  const [cachedStartingText, setCachedStartingText] = React.useState<string>('');
  const [text, setChangeText] = React.useState<string>('');
  const [editMade, setEditMade] = React.useState<boolean>(false);  // Flag
  const [isLoading, setIsLoading] = React.useState<boolean>(true);  // Ensure transcript fetched first

  // Get transcript content from local storage given the URI, and set contents 
  // If this is a new recording, the transcript file doesn't exist yet, so no contents from file 
  // Therefore, we use the textContent prop, which passes the newly created transcript 
  // text content from the Recording.
  // Else, simply set the transcript content to that which it reads from transcript file
  const setTranscriptContent = async () => {
    setIsLoading(true);
    let fetchedTranscriptContent = await getTranscriptContent(transcriptUri);
    setChangeText(fetchedTranscriptContent);  // Either the content, or "Error message" string
    setCachedStartingText(fetchedTranscriptContent);
    setIsLoading(false);
  }

  React.useEffect(() => {
    setTranscriptContent();
  }, []);

  const modalPressCallback = () => {
    setModalShown(!modalShown);
  }

  // Unfortunately, this does not seem to track updated states,
    // only using original state values at initialization, otherwise this would be an ideal solution
    // Basically, only when the keyboard is dismissed in any way would we save the transcript.
    // However, we can mimic this effect by adding a state editMade that changes whenever keyboard dismissed
  React.useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setEditMade(true)
    );
    
    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);
  
  React.useEffect(() => {
    // Only show save messages if changes have been made
    // console.log(`\nCached: ${cachedStartingText}\nEdited: ${text}`);
    if (editMade && cachedStartingText !== text) {
      disableEditing();
      saveTranscript();
    }
  }, [editMade])

  const disableEditing = () => {
    setTextIsEditable(false);
    setPointerEvents('none');
  }

  const saveTranscript = async () => {
    let transcriptWriteSuccess = await writeFinalTranscript(transcriptUri, text);
    if (transcriptWriteSuccess) {
      Alert.alert(
        "Success",
        "Transcript saved!",
        [
          {"title": "OK"}
        ]
      );
      
      console.log("transcript write success, refreshing videos:", transcriptWriteSuccess);
      setTranscriptContent();
      setEditMade(false);
      toggleVideosRefresh();
    }
  }

  const enableEditing = () => {
    setPointerEvents('auto');
    setTextIsEditable(true);

    // See: https://codedaily.io/tutorials/Focus-on-the-Next-TextInput-when-Next-Keyboard-Button-is-Pressed-in-React-Native
    textRef.current.focus();  
  }

  return (
    modalShown
    ?
      isLoading 
      ?
      <Spinner />
      :
      <Pressable style={styles.modalOutside} onPress={modalPressCallback}>
        <KeyboardAvoidingView 
          style={styles.textContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalDown}>
                <Pressable onPress={() => setModalShown(!modalShown)} style={({pressed}) => [{opacity: pressed ? 0.3 : 1}]}>
                  <CustomIcon name={'down_arrow_head'} style={styles.iconActions} />
                </Pressable>
              </View>

              <Pressable style={styles.editTextPressable} onLongPress={enableEditing} delayLongPress={250}>
                <View pointerEvents={pointerEvents}>
                  <Text style={styles.subTitle}>{date}</Text>
                  <TextInput
                    style={styles.body}
                    onChangeText={(text) => setChangeText(text)}
                    value={text}
                    multiline={true}
                    editable={textIsEditable}
                    ref={textRef}
                  />
                </View>
              </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
      </Pressable>
    :
    <></>
  )
}

const styles = StyleSheet.create({
  modalDown: {
    alignSelf: 'center',
  },
  body: {
    ...text.h4,
    color: 'white',
    zIndex: 0
  },
  subTitle: {
    ...text.h4,
    color: 'white',
    marginBottom: spacings.SMALL
  },
  textContainer: {
    padding: spacings.LARGE,
    top: 150,
    bottom: 0,
    borderTopLeftRadius: spacings.MEDIUM,
    borderTopRightRadius: spacings.MEDIUM,
    position: 'absolute',
    width: dimensions.width,
    backgroundColor: '#00000055'
  },
  // This is an additional modal that appears above the transcript editor modal
  // This modal is the full height of the screen, while the transcript one is ~70%
  // This exists so that pressing anywhere OUTSIDE the transcript modal 
  // will actually press this modal, which will toggle the modalShown state and hide the editor
  modalOutside: {
    height: dimensions.height
  },
  editTextPressable: {
    // DEBUG: Setting flex: 1 isn't enough to get this component to fill up its parent (textContainer)
    // Workaround: We increase the height to its parent's height, so that 
    // long-pressing anywhere in the modal will allow us to edit the transcript text
    // flex: 1,
    height: dimensions.height - (200 + spacings.LARGE)  
  },
  iconActions: {
    ...icons.MEDIUM,
    color: 'white'
  }
});

export default TranscriptEditor;