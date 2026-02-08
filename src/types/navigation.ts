import { type Video } from './video';

export type MainNavigationStackParamsList = {
  "AuthLoading": undefined;
  "AppStack": undefined;
  "AuthStack": undefined;
  "OnBoardingStack": undefined;
}

export type AuthStackParamsList = {
  "Signup": undefined;
  "Login": { setUser: (value: boolean) => void };
}

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

export type OnBoardingStackParamsList = {
  "OnBoarding1": undefined;
  "Landing": undefined;
}