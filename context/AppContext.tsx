import React, { createContext, useContext, useEffect, useState } from 'react';
import { Storage, AppSettings, Project } from '../lib/storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

type AppContextType = {
  projects: Project[];
  settings: AppSettings;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<void>;
  deleteProject: (projectId: string) => void;
  //increaseProjectLimit: (amount: number) => Promise<void>;
  //unlockFeature: (feature: string) => Promise<void>;
};

const AppContext = createContext<AppContextType>({} as AppContextType);

import { ReactNode } from 'react';
import { PurchaseType } from '~/types/project';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ projectLimit: 3 });

  useEffect(() => {
    const loadData = async () => {
      const [loadedProjects, loadedSettings] = await Promise.all([
        Storage.loadProjects(),
        Storage.loadSettings(),
      ]);
      setProjects(loadedProjects);
      setSettings(loadedSettings);
    };
    loadData();
  }, []);

  const addProject = async (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: uuidv4(),
      createdAt: new Date(),
    };
    console.log('newProject', newProject)
    
    const updatedProjects = [...projects, newProject];
    console.log('updatedProjects', updatedProjects)
    setProjects(updatedProjects);
    await Storage.saveProjects(updatedProjects);
  };

  const deleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    Storage.saveProjects(updatedProjects);
  };

//   const increaseProjectLimit = async (amount: number) => {
//     const newSettings = { ...settings, projectLimit: settings.projectLimit + amount };
//     setSettings(newSettings);
//     await Storage.saveSettings(newSettings);
//   };

//   const unlockFeature = async (feature: string) => { 
//     const newFeatures = [...(settings.purchasedFeatures || []), feature];
//     const newSettings = { ...settings, purchasedFeatures: newFeatures };
//     setSettings(newSettings);
//     await Storage.saveSettings(newSettings);
//   };

  return (
    <AppContext.Provider
      value={{
        projects,
        settings,
        addProject,
        deleteProject,
        //increaseProjectLimit,
        //unlockFeature,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);