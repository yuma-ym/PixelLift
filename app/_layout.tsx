import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, DotGothic16_400Regular } from '@expo-google-fonts/dotgothic16';
import { useStore } from '../src/store/useStore';
import { colors } from '../src/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({ DotGothic16_400Regular });
  const seedIfNeeded = useStore((s) => s.seedIfNeeded);

  useEffect(() => {
    seedIfNeeded();
  }, [seedIfNeeded]);

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  // フォント読込が終わるか失敗するまで待つ（失敗時はフォールバックフォントで続行）
  if (!loaded && !error) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.frameHi,
          headerTitleStyle: { fontFamily: 'DotGothic16_400Regular', fontSize: 15 },
          contentStyle: { backgroundColor: colors.bg },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="muscle/[group]" options={{ title: '種目' }} />
        <Stack.Screen name="workout" options={{ title: 'ワークアウト', presentation: 'fullScreenModal' }} />
        <Stack.Screen name="routines" options={{ title: 'ルーティン' }} />
        <Stack.Screen name="history" options={{ title: 'きろく' }} />
      </Stack>
    </>
  );
}
