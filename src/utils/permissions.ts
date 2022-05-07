import { Camera } from 'expo-camera';

import { readUserData, writeUserData } from '../utils/localStorageUtils';

const getCameraPermissions = async () => {
  const { status } = await Camera.requestCameraPermissionsAsync();
  return status === 'granted';
}

const getMicPermissions = async () => {
  const { status } = await Camera.requestMicrophonePermissionsAsync();
  return status === 'granted';
}

export const checkCameraPermissions = async () => {
  let currentUserData = await readUserData();
  return currentUserData.cameraPermission;
}

export const checkMicPermissions = async () => {
  let currentUserData = await readUserData();
  return currentUserData.micPermission;
}

export const getRecordingPermissions = async () => {
  // Return if already have recording permissions 
  if (await checkRecordingPermissions()) return;

  let currentUserData = await readUserData();

  let newUserData = {
    cameraPermission: await getCameraPermissions(),
    micPermission: await getMicPermissions()
  }

  newUserData = Object.assign(currentUserData, newUserData);
  await writeUserData(newUserData);
  return newUserData;
}

export const checkRecordingPermissions = async () => {
  return (await checkCameraPermissions() && await checkMicPermissions());
}


