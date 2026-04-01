import { StyleSheet, Text, View } from "react-native";

export default function EventCard() {
  return (
    <View style={styles.eventCard}>
      <View style={styles.eventCardTitle}>
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
          Upcoming Events
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 45,
          }}
        >
          View all
        </Text>
      </View>
      <View style={styles.eventInfo}>
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          Career Fair:
        </Text>
        <Text style={{ color: "white", fontSize: 14 }}>
          12:00 PM Student Center
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    position: "relative",
    top: 5,
    borderRadius: 20,
    height: "30%",
    width: "80%",
    backgroundColor: "#484848",
    padding: 15,
  },
  eventCardTitle: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  eventInfo: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "baseline",
  },
});
