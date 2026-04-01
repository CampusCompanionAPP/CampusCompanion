import AnimatedInput from "@/components/AnimatedInput";
import Button from "@/components/Button";
import { COLORS } from "@/constants/color";
import { class_days, course_prefix, KSU_buildings } from "@/constants/course";
import { supabase } from "@/services/database";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
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
  const [isPrefixFocus, setIsPrefixFocus] = useState(false);
  const [isDayFocus, setIsDayFocus] = useState(false);
  const [isBPrefixFocus, setIsBPrefixFocus] = useState(false);

  const [prefix, setPrefix] = useState("");
  const [courseNum, setCourseNum] = useState("");
  const [classDay, setClassDay] = useState("");
  const [classTime, setClassTime] = useState<Date | undefined>();
  const [buildPrefix, setBuildPrefix] = useState("");
  const [roomNumber, setroomNumber] = useState("");

  // useFocusEffect(
  //   useCallback(() => {
  //     return () => {
  //       setPrefix("");
  //       setCourseNum("");
  //       setClassDay("");
  //       setClassTime(undefined);
  //     };
  //   }, []),
  // );

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
            day_time: `${classDay}\n${classTime?.toLocaleTimeString([], {
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
      const errorMessage = err.message || "something went wrong";
      Alert.alert("", errorMessage, [{ text: "OK" }]);
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
        {prefix && courseNum.length === 4 ? `${prefix} ${courseNum}` : "Course"}
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
        placeholder="Select a course prefix"
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
        placeholder="Course Number"
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
          ? `${class_days.find((day) => day.prefix === classDay)?.label} \n starting at ${classTime.toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              },
            )}`
          : "Class Day & Time"}
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
        data={class_days}
        labelField="prefix"
        valueField="prefix"
        placeholder="Select a course day"
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
                {day.label}
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
          ? `located at\n ${buildPrefix} ${roomNumber}`
          : "Location"}
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
        placeholder="Select a building code"
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
        placeholder="Room Number"
        style={{ width: `100%`, height: `100%`, textAlign: "center" }}
        keyboardType="number-pad"
        maxLength={3}
        onChangeText={(num) => {
          setroomNumber(num);
          if (num.length === 3) Keyboard.dismiss();
        }}
      />

      <Button
        text="Add a schedule"
        outline
        style={[
          { marginTop: 10 },
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
          router.back();
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
