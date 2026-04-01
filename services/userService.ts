import { Alert } from "react-native";
import { supabase } from "./database";

export interface UserData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  img_url: string;
  degree: string;
  major: string;
  grad_date: string;
}

export const fetchUserData = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from("users")
        .select(
          "username, email, password, first_name, last_name, img_url, degree, major, grad_date, language",
        )
        .eq("usr_id", user.id)
        .single();

      if (error) throw error;

      return data;
    }
  } catch (err: any) {
    Alert.alert("", err.message, [{ text: "OK" }]);
    return null;
  }
};

export const fetchSchedule = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from("schedules")
        .select("*")
        .eq("usr_id", user.id);

      if (error) throw error;

      return data;
    }
  } catch (err: any) {
    Alert.alert("", err.message, [{ text: "OK" }]);
    return null;
  }
};
