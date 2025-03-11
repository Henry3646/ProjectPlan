import { View, TextInput, ScrollView, StyleSheet, Image, Alert, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Text } from '../../components/ui/text';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { useApp } from '../../context/AppContext';
import { Camera, CameraType, CameraView } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { Step } from '../../types/project';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../components/ui/input';
import { Label } from '~/components/ui/label';
import { SwitchCamera, Circle, X } from 'lucide-react-native'
import { Badge } from '~/components/ui/badge';
type ProjectState = 'init' | 'capturing' | 'review' | 'description' | 'complete';

const Photo = () => {
  const { addProject, settings } = useApp();
  const [projectState, setProjectState] = useState<ProjectState>('init');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [currentDescription, setCurrentDescription] = useState('');
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<any>(null);
  const [cameraType, setCameraType] = useState<CameraType>('back');

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(status === 'granted');
  };

  const handleStartProject = async () => {
    if (!projectName.trim()) {
      return;
    }
    if (settings?.projectLimit < 1) {
      Alert.alert('Project Limit Reached', 'You have reached the maximum number of projects.');
      return;
    }
    await requestCameraPermission();
    setProjectState('capturing');
  };

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCurrentPhoto(photo.uri);
      setProjectState('review');
    }
  };

  const handleRetakePhoto = () => {
    setCurrentPhoto(null);
    setProjectState('capturing');
  };

  const handleAcceptPhoto = () => {
    if (currentPhoto) {
      const newStep: Step = {
        id: Date.now().toString(),
        imageUri: currentPhoto,
        comment: currentDescription,
        createdAt: new Date(),
      };
      setSteps([...steps, newStep]);
      setCurrentPhoto(null);
      setCurrentDescription('');
      setProjectState('capturing');
    }
  };

  const handleSubmitProject = async () => {
    if (steps.length === 0) {
      Alert.alert('No Photos', 'Please take at least one photo before submitting.');
      return;
    }

    try {
      if (!settings || settings.projectLimit < 1) {
        Alert.alert('Project Limit Reached', 'You have reached the maximum number of projects.');
        return;
      }

      const project = {
        name: projectName,
        description: projectDescription,
        steps,
      };

      await addProject(project);
      Alert.alert('Success', 'Project saved successfully!');
      setProjectState('init');
      setProjectName('');
      setProjectDescription('');
      setSteps([]);
      setCurrentPhoto(null);
      setCurrentDescription('');
    } catch (error) {
      console.error('Error saving project:', error);
      Alert.alert('Error', 'Failed to save project. Please try again.');
    }
  };

  const renderInitialScreen = () => (
    <ScrollView className="flex-1 px-4 pt-20">
      <Card>
        <CardHeader>
          <CardTitle>New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="space-y-4">
            <View>
              <Label nativeID='project-name-label'>Project Name</Label>
              <Input
                placeholder="Test project..."
                value={projectName}
                onChangeText={setProjectName}
                
              />
            </View>
            <View className='mt-4'>
              <Label nativeID='project-description-label'>Description (Optional)</Label>
              <Input
                placeholder="Test description..."
                value={projectDescription}
                onChangeText={setProjectDescription}
              />
            </View>
          </View>
        </CardContent>
        <CardFooter>
          <Button
            onPress={handleStartProject}
            disabled={!projectName.trim()}
          >
            <Text className="text-primary-foreground">Start Project</Text>
          </Button>
        </CardFooter>
      </Card>
    </ScrollView>
  );

  const renderCamera = () => {
    if (cameraPermission === null) {
      return <View />;
    }
    if (cameraPermission === false) {
      return (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-lg text-center mb-4">No access to camera</Text>
          <Button onPress={requestCameraPermission}>
            <Text className="text-primary-foreground">Grant Permission</Text>
          </Button>
        </View>
      );
    }

    return (
      <View className="flex-1">
        <CameraView
          ref={cameraRef}
          facing={cameraType}
          style={StyleSheet.absoluteFill}
        >
          <View className="flex-1 bg-transparent pt-10">
            <View className="flex-row justify-between items-center px-2 pt-4">
              <Button
                variant="ghost"
                onPress={() => setProjectState('init')}
              >
                <X size={36} color='white' />
              </Button>
              <View className='flex-row gap-2 absolute top-6 right-1/2 translate-x-1/2 pr-4'>
                <Badge>
                  <Text className="text-lg px-2">Step</Text>
                </Badge>
                <Badge>
                  <Text className="text-lg px-2">{steps.length + 1}</Text>
                </Badge>
              </View>
              <Button
                variant="ghost"
                onPress={() => setCameraType(
                  cameraType === 'back' ? 'front' : 'back'
                )}
                
              >
                <SwitchCamera size={32} color='white' />
              </Button>
            </View>
            <View className="flex-1 justify-end pb-10">
              <View className="items-center space-y-4">
                <Button
                  className="bg-transparent"
                  onPress={handleTakePhoto}
                >
                  <Circle size={80} color='white' strokeWidth={1} />
                </Button>
                {steps.length > 0 && (
                  <Button
                    variant="secondary"
                    className="mb-4"
                    onPress={handleSubmitProject}
                  >
                    <Text className="text-secondary-foreground">Finish Project ({steps.length} photos)</Text>
                  </Button>
                )}
              </View>
            </View>
          </View>
        </CameraView>
      </View>
    );
  };

  const renderPhotoReview = () => {
    if (!currentPhoto) return null;

    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={StyleSheet.absoluteFill}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            <View className="flex-1 pt-10">
              <View style={StyleSheet.absoluteFill}>
                <Image source={{ uri: currentPhoto }} style={StyleSheet.absoluteFill} resizeMode="cover" />
              </View>
              <View className="flex-row justify-between items-center px-2 pt-4">
                <Button variant="ghost" onPress={handleRetakePhoto}>
                  <Text className="text-white font-bold">Retake</Text>
                </Button>
                <View className='flex-row gap-2 absolute top-6 right-1/2 translate-x-1/2 pr-4'>
                  <Badge>
                    <Text className="text-lg px-2">Step</Text>
                  </Badge>
                  <Badge>
                    <Text className="text-lg px-1">{steps.length + 1}</Text>
                  </Badge>
                </View>
                <Button variant="ghost" onPress={handleAcceptPhoto}>
                  <Text className="text-white font-bold">Next</Text>
                </Button>
              </View>
              <View className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-lg p-4 pb-20">
                <Input
                  className="bg-white/10 border-white/20 text-white min-h-[100px]"
                  value={currentDescription}
                  onChangeText={setCurrentDescription}
                  placeholder="Add a description (optional)"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  multiline
                  numberOfLines={4}
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onSubmitEditing={Keyboard.dismiss}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  };

  const renderDescriptionInput = () => <View />;

  const getActiveScreen = () => {
    switch (projectState) {
      case 'init':
        return renderInitialScreen();
      case 'capturing':
        return renderCamera();
      case 'review':
        return renderPhotoReview();
      case 'description':
        return renderDescriptionInput();
      default:
        return renderInitialScreen();
    }
  };

  return (
    <View className="flex-1 bg-background">
      {getActiveScreen()}
    </View>
  );
};

export default Photo;