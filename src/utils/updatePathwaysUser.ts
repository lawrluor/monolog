import React from 'react';
import UserContext from '../context/UserContext';
import { readUserData, writeUserData } from '../utils/localStorageUtils';

// When the user reaches transcript page to increment the scores on their pathways
export const incrementUserProgress = async (pathwayName: string) => {
  let currentUserData = await readUserData();
  let allPathwayProgress = currentUserData['pathways']
  let currentPathwayProgress = currentUserData['pathways'][pathwayName]

  const MAX_LEVELS = 10;
  if (typeof currentPathwayProgress !== 'undefined') {  // If user already has data for pathway, increment progress
    if (currentPathwayProgress['currentLevel'] >= MAX_LEVELS) {
      allPathwayProgress[pathwayName] = {
        "numTimesCompleted": ++currentPathwayProgress['numTimesCompleted'],
        "currentLevel": 1,
      }
    } else {
      allPathwayProgress[pathwayName] = {
        "numTimesCompleted": currentPathwayProgress['numTimesCompleted'],
        "currentLevel": ++currentPathwayProgress['currentLevel'],
      }
    }
  } else {   // When user doesn't have any progress, add the pathway and increment it
    allPathwayProgress[pathwayName] = {
      "numTimesCompleted": 0,
      "currentLevel": 2,
    }
  }
  // console.log(allPathwayProgress)
  // console.log(currentUserData)
  
  let updatedUser = Object.assign(currentUserData, currentUserData[allPathwayProgress])
  await writeUserData(updatedUser)
  console.log( await readUserData())
  return updatedUser;
}

// Any time user goes to prompt page set the users current pathway
// to differenciate in the gallery which recordings are pathway recordings
export const updateCurrentPathway = async (pathwayName: string) => {
  let currentUserData = await readUserData();
  let newUserData = {
    'currentPathway': pathwayName,
  }
  newUserData = Object.assign(currentUserData, newUserData);
  await writeUserData(newUserData);
  return newUserData;
}

export const removeCurrentPathway = async () => {
  let currentUserData = await readUserData();
  let newUserData = {
    'currentPathway': "",
  }
  newUserData = Object.assign(currentUserData, newUserData);
  await writeUserData(newUserData);
  return newUserData;
}
