import i18n from "@/i18n";
import { languageOptions } from "@/src/constants/language";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AnimatedInput from "@src/components/AnimatedInput";
import Button from "@src/components/Button";
import { ThemedText } from "@src/components/themed-text";
import { ThemedView } from "@src/components/themed-view";
import { COLORS } from "@src/constants/color";
import { degreeOptions, majorOptions } from "@src/constants/degree-major";
import { supabase } from "@src/services/database";
import * as ImagePicker from "expo-image-picker";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Page = () => {
  const insets = useSafeAreaInsets();

  const [isContinue, setIsContinue] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState("");
  const [degree, setDegree] = useState("");
  const [major, setMajor] = useState("");
  const [allMajor, setAllMajor] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [graduationDate, setGraduationDate] = useState<Date | undefined>();
  const [language, setLanguage] = useState(i18n.language);
  const [isDegFocus, setIsDegFocus] = useState(false);
  const [isMajFocus, setIsMajFocus] = useState(false);
  const [isLngFocus, setIsLngFocus] = useState(false);

  const { t } = useTranslation();

  const continueCustomization = () => {
    setIsContinue(true);
  };

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(t("err.permit"), t("err.imgErr"), [{ text: t("normal.ok") }]);
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
    } else {
      Alert.alert(t("err.noSelect"), t("err.noImg"), [
        { text: t("normal.ok") },
      ]);
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
      Alert.alert("", t("normal.err-msg"), [{ text: t("normal.ok") }]);
      return null;
    }
  };

  const updateData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/(auth)");
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .update({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        img_url: await uploadImage(image, user.id),
        degree: degree,
        major: major,
        grad_date: graduationDate?.toISOString(),
        language: language,
      })
      .eq("usr_id", user.id)
      .select();

    if (error) {
      Alert.alert("", t("normal.err-msg"), [
        { text: t("normal.ok"), onPress: () => router.replace("/(auth)") },
      ]);
    } else if (data.length === 0) {
      Alert.alert("", t("err.failUpt"), [
        { text: t("normal.ok"), onPress: () => router.replace("/(auth)") },
      ]);
    } else {
      router.replace("/(tabs)/(home)");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={{
          display: !isContinue ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 28,
            marginBottom: 80,
            textAlign: "center",
          }}
        >
          {t("set-up.question")}
        </Text>
        <Button
          text={t("set-up.btn1")}
          outline
          onPress={continueCustomization}
        />
        <Link
          href="/(tabs)/(home)"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <ThemedText
            type="link"
            style={{
              color: COLORS.secondary,
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            {t("set-up.link1")}
          </ThemedText>
        </Link>
      </View>

      <ScrollView
        style={{
          display: isContinue ? "flex" : "none",
          // gap: 20,
          width: `100%`,
        }}
        contentContainerStyle={{
          justifyContent: "flex-start",
          alignItems: "center",
          marginTop: 10,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            color: COLORS.primary,
            fontSize: 32,
            fontWeight: 600,
            marginTop: 100,
            marginBottom: 25,
          }}
        >
          {t("set-up.title")}
        </Text>

        <AnimatedInput
          value={firstName}
          placeholder={t("set-up.f_name")}
          onChangeText={(firstName) => setFirstName(firstName)}
        />

        <AnimatedInput
          value={lastName}
          placeholder={t("set-up.l_name")}
          onChangeText={(lastName) => setLastName(lastName)}
        />

        <Pressable
          style={({ pressed }) => [
            {
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
              width: 200,
              height: 200,
              borderRadius: `10%`,
              borderColor: COLORS.secondary,
              borderWidth: 2,
              gap: 10,
              marginTop: 20,
              marginBottom: 30,
            },
            pressed ? { borderColor: COLORS.primary } : null,
          ]}
          onPress={selectImage}
        >
          {({ pressed }) =>
            !image ? (
              <View>
                <Ionicons
                  name="image"
                  size={24}
                  color={pressed ? COLORS.primary : COLORS.secondary}
                  style={{ alignSelf: "center" }}
                />
                <Text
                  style={{
                    color: pressed ? COLORS.primary : COLORS.secondary,
                    fontSize: 12,
                  }}
                >
                  {t("set-up.img")}
                </Text>
              </View>
            ) : (
              <Image
                style={{
                  width: `100%`,
                  height: `100%`,
                  borderRadius: `10%`,
                }}
                source={{ uri: image }}
              />
            )
          }
        </Pressable>

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
          placeholder={t("set-up.deg")}
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
          placeholder={t("set-up.maj")}
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

        <Text
          style={{
            color: COLORS.secondary,
            fontSize: 16,
            fontWeight: 600,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          {t("set-up.grad")}
        </Text>
        <DateTimePicker
          display={Platform.OS === "ios" ? "spinner" : "default"}
          textColor={COLORS.primary}
          accentColor="red"
          style={{
            maxHeight: `10%`,
            width: "auto",
            borderWidth: 2,
            borderColor: COLORS.secondary,
            borderRadius: 12,
            marginBottom: 35,
          }}
          value={graduationDate || new Date()}
          mode="date"
          minimumDate={new Date()}
          locale={i18n.language}
          onChange={(_, date) => setGraduationDate(date)}
        />

        <Dropdown
          style={[
            styles.dropdown,
            isLngFocus && { borderColor: COLORS.primary },
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
          placeholder={t("set-up.lng")}
          value={language}
          onFocus={() => setIsLngFocus(true)}
          onBlur={() => setIsLngFocus(false)}
          onChange={(language) => {
            setLanguage(language.value);
            setIsLngFocus(false);
          }}
          renderLeftIcon={() => (
            <Ionicons
              style={{ marginRight: 10 }}
              color={isDegFocus ? COLORS.primary : COLORS.secondary}
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
          text={t("set-up.btn2")}
          style={[
            (!firstName ||
              !lastName ||
              !image ||
              !degree ||
              !major ||
              !graduationDate ||
              !language) && { opacity: 0.5 },
            { marginTop: 30 },
          ]}
          outline
          disabled={
            !firstName ||
            !lastName ||
            !image ||
            !degree ||
            !major ||
            !graduationDate ||
            !language
          }
          onPress={updateData}
        />
      </ScrollView>
    </ThemedView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    height: `100%`,
    backgroundColor: COLORS.background,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 100,
  },
  dropdown: {
    height: 46,
    width: `80%`,
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
