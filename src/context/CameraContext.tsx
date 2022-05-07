import React from 'react';

const CameraContext = React.createContext(undefined!); 

import { Camera } from 'expo-camera';

import CameraView from '../components/CameraView';

export const CameraProvider: React.FC = ({ children }) => {
  const [cameraRef, setCameraRef] = React.useState<null | boolean>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const test = () => {
    <Camera
      type={Camera.Constants.Type.front}
      ref={(ref) => setCameraRef(ref)}
    >
    </Camera>
  }

  React.useEffect(() => {
    test()
  }, [])

  React.useEffect(() => {
    if (cameraRef) console.log("effect", cameraRef);
  }, [cameraRef])

  return (
    <CameraContext.Provider value={{ cameraRef, isLoading }}>
      {children}
    </CameraContext.Provider>
  )
}

export default CameraContext;