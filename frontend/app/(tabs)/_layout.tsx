import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper'; // Import the useTheme hook
import { useTranslate } from '../../lib/i18n';

export default function TabsLayout() {
  const t = useTranslate();
  const theme = useTheme(); // Get our theme colors from the provider

  return (
    <Tabs
      screenOptions={{
        // THE FIX: Style the tab bar directly using the theme
        headerShown: false, // We use custom headers in each screen
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: theme.colors.surface, // Use the theme's surface color for the background
          borderTopColor: 'rgba(255, 255, 255, 0.1)', // Subtle top border
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('homeTitle'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settingsTitle'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

