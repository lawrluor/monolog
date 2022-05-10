import React from 'react';
import { StyleSheet, View, Pressable  } from 'react-native';
import { Audio, Video } from 'expo-av';

import { FullPageSpinner } from './Spinner';

import { containers, dimensions } from '../styles';

type Props = {
  videoUri: string
  isPlaying: boolean,
  setIsPlaying: any,
}

const VideoPlayer = ({ videoUri, isPlaying, setIsPlaying }: Props): JSX.Element => {
  const video = React.useRef(null);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);  // TODO: set loading handling
  const [status, setStatus] = React.useState({'isPlaying': false});  // TODO: set props for status object

  const togglePlay = () => {
    status.isPlaying ? video.current.pauseAsync() : video.current.playAsync();
    setIsPlaying(!isPlaying);
  }

  // Clears previous recordings, does NOT record anything.
  const resetRecordingAudio = async () => {
    const recording = new Audio.Recording();
    try {
      console.log("Resetting recording");
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.stopAndUnloadAsync()
    } catch (error) {
      console.log("err resetting recording", error);
    }
  }
    
  // Audio settings for this video
  React.useEffect(() => {
    const setAudioModes = async () => {
      // console.log("-----1. VideoPlayer: setting audio modes");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
        playsInSilentModeIOS: true,       // this option is unreliable at the moment
        shouldDuckAndroid: false,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        playThroughEarpieceAndroid: false,
      });

      await resetRecordingAudio();

      await Audio.setIsEnabledAsync(false);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
        playsInSilentModeIOS: true,       // this option is unreliable at the moment
        shouldDuckAndroid: false,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        playThroughEarpieceAndroid: false,
      });

      await Audio.setIsEnabledAsync(true);

      
      if (video && video.current) {
        let status = await video.current.getStatusAsync();
        console.log("status", status);
        console.log("-----2. VideoPlayer: audio loaded, now playing video");
        await video.current.loadAsync({ uri: videoUri, volume: 1.0 });
        await video.current.playAsync();
        
      }
    }

    setAudioModes();

    // return () => {
    //   console.log("unmounting video player");
    //   video.current.stopAsync()
    //     .then()
    //     .catch((err: any) => {
    //       console.log("[ERROR] VideoPlayer: useEffect", err);
    //     });
        
    //   video.current.unloadAsync()
    //     .then()
    //     .catch((err: any) => {
    //       console.log("[ERROR] VideoPlayer: useEffect", err);
    //     });
    // }

    return () => {
      console.log("unmounting VideoPlayer");
      // crucial line: allows us to unmount audio for bug-free recording
      Audio.setIsEnabledAsync(false);  

      const unmount = async () => {
        try {
          await video.current.stopAsync();
          await video.current.unloadAsync();
        } catch(err: any) {
          console.log("[ERROR] VideoPlayer.tsx:useEffect", err)
        }
      }

      unmount();
    }
  }, []);

  const handlePlaybackStatusUpdate = (status: any) => {
    // Manual looping set: this is because setting prop isLooping in Video component directly causes freezing.
    // Reference: https://github.com/expo/expo/issues/3488
    if (status.didJustFinish && !status.isLooping) {
      if (video && video.current) {
        video.current.replayAsync();
        video.current.setIsLoopingAsync(true);
      }
    } else {
      setStatus(status);
    }
  }

  return (
    <>
      <View style={[styles.container, { display: isLoading || !status.isLoaded ? 'none' : 'flex'}]}>
        <Pressable onPress={togglePlay}>
          <Video
            ref={video}
            shouldPlay
            source={{ uri: videoUri }}
            style={styles.video}
            isMuted={false}
            useNativeControls={false}
            resizeMode="cover"
            onPlaybackStatusUpdate={(status) => handlePlaybackStatusUpdate(status)}
          />
        </Pressable>
      </View>

      {
        isLoading || !status.isLoaded
        ?
          <FullPageSpinner size="large" />
        :
        null 
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...containers.DEFAULT,
    // paddingTop: Constants.statusBarHeight,

  },
  video: {
    width: dimensions.width,
    height: dimensions.height
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

  // This useEffect is not currently used, but will handle sound not playing properly. 
  // Keep for now
  // useEffect(() => {
  //   Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

    // Tricks to fix that the audio doesn't work even if we set the configuration on iOS: `playsInSilentModeIOS`
    // See: https://github.com/expo/expo/issues/7485#issuecomment-852221060
  //   if (Platform.OS === 'ios') {
  //       const playSilentSound = async () => {
  //           await sound.loadAsync(require('./silent-sound.mp3'))
  //           await sound.playAsync()
  //           await sound.setIsLoopingAsync(true)
  //       }
  //       void playSilentSound()
  //   }

  //   // on component unmount
  //   return () => {
  //       void sound.stopAsync()
  //       void sound.unloadAsync()
  //   }
  // }, []

export default VideoPlayer;
