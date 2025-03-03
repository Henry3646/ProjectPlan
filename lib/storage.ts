import AsyncStorage from '@react-native-async-storage/async-storage';
import { Project, PurchaseType } from '../types/project';

const PROJECTS_KEY = '@projects';
const SETTINGS_KEY = '@settings';

export const Storage = {
  saveProjects: async (projects: Project[]) => {
    await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  },

  loadProjects: async (): Promise<Project[]> => {
    const data = await AsyncStorage.getItem(PROJECTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveSettings: async (settings: AppSettings) => {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  loadSettings: async (): Promise<AppSettings> => {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { projectLimit: 3 };
  },
};

export interface AppSettings {
  projectLimit: number;
  purchasedFeatures?: PurchaseType[];
}

export { Project };
