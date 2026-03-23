import EventCard from "@/components/home-event-card";
import ScheduleCard from "@/components/home-schedule-card";
import { StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.mainScreen}>
      <Text
        style={{
          color: "white",
          fontSize: 24,
          marginBottom: 10,
          position: "absolute",
          top: 75,
        }}
      >
        Hello #name
      </Text>
      <Text
        style={{
          color: "white",
          fontSize: 24,
          marginBottom: 10,
          position: "absolute",
          top: 100,
        }}
      >
        It is (dayoftheweek), (todays date)
      </Text>
      <ScheduleCard />
      <EventCard />
    </View>
  );
}

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: "#20201B",
    alignItems: "center",
    justifyContent: "center",
  },
  textColor: {
    color: "white",
  },
});
