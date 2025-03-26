import React, { createContext, useContext, useEffect, useState } from 'react';
import { Storage, AppSettings, Project } from '../lib/storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

type AppContextType = {
  projects: Project[];
  settings: AppSettings;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<void>;
  deleteProject: (projectId: string) => void;
  editProjectName: (projectId: string, newName: string) => Promise<void>;
  updateProjectSteps: (projectId: string, updatedSteps: Step[]) => void;
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
  const editProjectName = (projectId: string, newName: string) => {
    const updatedProjects = projects.map((project) =>
      project.id === projectId ? { ...project, name: newName } : project
    );
    console.log(`Project renamed: ${projectId} → ${newName}`);
    console.log("Updated projects", updatedProjects);
    setProjects(updatedProjects);
    Storage.saveProjects(updatedProjects);
  };
  const updateProjectSteps = (projectId: string, updatedSteps: Step[]) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? { ...project, steps: updatedSteps }
          : project
      )
    );
  };

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
        editProjectName,
        updateProjectSteps,
        //increaseProjectLimit,
        //unlockFeature,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);