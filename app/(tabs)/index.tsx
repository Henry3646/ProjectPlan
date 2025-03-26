import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Pressable,
  Image,
  Alert,
} from "react-native";
import React, { useEffect } from "react";
import { useApp } from "~/context/AppContext";
import { Text } from "~/components/ui/text";
import { H2, Small } from "~/components/ui/typography";
import { useColorScheme } from "~/lib/useColorScheme";
import { NAV_THEME } from "~/lib/constants";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ImageBackground } from 'react-native';
import { router } from 'expo-router';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';




// interface Project {
//   id: string;
//   name: string;
//   description?: string;
//   steps: Step[];
//   createdAt: Date;
//   isPublished?: boolean;
// }

// export interface Step {
//   id: string;
//   imageUri: string;
//   comment?: string;
//   createdAt: Date;
// }

const index = () => {
  const { projects, settings, deleteProject, addProject, editProjectName } = useApp();
  const { isDarkColorScheme } = useColorScheme();
  const theme = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;
  const firstImageUri = projects?.[0]?.steps?.[0]?.imageUri;

  // Add character Limit for title and font size change for character amount
  // Use Alert from rnr but will have to use pressable
  // Make alert to make sure they want to delete the project
  // Fix drop down menu location
  // Maybe take away const NewProject because i dont like it!!!
  // change dropdown menu
  const handleRenameProject = (project) => {
    Alert.prompt(
      "Rename Project",
      "Enter a new project name:",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Save", 
          onPress: (newName) => {
            if (newName.trim().length > 0) {
              editProjectName(project.id, newName);
            }
          } 
        }
      ],
      "plain-text",
      project.name
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-transparent border-none">

      <H2 className="text-5xl font-light pl-10 ${theme}">Projects</H2>
      <Text className="text-sm font-light absolute top-24 right-4 pr-5 ${theme}"> Project Limit: { settings.projectLimit } </Text>
      {projects.length === 0 ? (
        <View className="flex-row flex-wrap justify-between gap-4">
          <TouchableOpacity
          onPress={async () => {
            const newProject = {
              name: "New Project",
              description: "A new project description",
              steps: [],
              isPublished: false,
            };
            await addProject(newProject);
          }}
          className={`w-[45%] h-[170px] bg-${theme} rounded-lg items-center justify-center border-4 border-[#464646]`}
        >
          <Text className="text-4xl font-light text-[#464646]">+</Text>
        </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row flex-wrap px-10 justify-between gap-4">
          {projects.map((project) => (
            <TouchableOpacity
            key={project.id}
            onPress={() => router.push(`/projects/${project.id}`)}
            className="w-[45%] h-[170px] rounded-lg overflow-hidden"
            activeOpacity={0.8}
            >
            <ImageBackground
              source={{ uri: project.steps[0]?.imageUri }}
              className="flex-1 justify-start p-3"
              imageStyle={{ borderRadius: 12 }}
            >
              <View className="bg-black/50 px-2 py-1 rounded">
                <Text className="text-white font-bold text-lg">{project.name}</Text>
              </View>
              <View className="absolute top-2 right-2 z-20">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <TouchableOpacity>
                      <Icon name="more-vert" size={24} color="white" />
                    </TouchableOpacity>
                  </DropdownMenuTrigger>
          
                  <DropdownMenuContent className="w-40">
                    <DropdownMenuGroup>
                      <DropdownMenuItem onPress={() => handleRenameProject(project)}>
                        <MaterialCommunityIcons name="pencil" size={20} color={isDarkColorScheme ? 'white' : 'black'} />
                        <Text>Edit</Text>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onPress={() => deleteProject(project.id)}>
                        <MaterialCommunityIcons name="trash-can" size={20} color="red" />
                        <Text>Delete</Text>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

export default index;
