import EventBox from "@/components/home-event-box";
import ScheduleBox from "@/components/home-schedule-box";
import { StyleSheet, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.mainScreen}>
      <ScheduleBox />
      <EventBox />
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
