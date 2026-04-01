import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

import { COLORS } from "@/constants/color";
import { supabase } from "@/services/database";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { RootSiblingParent } from "react-native-root-siblings";

export const unstable_settings = {
  anchor: "(tabs)",
};

const INACTIVITY_LIMIT = 15 * 60 * 1000;
const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, _) => {
      if (event === "SIGNED_IN") {
        router.replace("/(tabs)/(home)");
      } else {
        router.replace("/(tabs)/(home)");
      }
    });
  }, []);

  const timeRef = useRef<number | undefined>(undefined);

  const resetTime = () => {
    if (timeRef.current) clearTimeout(timeRef.current);

    timeRef.current = setTimeout(async () => {
      await supabase.auth.signOut();
      router.replace("/(auth)/sign-in");
    }, INACTIVITY_LIMIT);
  };

  // useEffect(() => {
  //   resetTime();
  //   return () => {
  //     if (timeRef.current) clearTimeout(timeRef.current);
  //   };
  // }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <RootSiblingParent>
        {/* <View
          onStartShouldSetResponderCapture={() => {
            resetTime();
            return false;
          }}
        > */}
        <QueryClientProvider client={queryClient}>
          <Stack>
            {/* <Stack.Screen name="(home)" options={{ headerShown: false }} /> */}
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* <Stack.Screen name="(settings)" options={{ headerShown: false }} /> */}
            <Stack.Screen
              name="modal"
              options={{
                presentation: "modal",
                title: "Add a schedule",
                headerStyle: { backgroundColor: COLORS.background },
                headerTintColor: COLORS.primary,
                headerTitleStyle: { fontWeight: 700 },
              }}
            />
          </Stack>
        </QueryClientProvider>
        {/* </View> */}
      </RootSiblingParent>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
