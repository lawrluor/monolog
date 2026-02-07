import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Audio, Video, type PlaybackStatus } from 'expo-av';

import { FullPageSpinner } from './Spinner';

import { containers, dimensions } from '../styles';
import AudioOverlay from '../components/AudioOverlay';
import AudioBubbles from '../components/AudioBubbles';

type Props = {
  showVideo: boolean,
  videoUri: string,
  isPlaying: boolean,
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
}

// showVideo is a string that determines whether AudioOverlay.tsx is displayed
// over the video.
const VideoPlayer = ({ videoUri, isPlaying, setIsPlaying, showVideo }: Props): JSX.Element => {
  const video = React.useRef<Video>(null);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);  // TODO: set loading handling
  const [status, setStatus] = React.useState({ 'isPlaying': false });  // TODO: set props for status object

  const togglePlay = () => {
    status.isPlaying ? video?.current?.pauseAsync() : video?.current?.playAsync();
    setIsPlaying(!isPlaying);
  }

  // Clears previous recordings, does NOT record anything.
  const resetRecordingAudio = async () => {
    const recording = new Audio.Recording();
    try {
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.stopAndUnloadAsync()
    } catch (error) {
      console.error("Error resetting recording", error);
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

      if (video?.current) {
        await video.current.loadAsync({ uri: videoUri });
        await video.current.playAsync();
      }
    }

    setAudioModes();

    return () => {
      // crucial line: allows us to unmount audio for bug-free recording
      Audio.setIsEnabledAsync(false);

      const unmount = async () => {
        try {
          await video?.current?.stopAsync();
          await video?.current?.unloadAsync();
        } catch (err: Error | unknown) {
          console.error("[ERROR] VideoPlayer.tsx:useEffect", err)
        }
      }

      unmount();
    }
  }, []);

  const handlePlaybackStatusUpdate = (status: PlaybackStatus) => {
    // Manual looping set: this is because setting prop isLooping in Video component directly causes freezing.
    // Reference: https://github.com/expo/expo/issues/3488
    if (status.didJustFinish && !status.isLooping) {
      if (video?.current) {
        video.current.replayAsync();
        video.current.setIsLoopingAsync(true);
      }
    } else {
      setStatus(status);
    }
  }

  // We render AudioOverlay if we should not show the video.
  const renderAudioOverlay = (showVideo: boolean) => {
    return (
      showVideo &&
      <View style={styles.audioOverlayContainer}>
        <AudioOverlay>
          {isPlaying && <AudioBubbles shouldBegin={isPlaying} />}
        </AudioOverlay>
      </View>
    )
  }

  return (
    <>
      <View style={[styles.container, { display: isLoading ? 'none' : 'flex' }]}>
        <Pressable onPress={togglePlay}>
          {renderAudioOverlay(showVideo)}

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

      {isLoading && <FullPageSpinner size="large" />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...containers.DEFAULT,
    // paddingTop: Constants.statusBarHeight,

  },
  audioOverlayContainer: {
    width: dimensions.width,
    height: dimensions.height
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
