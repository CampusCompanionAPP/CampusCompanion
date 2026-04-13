import AnimatedInput from "@src/components/AnimatedInput";
import Button from "@src/components/Button";
import ExpandableTab from "@src/components/ExpandableTab";
import Loading from "@src/components/Loading";
import { COLORS } from "@src/constants/color";
import { degreeOptions, majorOptions } from "@src/constants/degree-major";
import { languageOptions } from "@src/constants/language";
import { supabase } from "@src/services/database";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface UserData {
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

const Page = () => {
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [username, setUsername] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [degree, setDegree] = useState("");
  const [major, setMajor] = useState("");
  const [allMajor, setAllMajor] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [gradDate, setGradDate] = useState<Date | undefined>();

  const [email, setEmail] = useState("");
  const [prepassword, setPrepassword] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("English");

  const [isDegFocus, setIsDegFocus] = useState(false);
  const [isMajFocus, setIsMajFocus] = useState(false);
  const [isLangFocus, setIsLangFocus] = useState(false);

  const [openedTap, setOpenedTab] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const toggleTab = (id: string) => {
    setOpenedTab(openedTap === id ? "" : id);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
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
        setUserData(data);
      }
    } catch (err: any) {
      Alert.alert("", err.message, [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateData = async (col: any, newData: any) => {
    try {
      setIsLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        if (col === "img_url") {
          newData = await uploadImage(newData, user.id);

          const { data, error } = await supabase
            .from("users")
            .select("img_url")
            .eq("usr_id", user.id)
            .single();

          const old_img = data?.img_url;

          if (error) throw error;

          await supabase.storage
            .from("avatars")
            .remove(old_img.split("/avatars/")[1]);
        }

        const { data, error } = await supabase
          .from("users")
          .update({ [col]: newData })
          .eq("usr_id", user.id)
          .select()
          .single();

        if (error) throw error;

        await fetchUserData();
      }
    } catch (err: any) {
      Alert.alert("", err.message, [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Denied", "Could not update the profile image");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (image: string, user_id: any) => {
    const response = await fetch(image);
    const blob = await response.blob();

    const file = image.split("/").pop();
    const format = file?.split(".").pop();
    const fileName = `${user_id}/${Date.now()}.${format}`;

    const arrayBuffer = await new Response(blob).arrayBuffer();

    try {
      const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, arrayBuffer, {
          contentType: blob.type,
          upsert: true,
        });

      if (error) throw error;

      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

      return data.publicUrl;
    } catch (err: any) {
      Alert.alert("", err.message, [{ text: "OK" }]);
      return null;
    }
  };

  if (isLoading) return <Loading />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
          // paddingTop: insets.top,
          // paddingBottom: insets.bottom,
        }}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "flex-start",
          paddingBottom: insets.bottom + 50,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* <ScrollView
      style={styles.container}
      contentContainerStyle={{ flex: 1, alignItems: "center" }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={true}
    > */}
        <View style={styles.profile_img}>
          <Image
            source={{ uri: userData?.img_url }}
            style={{ width: `100%`, height: `100%` }}
          />
        </View>

        <Text style={styles.profile_name}>{userData?.username}</Text>

        <View style={styles.section}>
          <Text style={styles.header}>Profile</Text>
          <View style={styles.separator} />

          <ExpandableTab
            header="Change Username"
            onExpand={(expanded) => {
              if (!expanded) {
                setUsername("");
                Keyboard.dismiss();
              }
            }}
            expanded={openedTap === "username"}
            onToggle={() => toggleTab("username")}
          >
            <View style={styles.content}>
              <AnimatedInput
                value={username}
                placeholder={userData?.username || ""}
                onChangeText={(username) => setUsername(username)}
                noAnimation
              />
              <Button
                style={[
                  { marginTop: 10, transform: [{ scale: 0.8 }] },
                  (!username || userData?.username === username) && {
                    opacity: 0.5,
                  },
                ]}
                text="Update"
                outline
                disabled={!username || userData?.username === username}
                onPress={() => {
                  updateData("username", username);
                  setUsername("");
                  setOpenedTab("");
                }}
              />
            </View>
          </ExpandableTab>

          <ExpandableTab
            header="Change Name"
            onExpand={(expanded) => {
              if (!expanded) {
                setFirstName("");
                setLastName("");
                Keyboard.dismiss();
              }
            }}
            expanded={openedTap === "name"}
            onToggle={() => toggleTab("name")}
          >
            <View style={styles.content}>
              <AnimatedInput
                value={firstName}
                placeholder={userData?.first_name || ""}
                onChangeText={(firstName) => setFirstName(firstName)}
                noAnimation
              />
              <AnimatedInput
                value={lastName}
                placeholder={userData?.last_name || ""}
                onChangeText={(lastName) => setLastName(lastName)}
                noAnimation
              />
              <Button
                style={[
                  { marginTop: 10, transform: [{ scale: 0.8 }] },
                  (!firstName ||
                    !lastName ||
                    (userData?.first_name === firstName &&
                      userData?.last_name === lastName)) && {
                    opacity: 0.5,
                  },
                ]}
                text="Update"
                outline
                disabled={
                  !firstName ||
                  !lastName ||
                  (userData?.first_name === firstName &&
                    userData?.last_name === lastName)
                }
                onPress={() => {
                  updateData("first_name", firstName);
                  updateData("last_name", lastName);
                  setFirstName("");
                  setLastName("");
                  setOpenedTab("");
                }}
              />
            </View>
          </ExpandableTab>

          <ExpandableTab
            header="Change Image"
            onExpand={(expanded) => {
              if (!expanded) {
                setImage("");
                Keyboard.dismiss();
              }
            }}
            expanded={openedTap === "image"}
            onToggle={() => toggleTab("image")}
          >
            <View style={styles.content}>
              <Pressable
                style={({ pressed }) => [
                  styles.imgInput,
                  pressed ? { borderColor: COLORS.primary } : null,
                ]}
                onPress={selectImage}
              >
                {({ pressed }) =>
                  !image
                    ? [
                        <Ionicons
                          key={"image-icon"}
                          name="image"
                          size={24}
                          color={pressed ? COLORS.primary : COLORS.secondary}
                        />,
                        <Text
                          key={"image-text"}
                          style={{
                            color: pressed ? COLORS.primary : COLORS.secondary,
                            fontSize: 12,
                          }}
                        >
                          Select an image
                        </Text>,
                      ]
                    : [
                        <Image
                          key={"avatar-img"}
                          style={{
                            width: `100%`,
                            height: `100%`,
                            borderRadius: `10%`,
                          }}
                          source={{ uri: image }}
                        />,
                      ]
                }
              </Pressable>

              <Button
                style={[
                  { marginTop: 10, transform: [{ scale: 0.8 }] },
                  (!image || image === userData?.img_url) && {
                    opacity: 0.5,
                  },
                ]}
                text="Update"
                outline
                disabled={!image || image === userData?.img_url}
                onPress={() => {
                  updateData("img_url", image);
                  setImage("");
                  setOpenedTab("");
                }}
              />
            </View>
          </ExpandableTab>

          <ExpandableTab
            header="Change Degree & Major"
            onExpand={(expanded) => {
              if (!expanded) {
                setDegree("");
                setMajor("");
                Keyboard.dismiss();
              }
            }}
            expanded={openedTap === "program"}
            onToggle={() => toggleTab("program")}
          >
            <View style={styles.content}>
              <Dropdown
                style={[
                  styles.dropdown,
                  isDegFocus && { borderColor: COLORS.primary },
                ]}
                placeholderStyle={{ fontSize: 16, color: COLORS.secondary }}
                selectedTextStyle={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: COLORS.primary,
                }}
                containerStyle={{
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: COLORS.primary,
                  marginTop: 8,
                  overflow: "hidden",
                  backgroundColor: COLORS.background,
                }}
                data={degreeOptions}
                labelField="label"
                valueField="value"
                placeholder={userData?.degree || "Select a degree"}
                value={degree}
                onFocus={() => setIsDegFocus(true)}
                onBlur={() => setIsDegFocus(false)}
                onChange={(degree) => {
                  setDegree(degree.value);
                  setIsDegFocus(false);
                  setAllMajor(majorOptions(degree.value));
                }}
                renderLeftIcon={() => (
                  <Ionicons
                    style={{ marginRight: 10 }}
                    color={isDegFocus ? COLORS.primary : COLORS.secondary}
                    name="menu-outline"
                    size={20}
                  />
                )}
                renderItem={(degree) => {
                  return (
                    <View
                      style={{
                        padding: 17,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        borderBottomWidth: 0.5,
                        borderBottomColor: COLORS.primary,
                        backgroundColor: COLORS.background,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 16,
                          color: COLORS.primary,
                          fontWeight: "500",
                        }}
                      >
                        {degree.label}
                      </Text>
                    </View>
                  );
                }}
              />
              <Dropdown
                disable={!degree}
                style={[
                  styles.dropdown,
                  isMajFocus && { borderColor: COLORS.primary, borderWidth: 2 },
                  !degree && { opacity: 0.4 },
                ]}
                placeholderStyle={{ fontSize: 16, color: COLORS.secondary }}
                selectedTextStyle={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: COLORS.primary,
                }}
                containerStyle={{
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: COLORS.primary,
                  marginTop: 8,
                  overflow: "hidden",
                  backgroundColor: COLORS.background,
                }}
                data={allMajor}
                labelField="label"
                valueField="value"
                placeholder={userData?.major || "Select a major"}
                value={major}
                onFocus={() => setIsMajFocus(true)}
                onBlur={() => setIsMajFocus(false)}
                onChange={(major) => {
                  setMajor(major.value);
                  setIsMajFocus(false);
                }}
                renderLeftIcon={() => (
                  <Ionicons
                    style={{ marginRight: 10 }}
                    color={isMajFocus ? COLORS.primary : COLORS.secondary}
                    name="menu-outline"
                    size={20}
                  />
                )}
                renderItem={(major) => {
                  return (
                    <View
                      style={{
                        padding: 17,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        borderBottomWidth: 0.5,
                        borderBottomColor: COLORS.primary,
                        backgroundColor: COLORS.background,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 16,
                          color: COLORS.primary,
                          fontWeight: "500",
                        }}
                      >
                        {major.label}
                      </Text>
                    </View>
                  );
                }}
              />

              <Button
                style={[
                  { marginTop: 10, transform: [{ scale: 0.8 }] },
                  (!degree ||
                    !major ||
                    (degree === userData?.degree &&
                      major === userData?.major)) && {
                    opacity: 0.5,
                  },
                ]}
                text="Update"
                outline
                disabled={
                  !degree ||
                  !major ||
                  (degree === userData?.degree && major === userData?.major)
                }
                onPress={() => {
                  updateData("degree", degree);
                  updateData("major", major);
                  setDegree("");
                  setMajor("");
                  setOpenedTab("");
                }}
              />
            </View>
          </ExpandableTab>

          <ExpandableTab
            header="Change Graduation Date"
            onExpand={(expanded) => {
              if (!expanded) {
                setGradDate(undefined);
                Keyboard.dismiss();
              }
            }}
            expanded={openedTap === "date"}
            onToggle={() => toggleTab("date")}
          >
            <View style={styles.content}>
              <DateTimePicker
                display={Platform.OS === "ios" ? "spinner" : "default"}
                textColor={COLORS.primary}
                accentColor="red"
                style={{
                  maxHeight: 100,
                  width: "auto",
                  borderWidth: 2,
                  borderColor: COLORS.secondary,
                  borderRadius: 12,
                  marginTop: -60,
                }}
                value={
                  gradDate ||
                  (userData?.grad_date && new Date(userData?.grad_date)) ||
                  new Date()
                }
                mode="date"
                minimumDate={new Date()}
                onChange={(_, date) => setGradDate(date)}
              />
              <Button
                style={[
                  {
                    marginTop: 20,
                    marginBottom: -60,
                    transform: [{ scale: 0.8 }],
                  },
                  (!gradDate ||
                    (gradDate.getFullYear() ===
                      (userData?.grad_date &&
                        new Date(userData?.grad_date).getFullYear()) &&
                      gradDate.getMonth() ===
                        (userData?.grad_date &&
                          new Date(userData?.grad_date).getMonth()) &&
                      gradDate.getDay() ===
                        (userData?.grad_date &&
                          new Date(userData?.grad_date).getDay()))) && {
                    opacity: 0.5,
                  },
                ]}
                text="Update"
                outline
                disabled={
                  !gradDate ||
                  (gradDate.getFullYear() ===
                    (userData?.grad_date &&
                      new Date(userData?.grad_date).getFullYear()) &&
                    gradDate.getMonth() ===
                      (userData?.grad_date &&
                        new Date(userData?.grad_date).getMonth()) &&
                    gradDate.getDay() ===
                      (userData?.grad_date &&
                        new Date(userData?.grad_date).getDay()))
                }
                onPress={() => {
                  updateData("grad_date", gradDate);
                  setGradDate(undefined);
                  setOpenedTab("");
                }}
              />
            </View>
          </ExpandableTab>
        </View>

        <View style={styles.section}>
          <Text style={styles.header}>Privacy</Text>
          <View style={styles.separator} />

          <ExpandableTab
            header="Change Email"
            onExpand={(expanded) => {
              if (!expanded) {
                setEmail("");
                Keyboard.dismiss();
              }
            }}
            expanded={openedTap === "email"}
            onToggle={() => toggleTab("email")}
          >
            <View style={styles.content}>
              <AnimatedInput
                value={email}
                placeholder={userData?.email || ""}
                onChangeText={(email) => setEmail(email)}
                noAnimation
              />
              <Button
                style={[
                  { marginTop: 10, transform: [{ scale: 0.8 }] },
                  (!email || userData?.email === email) && {
                    opacity: 0.5,
                  },
                ]}
                text="Update"
                outline
                disabled={!email || userData?.email === email}
                onPress={() => {
                  updateData("email", email);
                  setEmail("");
                  setOpenedTab("");
                }}
              />
            </View>
          </ExpandableTab>

          <ExpandableTab
            header="Change Password"
            onExpand={(expanded) => {
              if (!expanded) {
                setPassword("");
                setPrepassword("");
                Keyboard.dismiss();
              }
            }}
            expanded={openedTap === "password"}
            onToggle={() => toggleTab("password")}
          >
            <View style={styles.content}>
              <AnimatedInput
                value={prepassword}
                placeholder={"Previous password"}
                onChangeText={(prepassword) => setPrepassword(prepassword)}
                noAnimation
              />

              <AnimatedInput
                value={password}
                placeholder={"New password"}
                onChangeText={(password) => setPassword(password)}
                noAnimation
              />
              <Button
                style={[
                  { marginTop: 10, transform: [{ scale: 0.8 }] },
                  (!password || !prepassword) && {
                    opacity: 0.5,
                  },
                ]}
                text="Update"
                outline
                disabled={!password || !prepassword}
                onPress={() => {
                  if (prepassword === userData?.password) {
                    updateData("password", password);
                    setPassword("");
                    setPrepassword("");
                    setOpenedTab("");
                  } else {
                    Alert.alert("", "Wrong Password", [{ text: "OK" }]);
                  }
                }}
              />
            </View>
          </ExpandableTab>

          <ExpandableTab
            header="Change Language"
            onExpand={(expanded) => {
              if (!expanded) {
                setLanguage("");
                Keyboard.dismiss();
              }
            }}
            expanded={openedTap === "language"}
            onToggle={() => toggleTab("language")}
          >
            <View style={styles.content}>
              <Dropdown
                style={[
                  styles.dropdown,
                  isLangFocus && {
                    borderColor: COLORS.primary,
                    borderWidth: 2,
                  },
                ]}
                placeholderStyle={{ fontSize: 16, color: COLORS.secondary }}
                selectedTextStyle={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: COLORS.primary,
                }}
                containerStyle={{
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: COLORS.primary,
                  marginTop: 8,
                  overflow: "hidden",
                  backgroundColor: COLORS.background,
                }}
                data={languageOptions}
                labelField="label"
                valueField="value"
                placeholder={language || "Select a language"}
                value={language}
                onFocus={() => setIsLangFocus(true)}
                onBlur={() => setIsLangFocus(false)}
                onChange={(language) => {
                  setLanguage(language.value);
                  setIsLangFocus(false);
                }}
                renderLeftIcon={() => (
                  <Ionicons
                    style={{ marginRight: 10 }}
                    color={isLangFocus ? COLORS.primary : COLORS.secondary}
                    name="menu-outline"
                    size={20}
                  />
                )}
                renderItem={(language) => {
                  return (
                    <View
                      style={{
                        padding: 17,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        borderBottomWidth: 0.5,
                        borderBottomColor: COLORS.primary,
                        backgroundColor: COLORS.background,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 16,
                          color: COLORS.primary,
                          fontWeight: "500",
                        }}
                      >
                        {language.label}
                      </Text>
                    </View>
                  );
                }}
              />

              <Button
                style={[
                  { marginTop: 10, transform: [{ scale: 0.8 }] },
                  !language && {
                    opacity: 0.5,
                  },
                ]}
                text="Update"
                outline
                disabled={!language}
                onPress={() => {
                  updateData("language", language);
                  setLanguage("");
                  setOpenedTab("");
                }}
              />
            </View>
          </ExpandableTab>
        </View>

        <View style={styles.section}>
          <Text style={styles.header}>Data</Text>
          <View style={styles.separator} />

          <ExpandableTab
            header="Location History"
            onExpand={(expanded) => {
              if (!expanded) {
                Keyboard.dismiss();
              }
            }}
            expanded={openedTap === "history"}
            onToggle={() => toggleTab("history")}
          >
            <View style={styles.content}></View>
          </ExpandableTab>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    height: `100%`,
    backgroundColor: COLORS.background,
    display: "flex",
    flexDirection: "column",
    paddingTop: 50,
    gap: 20,
  },
  profile_img: {
    width: 200,
    height: 200,
    borderRadius: `50%`,
    borderWidth: 2,
    borderColor: COLORS.primary,
    overflow: "hidden",
    marginTop: 30,
    marginBottom: 10,
  },
  profile_name: {
    fontSize: 32,
    color: COLORS.primary,
  },
  section: {
    width: `80%`,
    display: "flex",
  },
  content: {
    paddingVertical: 20,
    width: `100%`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 32,
    fontWeight: 700,
    color: COLORS.secondary,
    alignSelf: "flex-start",
  },
  separator: {
    width: `100%`,
    height: 3,
    backgroundColor: COLORS.secondary,
    marginVertical: 10,
  },
  imgInput: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    width: 200,
    height: 200,
    borderRadius: `10%`,
    borderColor: COLORS.secondary,
    borderWidth: 2,
    gap: 10,
  },
  dropdown: {
    height: 46,
    width: `90%`,
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    overflowX: "hidden",
    marginBottom: 15,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    elevation: 3,
  },
});
