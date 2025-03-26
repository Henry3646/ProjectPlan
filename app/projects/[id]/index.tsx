// import { useLocalSearchParams } from 'expo-router';
// import { useApp } from '~/context/AppContext';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Dimensions,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { useNavigation } from 'expo-router';
// import { useLayoutEffect } from 'react';
// import { Camera } from 'lucide-react-native';
// import { ArrowLeft } from 'lucide-react-native'; 
// import { Ionicons } from '@expo/vector-icons';


// const screenWidth = Dimensions.get('window').width;
// const COLUMN_WIDTH = (screenWidth - 32 - 16) / 3; // 16 for total spacing (gap between cols)

// export default function ProjectGallery() {
//   const { id } = useLocalSearchParams();
//   const { projects, updateProjectSteps } = useApp();
//   const navigation = useNavigation();

//   const project = projects.find((p) => p.id === id);
//   useLayoutEffect(() => {
//     if (project?.name) {
//       navigation.setOptions({
//         title: project.name,
//         headerLeft: () => (
//           <TouchableOpacity onPress={() => handleAddImage(project.steps.length)}>
//             <Camera color="black" size={24} style={{ marginLeft: 16 }} />
//           </TouchableOpacity>
//         ),
//       });
//     }
//   }, [navigation, project?.name]);

//   const handleAddImage = async (insertIndex: number) => {
//     const result = await ImagePicker.launchCameraAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.7,
//     });

//     if (!result.canceled) {
//       const newStep = {
//         id: Date.now().toString(),
//         imageUri: result.assets[0].uri,
//         comment: '',
//         createdAt: new Date(),
//       };

//       const updatedSteps = [...project.steps];
//       updatedSteps.splice(insertIndex, 0, newStep);

//       updateProjectSteps(project.id, updatedSteps);
//     }
//   };

//   // Render each row of 3 with vertical touch lines
//   const renderRow = (rowSteps: any[], rowIndex: number) => {
//     const row = [];

//     for (let i = 0; i < rowSteps.length; i++) {
//       const step = rowSteps[i];

//       row.push(
//         <TouchableOpacity key={step.id}>
//           <Image
//             source={{ uri: step.imageUri }}
//             className="rounded-lg"
//             style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH }}
//           />
//         </TouchableOpacity>
//       );

//       // Add thin vertical line between images
//       if (i < rowSteps.length - 1) {
//         const insertIndex = rowIndex * 3 + i + 1;

//         row.push(
//           <TouchableOpacity
//             key={`add-${step.id}`}
//             onPress={() => handleAddImage(insertIndex)}
//             className="items-center justify-center"
//             style={{ width: 12, height: COLUMN_WIDTH }}
//           >
//             <View className="w-[2px] h-[80%] bg-white opacity-50" />
//           </TouchableOpacity>
//         );
//       }
//     }

//     return (
//       <View
//         key={`row-${rowIndex}`}
//         className="flex-row justify-center items-center mb-3"
//       >
//         {row}
//       </View>
//     );
//   };

//   // Break steps into rows of 3
//   const rows = [];
//   for (let i = 0; i < project.steps.length; i += 3) {
//     const row = project.steps.slice(i, i + 3);
//     rows.push(renderRow(row, i / 3));
//   }

//   return (
//     <ScrollView className="bg-${theme} px-4 pt-8">
//       {rows}
//     </ScrollView>
//   );
// }
import {
    View,
    FlatList,
    Image,
    Dimensions,
    Text,
    TouchableOpacity,
    Alert,
    useColorScheme
  } from 'react-native';
  import { useLocalSearchParams, useNavigation, router } from 'expo-router';
  import { useApp } from '~/context/AppContext';
  import { useLayoutEffect, useRef, useState } from 'react';
  import { Camera, ArrowLeft, Trash2, RotateCcw } from 'lucide-react-native';
  import * as ImagePicker from 'expo-image-picker';
  import { Badge } from '~/components/ui/badge';
  
  const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
  
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
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'black',
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
            <Text className="text-white text-base text-center">{item.comment}</Text>
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
    const iconColor = colorScheme === 'dark' ? 'white' : 'black';

  
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
          comment: '',
          createdAt: new Date(),
        };
  
        const updatedSteps = [...project.steps, newStep];
        updateProjectSteps(project.id, updatedSteps);
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
  
      Alert.alert(
        'Delete Photo',
        'Are you sure you want to delete this photo?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              const updatedSteps = [...project.steps];
              updatedSteps.splice(currentIndex, 1);
              updateProjectSteps(project.id, updatedSteps);
  
              setCurrentIndex((prev) =>
                prev >= updatedSteps.length ? updatedSteps.length - 1 : prev
              );
            },
          },
        ]
      );
    };
  
    useLayoutEffect(() => {
      if (project?.name) {
        navigation.setOptions({
          title: '',
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.replace('/(tabs)')}
              style={{ paddingHorizontal: 16 }}
            >
              <ArrowLeft size={24} color='white' />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View className="flex-row items-center gap-4 pr-4">
              <TouchableOpacity onPress={handleDeleteImage}>
                <Trash2 size={24} color='white' />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRetakeImage}>
                <RotateCcw size={24} color='white' />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddImage}>
                <Camera size={24} color='white' />
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
  
  
