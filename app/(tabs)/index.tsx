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
import { Project } from "~/types/project";




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
  // Add images
  // Add character Limit for title and font size change for character amount
  // integrate "addProject" function
  // Use Alert from rnr but will have to use pressable
  // Make alert to make sure they want to delete the project
  // Fix drop down menu location
  // Maybe take away const NewProject because i dont like it
  const handleRenameProject = (project: Project) => {
    Alert.prompt(
      "Rename Project",
      "Enter a new project name:",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Save", 
          onPress: (newName?: string) => {
            const trimmedName = newName?.trim();
            if (trimmedName && trimmedName.length > 0) {
              editProjectName(project.id, trimmedName);
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
              activeOpacity={0.5}
              key={project.id}
              className="w-[45%] h-[170px] bg-[#464646] p-4 rounded-lg"
              onPress={() => console.log("Opening Current Project")} //TODO
            >
              <Text className="text-2xl font-bold text-white">
                {project.name}</Text>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <TouchableOpacity className=" absolute align=end top-1 right-2">
                    <Icon name="more-vert" size={24} color="white" />
                  </TouchableOpacity>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onPress={() => {handleRenameProject(project)}}>
                    <MaterialCommunityIcons name="pencil" size={20} color="black" />
                      <Text>Edit</Text>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onPress={() => {deleteProject(project.id)}}>
                    <MaterialCommunityIcons name="trash-can" size={20} color="red" />
                      <Text>Delete</Text>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

export default index;
