import { Link, Tabs } from 'expo-router'
import { Home, Menu, Check } from 'lucide-react-native'
import { useColorScheme } from '~/lib/useColorScheme'
import { NAV_THEME } from '~/lib/constants';
import LoadingScreen from '~/components/LoadingScreen'
import React, { useEffect, useState } from "react";

export default function TabLayout() {
    const { colorScheme, isDarkColorScheme } = useColorScheme();
    const theme = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;
    const [loading, setLoading] = useState(true);
    
    
    useEffect(() => {
        const timeout = setTimeout(() => {
          setLoading(false);
        }, 5000); // 5 second
    
        return () => clearTimeout(timeout);
      }, []);
    
    
      return loading ? (
        <LoadingScreen />
    ) : (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    paddingTop: 15,
                },
                animation: 'shift',
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    headerShown: false,
                    tabBarIcon: (({ focused }) => <Home size={40} color={theme.text} strokeWidth={focused ? 1.5: 1}/>),
                    tabBarShowLabel: false,
                }}
            />
            <Tabs.Screen
                name='Photo'
                options={{
                    headerShown: false,
                    tabBarIcon: (({ focused }) => <Check size={40} color={theme.text} strokeWidth={focused ? 1.5: 1}/>),
                    tabBarShowLabel: false,
                }}
            />
            <Tabs.Screen
                name='Menu'
                options={{
                    headerShown: false,
                    tabBarIcon: (({ focused }) => <Menu size={40} color={theme.text} strokeWidth={focused ? 1.5: 1}/>),
                    tabBarShowLabel: false,
                }}
            />
        </Tabs>
    );
}