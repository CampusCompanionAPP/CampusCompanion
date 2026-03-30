import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseURL = process.env.EXPO_PUBLIC_SUPABASE_API_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseURL, supabaseKey, {
  auth: {
    storage:
      Platform.OS !== "web"
        ? AsyncStorage
        : typeof window !== "undefined"
          ? window.localStorage
          : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
