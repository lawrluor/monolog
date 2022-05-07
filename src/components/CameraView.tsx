import React from 'react';

import { Camera } from "expo-camera"

const CameraView = ({ children }: any) => {
  return (
    <Camera
      type={Camera.Constants.Type.front}
      ref={(ref) => setCameraRef(ref)}
    >
      {children}
    </Camera>
  )
}

export default CameraView;