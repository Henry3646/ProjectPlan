import {
  View,
  FlatList,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import { useApp } from "~/context/AppContext";
import { useLayoutEffect, useRef, useState } from "react";
import { Camera, ArrowLeft, Trash2, RotateCcw } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { Badge } from "~/components/ui/badge";
import { Step } from "~/types/project";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const [currentDescription, setCurrentDescription] = useState("");

const StepScreen = ({
  item,
  index,
  total,
}: {
  item: Step;
  index: number;
  total: number;
}) => {
  return (
    <View
      style={{
        height: screenHeight,
        width: screenWidth,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <Image
        source={{ uri: item.imageUri }}
        style={{ width: screenWidth, height: screenHeight }}
        resizeMode="contain"
      />

      <View className="flex-row gap-2 absolute top-0 left-1/2 -translate-x-1/2 mt-[52px]">
        <Badge>
          <Text className="text-lg px-2">Step</Text>
        </Badge>
        <Badge>
          <Text className="text-lg px-2">{index + 1}</Text>
        </Badge>
      </View>

      {item.comment ? (
        <View className="absolute bottom-10 px-4 w-full">
          <Text className="text-white text-base text-center">
            {item.comment}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default function ProjectFullscreenGallery() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { projects, updateProjectSteps } = useApp();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "white" : "black";
  const project = projects.find((p) => p.id === id);
  const steps = project?.steps || [];

  const handleAddImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newStep = {
        id: Date.now().toString(),
        imageUri: result.assets[0].uri,
        comment: currentDescription,
        createdAt: new Date(),
      };

      const updatedSteps = [...project.steps, newStep];
      updateProjectSteps(project.id, updatedSteps);
      const newIndex = updatedSteps.length - 1;
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
        setCurrentIndex(newIndex);
      }, 100);
    }
  };

  const handleRetakeImage = async () => {
    if (!project) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const updatedSteps = [...project.steps];
      updatedSteps[currentIndex] = {
        ...updatedSteps[currentIndex],
        imageUri: result.assets[0].uri,
        createdAt: new Date(),
      };

      updateProjectSteps(project.id, updatedSteps);
    }
  };

  const handleDeleteImage = () => {
    if (!project) return;

    Alert.alert("Delete Photo", "Are you sure you want to delete this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const updatedSteps = [...project.steps];
          updatedSteps.splice(currentIndex, 1);
          updateProjectSteps(project.id, updatedSteps);

          setCurrentIndex((prev) =>
            prev >= updatedSteps.length ? updatedSteps.length - 1 : prev
          );
        },
      },
    ]);
  };

  useLayoutEffect(() => {
    if (project?.name) {
      navigation.setOptions({
        title: "",
        headerTransparent: true,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            style={{ paddingHorizontal: 16 }}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <View className="flex-row items-center gap-4 pr-4">
            <TouchableOpacity onPress={handleDeleteImage}>
              <Trash2 size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRetakeImage}>
              <RotateCcw size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAddImage}>
              <Camera size={24} color="white" />
            </TouchableOpacity>
          </View>
        ),
      });
    }
  }, [navigation, project, currentIndex]);

  if (!project) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-xl">Project not found</Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      data={steps}
      keyExtractor={(item) => item.id}
      pagingEnabled
      snapToAlignment="start"
      showsVerticalScrollIndicator={false}
      decelerationRate="fast"
      onMomentumScrollEnd={(e) => {
        const newIndex = Math.round(
          e.nativeEvent.contentOffset.y / screenHeight
        );
        setCurrentIndex(newIndex);
      }}
      renderItem={({ item, index }) => (
        <StepScreen item={item} index={index} total={steps.length} />
      )}
    />
  );
}
