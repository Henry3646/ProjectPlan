import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button } from '../../components/ui/button'
import { Text } from '../../components/ui/text'
import { useApp } from '../../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggle } from '~/components/ThemeToggle';
import { useEffect } from 'react';

export default function Menu() {
  const { settings } = useApp();

  const handleIAPPlaceholder = () => {
    Alert.alert('Coming Soon', 'In-app purchases will be available soon!');
  };

  useEffect(() => {
    console.log('settings', settings)
  }, [settings])

  return (
    <SafeAreaView>
        <View className='flex-row justify-end py-4 mr-12'>
            <ThemeToggle  />
        </View>
        <ScrollView
        className='h-full'
        >
            <View className='px-4'>
                <Text>Project Limit: {settings?.projectLimit}</Text>
                <Button
                  onPress={handleIAPPlaceholder}
                  className='mt-10'
                >
                    <Text>Increase Limit (Future IAP)</Text>
                </Button>
              <View className='mt-10'>
                <Button
                  onPress={handleIAPPlaceholder}
                >
                    <Text>Restore Purchases (Future)</Text>
                </Button>
              </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}
