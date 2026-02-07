export type User = {
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  pronouns: string;
  pathways: Record<string, { currentLevel: number }>;
  onboarded?: boolean;
  speechToTextPermission?: boolean;
}