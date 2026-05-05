import i18n from "@/i18n";
import { locales } from "@/src/constants/language";
import Button from "@src/components/Button";
import Loading from "@src/components/Loading";
import { COLORS } from "@src/constants/color";
import { supabase } from "@src/services/database";
import {
  fetchSchedule,
  fetchUser,
  fetchUserData,
  UserData,
} from "@src/services/userService";
import { User } from "@supabase/supabase-js";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Home() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>();
  const [userData, setUserData] = useState<UserData | null>();
  const [scheduleData, setScheduleData] = useState<any[] | null>();
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const load = useCallback(async () => {
    const user = await fetchUser();
    setUser(user);

    if (!user?.is_anonymous) {
      const data = await fetchUserData();
      setUserData(data);
      const schedule = await fetchSchedule();
      setScheduleData(schedule);
    } else {
      setUserData(null);
      setScheduleData([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      // setIsLoading(true);
      load().finally(() => setIsLoading(false));
    }, [load]),
  );

  const deleteSchedule = async (id: any) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("schedules")
        .delete()
        .eq("schedule_id", id);

      if (error) throw error;

      await load();
    } catch (err: any) {
      Alert.alert("", t("normal.err-msg"), [{ text: t("normal.ok") }]);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatLocalTime = (time: string) => {
    const isPM = time.includes("PM");
    const isAM = time.includes("AM");

    let [hours, minutes] = time
      .replace(/(AM|PM)/, "")
      .split(":")
      .map(Number);

    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.toLocaleTimeString(i18n.language, {
      hour: "2-digit",
      minute: "2-digit",

      hour12: true,
    });
  };

  if (userData === undefined || scheduleData === undefined) return <Loading />;

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
          // paddingTop: 60,
          paddingBottom: insets.bottom + 10,
        }}
      >
        <Text
          style={{
            color: "#FFF",
            fontSize: 24,
            marginTop: `10%`,
            textAlign: "center",
            marginInline: 30,
            fontWeight: 800,
            // marginBottom: 10,
            // position: "absolute",
            // top: 75,
          }}
        >
          {(date.getHours() < 12 && t("home.mor")) ||
            (date.getHours() >= 18 && t("home.eve")) ||
            t("home.aft")}
          {", "}
          {userData?.username || "Owl"}
        </Text>
        <Text
          style={{
            color: "#FFF",
            fontSize: 20,
            marginTop: 5,
            // marginBottom: 10,
            // position: "absolute",
            // top: 100,
          }}
        >
          {date.toLocaleString(locales[userData?.language || "English"], {
            weekday: "long",
            month: "long",
            day: "2-digit",
            year: "numeric",
          })}
        </Text>

        <Text style={{ color: "#FFF", fontSize: 18, marginTop: 10 }}>
          {date.toLocaleTimeString(locales[userData?.language || "English"], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}
        </Text>

        {user?.is_anonymous ? (
          <Image
            source={require("@assets/images/KSU_logo_2.png")}
            style={{
              width: 350,
              height: 350,
              tintColor: COLORS.secondary,
              marginTop: 100,
            }}
          />
        ) : (
          <View
            style={{
              width: `80%`,
              // height: `50%`,
              height: 500,
              backgroundColor: "#484848",
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <View
              style={{
                width: `100%`,
                height: "auto",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
                marginBlock: 10,
              }}
            >
              <Image
                source={require("@/assets/images/KSU_logo.png")}
                style={{ width: 35, height: 35 }}
              />
              <Text
                style={{
                  fontSize: 24,
                  color: "white",

                  fontWeight: "bold",
                }}
              >
                {t("home.course")}
              </Text>
            </View>

            <ScrollView style={{ width: `100%` }}>
              {/* {scheduleData} */}

              {isDeleting ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
              ) : (
                scheduleData &&
                scheduleData.map((data) => (
                  <Pressable
                    key={data.schedule_id}
                    style={({ pressed }) => [
                      {
                        height: 70,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingInline: 10,
                        marginInline: 5,
                        marginBlock: 10,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: COLORS.primary,
                      },
                      pressed && {
                        backgroundColor: COLORS.primary,
                      },
                    ]}
                    onLongPress={() => {
                      Alert.alert(t("home.delete"), data.course, [
                        {
                          text: t("normal.ok"),
                          onPress: () => deleteSchedule(data.schedule_id),
                        },
                        { text: t("normal.cancel") },
                      ]);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: COLORS.secondary,
                        textAlign: "center",
                      }}
                    >
                      {data.course}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: COLORS.secondary,
                        textAlign: "center",
                      }}
                    >
                      {t("home." + data.day_time.split(/\s(?=\d)/)[0]) +
                        "\n" +
                        formatLocalTime(data.day_time.split(/\s(?=\d)/)[1])}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: COLORS.secondary,
                        textAlign: "center",
                      }}
                    >
                      {data.location}
                    </Text>
                  </Pressable>
                ))
              )}
            </ScrollView>
            <Link href={"/modal"} asChild>
              <Button
                text="+"
                width={50}
                height={50}
                textSize={24}
                textWeight={800}
                style={{ marginBlock: 5 }}
                outline
              />
            </Link>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: COLORS.background,
    // alignItems: "center",
    // justifyContent: "flex-start",
  },
  textColor: {
    color: "white",
  },
});
