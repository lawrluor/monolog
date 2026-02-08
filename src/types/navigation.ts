import { type Video } from './video';

export type MainNavigationStackParamsList = {
  "AuthLoading": undefined;
  "AppStack": undefined;
  "AuthStack": undefined;
  "OnBoardingStack": undefined;
}

export type AuthStackParamsList = {
  "Signup": { setUser: (value: boolean) => void, setShouldOnboard: (value: boolean) => void };
  "Login": { setUser: (value: boolean) => void };
}

export type AppStackTabNavigatorParamsList = {
  "Gallery": undefined;
  "Recording": undefined;
  "Home": undefined;
  "Vistas": undefined;
  "Settings": undefined;
  "Pathways": undefined;
  "Feedback": undefined;
}

export type AppStackParamsList = {
  "Recording": undefined;
  "Player": { video: Video, showVideo?: boolean };
  "Rating": { fileBaseName: string, finalResult: string, isCameraOn: boolean };
  "Transcript": { selection: string, fileBaseName: string, finalResult: string, isCameraOn: boolean };
  "Pathways": undefined;
  "PathwayFull": { pathwayName: string };
  "PathwaysPrompt": { pathwayName: string, level: number };
  "TabNavigator": { screen?: keyof AppStackTabNavigatorParamsList } | undefined;
}

export type OnBoardingStackParamsList = {
  "OnBoarding1": undefined;
  "Landing": undefined;
}