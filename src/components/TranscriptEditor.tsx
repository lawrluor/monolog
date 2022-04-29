import React from 'react';
import { ScrollView, StyleSheet, View, Pressable, Text, TextInput, Platform, KeyboardAvoidingView } from 'react-native';

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
const TranscriptEditor = ({ setModalShown, modalShown, textContent, transcriptUri, date }: Props) => {
  const textRef = React.useRef();

  const { toggleVideosRefresh } = React.useContext(VideosContext);

  const [textIsEditable, setTextIsEditable] = React.useState(false);
  const [pointerEvents, setPointerEvents] = React.useState('none');
  const [text, setChangeText] = React.useState('');

  // TODO: Handle Captions.
  // TODO: Allow updating mood selection inside this component,
  // or creating separate MoodSelector component that is embedded here.
  React.useEffect(() => {
    // Get transcript content from local storage given the URI, and set contents 
    // If this is a new recording, the transcript file doesn't exist yet, so no contents from file 
    // Therefore, we use the textContent prop, which passes the newly created transcript 
    // text content from the Recording.
    // Else, simply set the transcript content to that which it reads from transcript file
    const setTranscriptContent = async () => {
      let fetchedTranscriptContent = await getTranscriptContent(transcriptUri);

      if (fetchedTranscriptContent) {
        console.log("fetching transcript content");
        setChangeText(fetchedTranscriptContent);
      } else {
        console.log("No transcript content found, setting to basic textContent");
        setChangeText(textContent);
      }
    }

    setTranscriptContent();
  }, []);

  const disableEditing = async () => {
    setTextIsEditable(false);
    setPointerEvents('none');

    // TODO: use a .then on writeFinalTranscript instead of returning boolean?
    let transcriptWriteSuccess = await writeFinalTranscript(transcriptUri, text);
    if (transcriptWriteSuccess) {
      console.log("transcript write success, refreshing videos:", transcriptWriteSuccess);
      toggleVideosRefresh();
    }
  }

  const enableEditing = () => {
    setPointerEvents('auto');
    setTextIsEditable(true);

    // See: https://codedaily.io/tutorials/Focus-on-the-Next-TextInput-when-Next-Keyboard-Button-is-Pressed-in-React-Native
    textRef.current.focus();  
  }

  React.useEffect(() => {
    // Whenever modalShown changes (transcript is shown or hidden), save transcript 
    // TODO: refactor into single function for reusability
    let transcriptWriteSuccess = writeFinalTranscript(transcriptUri, text);
    if (transcriptWriteSuccess) {
      console.log("transcript write success, refreshing videos:", transcriptWriteSuccess);
      toggleVideosRefresh();
    }
  }, [modalShown]);

  return (
    modalShown
    ?
    <Pressable style={styles.modalOutside} onPress={() => setModalShown(!modalShown)}>
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
                  onEndEditing={disableEditing}
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