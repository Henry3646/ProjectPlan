import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Pressable,
  Image,
} from "react-native";
import React, { useEffect } from "react";
import { useApp } from "~/context/AppContext";
import { Text } from "~/components/ui/text";
import { H2 } from "~/components/ui/typography";
import { useColorScheme } from "~/lib/useColorScheme";
import { NAV_THEME } from "~/lib/constants";

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
  const { projects } = useApp();
  const { isDarkColorScheme } = useColorScheme();
  const theme = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;
  // Add images
  // Add character Limit for title and font size change for character amount
  // integrate "addProject" function
  // Counter for project limit
  // Decide between pressable or touchable opacity
  return (
    <SafeAreaView className="flex-1 bg-transparent border-none">
      <H2 className="text-5xl font-light pl-10 ${theme}">Projects</H2>
      {projects.length === 0 ? (
        <View className="flex-row flex-wrap justify-between gap-4">
          <TouchableOpacity
            onPress={() => console.log("First Project Success")} //TODO
            className="w-[45%] h-[150px] bg-${theme} rounded-lg flex items-center justify-center border-4 border-[#464646]"
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
              className="w-[45%] h-[150px] bg-[#464646] p-4 rounded-lg"
              onPress={() => console.log("Opening Current Project")}
            >
              <Text className="text-2xl font-bold text-white">
                {project.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

export default index;
