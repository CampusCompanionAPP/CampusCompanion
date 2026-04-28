import i18n from "@/i18n";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AnimatedInput from "@src/components/AnimatedInput";
import Button from "@src/components/Button";
import { COLORS } from "@src/constants/color";
import {
  class_days,
  course_prefix,
  KSU_buildings,
} from "@src/constants/course";
import { supabase } from "@src/services/database";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const Modal = () => {
  const { t } = useTranslation();

  const [isPrefixFocus, setIsPrefixFocus] = useState(false);
  const [isDayFocus, setIsDayFocus] = useState(false);
  const [isBPrefixFocus, setIsBPrefixFocus] = useState(false);

  const [prefix, setPrefix] = useState("");
  const [courseNum, setCourseNum] = useState("");
  const [classDay, setClassDay] = useState("");
  const [classTime, setClassTime] = useState<Date | undefined>();
  const [buildPrefix, setBuildPrefix] = useState("");
  const [roomNumber, setroomNumber] = useState("");

  const addCourse = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) throw error;

      if (user) {
        const { error: dbError } = await supabase.from("schedules").insert([
          {
            usr_id: user.id,
            course: `${prefix} ${courseNum}`,
            day_time: `${classDay} ${classTime?.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",

              hour12: true,
            })}`,
            location: `${buildPrefix} ${roomNumber}`,
          },
        ]);

        if (dbError) {
          console.error(dbError.message);
        }
      }
    } catch (err: any) {
      Alert.alert("", t("normal.err-msg"), [{ text: t("normal.ok") }]);
    } finally {
      router.back();
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        alignItems: "center",
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={{
          color:
            prefix && courseNum.length === 4
              ? COLORS.primary
              : COLORS.secondary,
          marginBottom: 30,
          fontSize: 18,
          textAlign: "center",
        }}
      >
        {prefix && courseNum.length === 4
          ? `${prefix} ${courseNum}`
          : t("home.c")}
      </Text>
      <Dropdown
        style={[
          styles.dropdown,
          isPrefixFocus && { borderColor: COLORS.primary },
        ]}
        placeholderStyle={{
          fontSize: 16,
          color: COLORS.secondary,
          textAlign: "center",
        }}
        selectedTextStyle={{
          fontSize: 14,
          fontWeight: "600",
          color: COLORS.primary,
          textAlign: "center",
        }}
        containerStyle={{
          borderRadius: 12,
          borderWidth: 2,
          borderColor: COLORS.primary,
          marginTop: 8,
          overflow: "hidden",
          backgroundColor: COLORS.background,
        }}
        data={course_prefix}
        labelField="prefix"
        valueField="prefix"
        placeholder={t("home.pre")}
        value={prefix}
        onFocus={() => setIsPrefixFocus(true)}
        onBlur={() => setIsPrefixFocus(false)}
        onChange={(p) => {
          setPrefix(p.prefix);
          setIsPrefixFocus(false);
        }}
        renderLeftIcon={() => (
          <Ionicons
            style={{ marginRight: 10 }}
            color={isPrefixFocus ? COLORS.primary : COLORS.secondary}
            name="menu-outline"
            size={20}
          />
        )}
        renderItem={(p) => {
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
                {p.label}
              </Text>
            </View>
          );
        }}
      />

      <AnimatedInput
        value={courseNum}
        placeholder={t("home.num")}
        style={{ width: `100%`, height: `100%`, textAlign: "center" }}
        keyboardType="number-pad"
        maxLength={4}
        onChangeText={(num) => {
          setCourseNum(num);
          if (num.length === 4) Keyboard.dismiss();
        }}
      />

      <View
        style={{
          width: `100%`,
          height: 1,
          backgroundColor: COLORS.secondary,
          marginBlock: 30,
        }}
      />

      <Text
        style={{
          color: classDay && classTime ? COLORS.primary : COLORS.secondary,
          marginBottom: 30,
          fontSize: 18,
          textAlign: "center",
        }}
      >
        {classDay && classTime
          ? `${t(`home.${class_days.find((day) => day.prefix === classDay)?.label}`)} \n ${t("home.start")} ${classTime.toLocaleTimeString(
              i18n.language,
              {
                hour: "2-digit",
                minute: "2-digit",
              },
            )}`
          : t("home.daytime")}
      </Text>

      <Dropdown
        style={[styles.dropdown, isDayFocus && { borderColor: COLORS.primary }]}
        placeholderStyle={{
          fontSize: 16,
          color: COLORS.secondary,
          textAlign: "center",
        }}
        selectedTextStyle={{
          fontSize: 14,
          fontWeight: "600",
          color: COLORS.primary,
          textAlign: "center",
        }}
        containerStyle={{
          borderRadius: 12,
          borderWidth: 2,
          borderColor: COLORS.primary,
          marginTop: 8,
          overflow: "hidden",
          backgroundColor: COLORS.background,
        }}
        data={class_days.map((day) => ({
          ...day,
          translatedPrefix: t("home." + day.prefix),
        }))}
        labelField="translatedPrefix"
        valueField="prefix"
        placeholder={t(`home.day`)}
        value={classDay}
        onFocus={() => setIsDayFocus(true)}
        onBlur={() => setIsDayFocus(false)}
        onChange={(day) => {
          setClassDay(day.prefix);
          setIsDayFocus(false);
        }}
        renderLeftIcon={() => (
          <Ionicons
            style={{ marginRight: 10 }}
            color={isDayFocus ? COLORS.primary : COLORS.secondary}
            name="menu-outline"
            size={20}
          />
        )}
        renderItem={(day) => {
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
                {t(`home.${day.label}`)}
              </Text>
            </View>
          );
        }}
      />

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
        }}
        value={classTime || new Date()}
        mode="time"
        locale={i18n.language}
        onChange={(_, time) => setClassTime(time)}
      />

      <View
        style={{
          width: `100%`,
          height: 1,
          backgroundColor: COLORS.secondary,
          marginBlock: 30,
        }}
      />

      <Text
        style={{
          color:
            buildPrefix && roomNumber.length === 3
              ? COLORS.primary
              : COLORS.secondary,
          marginBottom: 30,
          fontSize: 18,
          textAlign: "center",
        }}
      >
        {buildPrefix && roomNumber.length === 3
          ? `${t("home.la")}\n ${buildPrefix} ${roomNumber}`
          : t("home.loc")}
      </Text>

      <Dropdown
        style={[
          styles.dropdown,
          isBPrefixFocus && { borderColor: COLORS.primary },
        ]}
        placeholderStyle={{
          fontSize: 16,
          color: COLORS.secondary,
          textAlign: "center",
        }}
        selectedTextStyle={{
          fontSize: 14,
          fontWeight: "600",
          color: COLORS.primary,
          textAlign: "center",
        }}
        containerStyle={{
          borderRadius: 12,
          borderWidth: 2,
          borderColor: COLORS.primary,
          marginTop: 8,
          overflow: "hidden",
          backgroundColor: COLORS.background,
        }}
        data={KSU_buildings}
        labelField="code"
        valueField="code"
        placeholder={t("home.code")}
        value={buildPrefix}
        onFocus={() => setIsBPrefixFocus(true)}
        onBlur={() => setIsBPrefixFocus(false)}
        onChange={(build) => {
          setBuildPrefix(build.code);
          setIsBPrefixFocus(false);
        }}
        renderLeftIcon={() => (
          <Ionicons
            style={{ marginRight: 10 }}
            color={isBPrefixFocus ? COLORS.primary : COLORS.secondary}
            name="menu-outline"
            size={20}
          />
        )}
        renderItem={(build) => {
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
                {build.name}
              </Text>
            </View>
          );
        }}
      />
      <AnimatedInput
        value={roomNumber}
        placeholder={t("home.rnum")}
        style={{ width: `100%`, height: `100%`, textAlign: "center" }}
        keyboardType="number-pad"
        maxLength={3}
        onChangeText={(num) => {
          setroomNumber(num);
          if (num.length === 3) Keyboard.dismiss();
        }}
      />

      <Button
        text={t("home.add")}
        outline
        style={[
          { marginTop: 30 },
          (!prefix ||
            courseNum.length !== 4 ||
            !classDay ||
            !classTime ||
            !buildPrefix ||
            roomNumber.length !== 3) && {
            opacity: 0.5,
          },
        ]}
        onPress={async () => {
          addCourse();
        }}
        disabled={
          !prefix ||
          courseNum.length !== 4 ||
          !classDay ||
          !classTime ||
          !buildPrefix ||
          roomNumber.length !== 3
        }
      />
    </ScrollView>
  );
};

export default Modal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: COLORS.background,
  },
  input: { height: 50, borderWidth: 1, borderColor: "#ccc", padding: 10 },
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
