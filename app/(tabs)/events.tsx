import EventBox from "@/components/event-box";
import { StyleSheet, View } from "react-native";


export default function Events() {
  return (
      <View style={styles.eventScreen}>
        <EventBox event={{}} />
      </View>
    );
}
const styles = StyleSheet.create({
  eventScreen: {
    flex: 1,
    backgroundColor: "#20201B",
    alignItems: "center",
    justifyContent: "center",
  },
  textColor: {
    color: "white",
  },
});