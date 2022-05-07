import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Alert } from 'react-native';

import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import VideosContext from '../context/VideosContext';

import { checkRecordingPermissions } from '../utils/permissions';
import { VIDEO_DIRECTORY, THUMBNAIL_DIRECTORY } from '../utils/localStorageUtils';

import { text, containers, colors, icons, spacings, dimensions } from '../styles';

import PulseAnimation from '../components/PulseAnimation';
import GoBack from '../components/GoBack';
import SpeechToText from '../components/SpeechToText';
import CustomIcon from '../components/CustomIcon';
import { FullPageSpinner } from '../components/Spinner';

const MAX_DURATION = 600;  // seconds

// NOTE: This component unmounts completely when blurred. See AppStack => TabScreen.Recording 
export const Recording = ({ navigation }: any): JSX.Element => {
  const { userData, setUserData } = React.useContext(VideosContext);

  // TODO: experiment with adding loading states (carefully) to improve UX
  const cameraRef = React.useRef(null);
  const [finalTranscript, setFinalTranscript] = React.useState<string>('');
  const [recordingFinished, setRecordingFinished] = React.useState<boolean>(false);
  const [hasPermission, setHasPermission] = React.useState<null | boolean>(true);
  const [type, setType] = React.useState(Camera.Constants.Type.front);
  const [isRecording, setIsRecording] = React.useState<null | boolean>(null);
  const [videoStorePath, setVideoStorePath] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const timestamp = Math.floor(Date.now() / 1000);   // TODO: Make accurate to start button press

  // Setup: Get permissions for camera from user first
  React.useEffect(() => {
    const asyncWrapper = async () => {
      // At this point, user should already have permissions from Home unless it was denied earlier
      // TODO: if they still don't have permissions, two options
      // Request recording permissions here: recording tends to fail in this case
      // OR send them back to home and request permissions again there
      // NOTE: Expo seems to ask one more permission for some reason

      await setHasPermission(await checkRecordingPermissions()); 
    }

    asyncWrapper();

    // TODO: Handle cleanup before unmount using navigation.addListener?
    // See https://reactnavigation.org/docs/navigation-events/#navigationaddlistener
    return () => {}
  }, []);

  // "Callback method" for when the final transcript is ready.
  // Note: isRecording must be false, meaning stopRecording() was explicitly called.
  // Otherwise, if isRecording is just null, means that we have not begun recording,
    // or we have simply switched the camera type between front or back.
  React.useEffect(() => {
    if ((finalTranscript.length > 0) &&
        (videoStorePath.length > 0) && 
        (recordingFinished) && 
        (isRecording === false)) {

      // finalTranscript has been updated, meaning we have the final transcript result passed up from SpeechToText
      // Now we can move to the next page with the final transcript result
      // Clean up and reset state
      navigateToRating();
    }
  }, [finalTranscript, videoStorePath]);

  const flipCameraCallback = () => {
    const flipCamera = () => {
      setIsRecording(null);

      setType(
        type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
      );
    }
    
    if (!userData || userData.tutorialMode) {
      // First time user does this, notify them
      Alert.alert(
        "Please Note",
        "Flipping the camera will stop any ongoing recording.",
        [
          { 
            text: "Cancel",
          },
          { 
            text: "Continue",
            onPress: flipCamera
          }
        ]
      );

      // TODO: can make a specific state for this, like flipCameraNotified
      setUserData(Object.assign(userData, { tutorialMode: false }))
    } else {
      // User already knows this, let them flip the camera at will
      flipCamera();
    }
  }

  const startRecording = async () => {
    try {
      if (cameraRef){
        setIsRecording(true);
        let video = await cameraRef.current.recordAsync({ maxDuration: MAX_DURATION });

        // Create video and thumbnail files.
        let timestamp = Math.floor(Date.now() / 1000);
        let videoStorePath = VIDEO_DIRECTORY + timestamp.toString() + ".mov";
        setVideoStorePath(videoStorePath);

        // Handles the logic for extracting the video from storage and saving thumbnail
        FileSystem.copyAsync({'from': video.uri, 'to': videoStorePath }).then(
          () => {
            VideoThumbnails.getThumbnailAsync(
              videoStorePath,
              { time: 0 }
            ).then(
              ( { uri } ) => {
                let thumbnailPath = THUMBNAIL_DIRECTORY +
                  timestamp.toString() + ".jpg";
                FileSystem.copyAsync({'from': uri, 'to': thumbnailPath });
              }
            ).catch(
              error => {
                console.log("Recording:getThumbnailAsync:", error);
              }
            )
          }
        )
      }
     } catch(err){
        console.log(err);
     }
  };

  // Currently unused, as opting for no direct "return to gallery" button
  const navigateToGallery = () => {
    navigation.navigate('Gallery');
  }

  const navigateToRating = () => {
    navigation.navigate('Rating', {
      finalResult: finalTranscript,
      fileBaseName: timestamp.toString(),
    });
  }

  const getTranscriptResult = (result: string) => {
    setFinalTranscript(result);
  }

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      cameraRef.current.pausePreview();
      await cameraRef.current.stopRecording();  
    } catch(err: any) {
      console.log("[ERROR] Recording.tsx: stopRecording", err);
    }
  }

  // Distinguishes between user actually pressing the stop button,
  // while stopRecording is called in any other event that the recording stops.
  const finishRecording = async () => {
    setRecordingFinished(true);
    stopRecording();
  }

  // Renders an icon that takes you to Gallery when pressed 
  // Currently not used, as this feature is not requested right now
  const renderGalleryIcon = () => {
    return (
      <Pressable onPress={navigateToGallery} style={({pressed}) => [{opacity: pressed ? 0.3 : 1}]}>
        <MaterialCommunityIcons name={'folder-multiple-image'} style={[icons.MEDIUM, { color: 'white' }]} />
      </Pressable>
    )
  }

  // Renders options to select recording length (time in seconds) in a ScrollView
  // Currently not used, as this feature is not requested right now
  const renderRecordOptions = (recording: boolean) => {
    return (
      isRecording
      ?
      <View style={styles.scrollContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentOffset={{x: 0, y: 0}}
        >
          <View style={styles.numberButtonContainer}><Pressable><Text style={styles.numbersText}>15</Text></Pressable></View>
          <View style={styles.numberButtonContainer}><Pressable><Text style={styles.numbersText}>30</Text></Pressable></View>
          <View style={styles.numberButtonContainer}><Pressable><Text style={styles.numbersText}>60</Text></Pressable></View>
        </ScrollView>
      </View>
      :
      <></>
    )
  }

  const renderRecordIcon = () => {
    return (
      isRecording
      ?
      <PulseAnimation>
        <Pressable onPress={finishRecording} style={({pressed}) => [{opacity: pressed ? 0.3 : 1}, styles.recordIcon]}>
          <View style={styles.centeredContainer}>
            <View style={styles.recordCircleOutline}></View>
            <View style={styles.recordSquare}></View>
          </View>
        </Pressable>
      </PulseAnimation>
      :
      <Pressable onPress={startRecording} style={({pressed}) => [{opacity: pressed ? 0.3 : 1}]}>
        <View style={styles.centeredContainer}>
          <View style={styles.recordCircleOutline}></View>
          <View style={styles.recordCircle}></View>
        </View>
      </Pressable>
    )
  }

  const resetNavigator = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }] 
    });

    navigation.navigate('Home');
  }

  const renderCamera = () => {
    if (hasPermission === null) {
      return <View />;
    } else if (hasPermission === false) {
      return (<View style={styles.centeredContainer}><Text>No access to camera or microphone.</Text></View>);
    } else {
      return (
        <>
          <GoBack navigation={navigation} />

          <View style={styles.flipCameraContainer}>
            <Pressable onPress={flipCameraCallback} style={({pressed}) => [{opacity: pressed ? 0.3 : 1}]}>
              <CustomIcon name='flip_camera' style={styles.flipCameraIcon} />
            </Pressable>
          </View>

          <Camera
            style={styles.cameraContainer}
            type={type}
            ref={cameraRef}
            onCameraReady={() => setIsLoading(false) }
          >
            <View style={styles.captionContainer}>
              <SpeechToText isRecording={isRecording} getTranscriptResult={getTranscriptResult}/>
            </View>

            <View style={styles.recordContainer}>
              {/* {renderGalleryIcon()} */}
              {renderRecordIcon(isRecording)}
            </View>

            {/* {renderRecordOptions(isRecording)} */}
          </Camera>
        </>
      );
    }
  }

  // The camera itself takes a while to load
  // Waiting for cameraRef to not be null doesn't seem to work
  // It seems that the <Camera /> component and useRef needs to be loaded first 
  // Therefore, we still load the Camera component, but hide the display until loaded
  // The callback onCameraReady on Camera component sets our loading state
  return (
    <>
      <View style={[styles.container, {display: isLoading ? 'none' : 'flex'}]}>
        {renderCamera()}
      </View>
      
      {
        isLoading 
        ? 
        <FullPageSpinner size="large" />
        : 
        null
      }
    </>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    ...containers.DEFAULT,
    flex: 1
  },
  container: {
    ...containers.DEFAULT
  },
  centeredContainer: {
    ...containers.DEFAULT,
    justifyContent: "center",
    alignItems: "center"
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  // Similar to Gallery record button
  // TODO: Consider refactoring to common component
  recordContainer: {
    position: 'absolute',
    width: "100%",
    bottom: dimensions.height / 10,
  },
  // Currently unused, as the record button is just a circular View at the moment rather than an icon
  // recordIcon: {
  //   ...icons.HUGE,
  //   fontSize: 76,
  //   color: colors.BACKGROUND,
  //   borderWidth: 5,
  //   borderColor: 'red',
  // },
  recordCircleOutline: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'white',
    width: icons.LARGE.fontSize + 15,
    height: icons.LARGE.fontSize + 15,
    borderRadius: icons.HUGE.fontSize / 2,  // to make a circle border, borderRadius = width / 2
  },
  recordCircle: {
    backgroundColor: 'red',
    width: icons.LARGE.fontSize,
    aspectRatio: 1,
    borderRadius: icons.LARGE.fontSize / 2,  // to make a circle border, borderRadius = width / 2
  },
  recordSquare: {
    backgroundColor: 'red',
    aspectRatio: 1,
    borderRadius: 4,  // to make a circle border, borderRadius = width / 2
    width: icons.MEDIUM.fontSize + 5,
  },
  stopIcon: {
    ...icons.HUGE,
    fontSize: icons.HUGE.fontSize - 25,
    color: 'red'
  },
  flipCameraContainer: {
    position: 'absolute',
    right: spacings.MASSIVE,
    top: spacings.ABSOLUTE_OFFSET_MEDIUM,
    zIndex: 100
  },
  flipCameraIcon: {
    ...icons.MEDIUM,
    color: "white"
  },
  captionContainer: {
    display: 'none',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: spacings.MEDIUM,
    top: 150,
    right: 0,
    bottom: 0,
    left: 0,
    // zIndex: 999
  },
  numbersText: {
    ...text.p,
    color: 'white',
  },
  // TODO: make the scroll container's left side start at exactly center?
  scrollContainer: {
    position: 'absolute',
    // borderWidth: 1,
    // borderColor: 'white',
    width: "100%",
    bottom: spacings.ABSOLUTE_OFFSET_LARGE,
    left: dimensions.width / 2,
  },
  numberButtonContainer: {
    marginHorizontal: spacings.LARGE,
  }
});

export default Recording;
