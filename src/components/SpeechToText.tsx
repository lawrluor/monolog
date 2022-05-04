import React from 'react';
import { View, StyleSheet } from 'react-native';

import Voice from '@react-native-voice/voice';

import VideosContext from '../context/VideosContext';

import VideoCaption from './VideoCaption';

// TODO: Inherit stop/start state from parent (Recording) which toggles these states too.
const SpeechToText = ({ isRecording, getTranscriptResult }: any): JSX.Element => {
  const { userData, setUserData } = React.useContext(VideosContext);

  const [result, setResult] = React.useState('');
  const [textWithTimestamps, setTextWithTimestamps] = React.useState({});  // Not currently used
  const [recordingStartTime, setRecordingStartTime] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);

  const onSpeechRecognizedHandler = (e: any) => {
    console.log("SpeechToText.tsx: speech recognized", e);
  }

  const onSpeechStartHandler = (e: any) => {
    console.log("SpeechToText.tsx: speech start handler", e);
  }
  const onSpeechEndHandler = (e: any) => {
    setLoading(false);
    console.log("SpeechToText.tsx: speech stop handler", e);
  }

  const onSpeechResultsHandler = (e: any) => {
    let text = e.value[0];
    updateText(text);
    console.log("SpeechToText.tsx: speech result handler", e);
  }

  const startRecording = async () => {
    setRecordingStartTime(Date.now());
    setLoading(true);
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.log("SpeechToText.tsx: error while starting", error);
    }
  }
  
  // Wrapper for stopRecording, then navigate, to allow us to use the logic separately.
  // Called when the user would want to FINISH the recording process, then move on.
  const finishRecording = async () => {
    await stopRecording();
    getTranscriptResult(result.split(' '));  // updates parent state in Recording before it navigates to Rating
  }

  const stopRecording = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.log("SpeechToText.tsx: error while stopping", error);
    }
  }

  // Wrapper for setResult, so it can handle multiple states at once each time the text updates.
  // TODO: finish storing the text with timestamps object
  const updateText = (newText: string) => {
    const timeAtUpdate = Date.now() - recordingStartTime;
    
    let stateCopy = textWithTimestamps;
    stateCopy[`${timeAtUpdate}`] = newText;
    setTextWithTimestamps(stateCopy);
    
    // console.log(textWithTimestamps);
    // {
    //   '1645040443963': 'But yeah I feel like yeah you don\'t you ',
    //   '1645040444062': 'But yeah I feel like yeah you don\'t you shouldn\'t',
    //   '1645040444321': 'But yeah I feel like yeah you don\'t you shouldn\'t just',
    // }

    // console.log('result', result);
    setResult(newText);
  }

  // Setup: Links the respective user-defined handler functions to call when specific Voice events occur.
  React.useEffect(() => {
    setLoading(true);
    Voice.onSpeechStart = onSpeechStartHandler; 
    Voice.onSpeechRecognized = onSpeechRecognizedHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;
    setLoading(false);

    // on component unmount, destroy and remove listeners for speech 
    return () => {
      console.log("SpeechToText.tsx: unmounting, removing Voice listeners")
      Voice.destroy().then(Voice.removeAllListeners);
    }
  }, []);

  // Immediately get permissions from the user, just one time.
  // Once permissions are granted, we can set them. 
  // TODO: Try to set permissions through a callback in this component, 
      // but for now, we will set user data after they finish recording
      // This is because they can't have recorded without granting speech-to-text permission
  // The key is this happens BEFORE the user can press the video record button, so video recording is not interrupted
  // BUG: This makes it so that the speech to text starts BEFORE pressing the record button 
    // Essentially, stopRecording() does nothing to immediately stop it and await causes things to break
  // TODO: No method for this that I can find, so just start and stop immediately.
  React.useEffect(() => {
    if (userData && !userData.speechToTextPermission) {
      startRecording()
      stopRecording();  
    }
  }, []);

  React.useEffect(() => {
    if (isRecording === null) {
      // Reset state to default. User has neither loaded for the first time, or flipped camera.
      // could reset state if user flipped camera. Do we need special state for this?
      stopRecording();
      setResult('');
    } else if (isRecording) {
      // user has pressed the record button: begin recording
      startRecording();
    } else if (isRecording === false) {
      // user has stopped the record button, or time has ran out: finish recording and navigate next
      finishRecording();
      setUserData(Object.assign(userData, { 'speechToTextPermission': true }));
    }
  }, [isRecording]);

  return (
    result && !isLoading
    ?
    <View style={styles.container}>
      <VideoCaption text={result} />
    </View>
    :
    <></>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  }
});

export default SpeechToText;