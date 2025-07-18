import {
  View,
  FlatList,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  Animated,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import { useApp } from "~/context/AppContext";
import { useLayoutEffect, useRef, useState } from "react";
import { ImagePlus, ArrowLeft, Trash2, RotateCcw, Repeat2 } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { Badge } from "~/components/ui/badge";
import { Step } from "~/types/project";
import { Camera, CameraType, CameraView } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { motion } from "motion/react"

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
  const [comment, setComment] = useState(item.comment);
  const { updateProjectSteps, projects } = useApp();

  const handleSave = () => {
    const project = projects.find((p) =>
      p.steps.some((s) => s.id === item.id)
    );
    if (!project) return;

    const updatedSteps = project.steps.map((s) =>
      s.id === item.id ? { ...s, comment } : s
    );
    updateProjectSteps(project.id, updatedSteps);
  };

  return (
    <View
      style={{
        height: screenHeight,
        width: screenWidth,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
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

      <LinearGradient
        colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 500,
          justifyContent: 'flex-end',
          paddingHorizontal: 16,
          paddingBottom: 156,
        }}
      >
        <TextInput
          value={comment}
          onChangeText={setComment}
          onBlur={handleSave}
          placeholder="Add a description…."
          placeholderTextColor="rgba(255,255,255,0.5)"
          style={{
            color: 'white',
            fontSize: 16,
            paddingVertical: 8,
          }}
  />
</LinearGradient>
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

  const handleReverseOrder = () => {
    if ((!project) || (project.steps.length === 0)) {
      return;
    }
    const reversedOrder = [...project.steps].reverse();
    updateProjectSteps(project.id, reversedOrder);
    setCurrentIndex(0);
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
          <View className="flex-row items-center pr-2">
            <TouchableOpacity
              onPress={() => navigation.goBack("/(tabs)")}
              style={{ paddingHorizontal: 16 }}> 
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleReverseOrder}>
              <Repeat2 size={24} color="white"/>
            </TouchableOpacity>
          </View>
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
              <ImagePlus size={24} color="white" />
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
