export type User = {
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  pronouns: string;
  pathways: Record<string, { currentLevel: number, timesCompleted: number }>;
  onboarded?: boolean;
  speechToTextPermission?: boolean;
  tutorialMode?: boolean;
  currentPathway?: string;
}