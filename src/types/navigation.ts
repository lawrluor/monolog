import { type Video } from './video';

export type AppStackTabNavigatorParamsList = {
  "Gallery": undefined,
  "Recording": undefined,
  "Home": undefined,
  "Vistas": undefined,
  "Settings": undefined,
  "Pathways": undefined,
  "Feedback": undefined
}

export type AppStackParamsList = {
  "Recording": undefined,
  "Player": { video: Video },
  "Rating": undefined,
  "Transcript": undefined,
  "Pathways": undefined,
  "PathwayFull": undefined,
  "PathwaysPrompt": undefined,
  "TabNavigator": { screen?: keyof AppStackTabNavigatorParamsList } | undefined
}


