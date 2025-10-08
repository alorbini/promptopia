import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
// THE FIX: Removed useColorScheme as we will force dark mode
import { useEffect, useRef } from 'react';
import { AdEventType, InterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from 'react-native-paper';

// Use test IDs during development
const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-6459631134961728/4144720253';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export default function RootLayout() {
  // This hook is no longer needed: const colorScheme = useColorScheme();
  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: require('@react-navigation/native').DefaultTheme,
    reactNavigationDark: require('@react-navigation/native').DarkTheme,
  });

  const CombinedDefaultTheme = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...LightTheme.colors,
    },
  };
  const CombinedDarkTheme = {
    ...MD3DarkTheme,
    ...DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...DarkTheme.colors,
      background: '#121212',
      surface: '#1e1e1e',
    },
  };

  // THE FIX: Forcing the app to always use the dark theme
  const theme = CombinedDarkTheme;

  // --- AdMob Timer Logic ---
  const adInterval = useRef<number | null>(null);

  useEffect(() => {
    const adListener = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      interstitial.show();
    });

    // Start a timer to load an ad every 20 seconds
    adInterval.current = setInterval(() => {
      console.log('Timer triggered: Loading interstitial ad...');
      interstitial.load();
    }, 20000); // 20 seconds

    // Clean up listeners and timers when the app closes
    return () => {
      adListener();
      if (adInterval.current) {
        clearInterval(adInterval.current);
      }
    };
  }, []);
  // --- End of AdMob Logic ---

  return (
    <PaperProvider theme={theme}>
      <ThemeProvider value={theme}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: theme.colors.surface },
            headerTintColor: theme.colors.onSurface,
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="category"
            options={{
              presentation: 'modal',
              headerTitle: 'Prompts',
            }}
          />
          <Stack.Screen name="prompt-modal" options={{ presentation: 'modal', headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}

