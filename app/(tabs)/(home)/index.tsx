import Button from "@/components/Button";
import Loading from "@/components/Loading";
import { COLORS } from "@/constants/color";
import { supabase } from "@/services/database";
import { fetchSchedule, fetchUserData, UserData } from "@/services/userService";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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

  const load = async () => {
    const data = await fetchUserData();
    setUserData(data);
    const schedule = await fetchSchedule();
    setScheduleData(schedule);
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      load();
      setIsLoading(false);
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
      Alert.alert("", err.message, [{ text: "OK" }]);
    } finally {
      setIsDeleting(false);
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
          {(date.getHours() < 12 && "Good morning") ||
            (date.getHours() >= 18 && "Good evening") ||
            "Good afternoon"}
          {", "}
          {userData?.username}
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
          {date.toLocaleString("en-US", {
            weekday: "long",
            month: "long",
            day: "2-digit",
            year: "numeric",
          })}
        </Text>
        <Text style={{ color: "#FFF", fontSize: 18, marginTop: 10 }}>
          {date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}
        </Text>
        {/* <ScheduleCard /> */}

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
              {/* Today&apos;s Schedule */}
              Course Schedule
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
                    Alert.alert("Delete a Schedule", data.course, [
                      {
                        text: "Ok",
                        onPress: () => deleteSchedule(data.schedule_id),
                      },
                      { text: "Cancel" },
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
                    {data.day_time}
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

        {/* <EventCard />
        <EventCard />
        <EventCard />
        <EventCard /> */}
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
