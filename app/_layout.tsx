import "../i18n";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@src/hooks/use-color-scheme";

import { COLORS } from "@src/constants/color";
import { supabase } from "@src/services/database";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RootSiblingParent } from "react-native-root-siblings";
import { syncUserLanguage } from "../i18n";

export const unstable_settings = {
  anchor: "(tabs)",
};

const queryClient = new QueryClient();

export default function RootLayout() {
  const { t } = useTranslation();

  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        if (!session.user.is_anonymous) syncUserLanguage();
        router.replace("/(tabs)/(home)");
      } else if (event === "SIGNED_OUT") {
        router.replace("/(auth)/sign-in");
      }
    });
  }, []);

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
                title: t("home.add"),
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
