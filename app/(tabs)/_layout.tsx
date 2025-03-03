import { Link, Tabs } from 'expo-router'
import { Home, Menu } from 'lucide-react-native'
import { useColorScheme } from '~/lib/useColorScheme'
import { NAV_THEME } from '~/lib/constants';

export default function TabLayout() {
    const { colorScheme, isDarkColorScheme } = useColorScheme();
    const theme = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;
    return (
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