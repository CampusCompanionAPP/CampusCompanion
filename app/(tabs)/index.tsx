import { Image, StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.mainScreen}>
      <View style={styles.scheduleCard}>
        <View style={styles.scheduleCardTitleLine}>
          <Image
            source={require("../../assets/images/KSU_logo.png")}
            style={{ width: 35, height: 35 }}
          />
          <Text
            style={{
              fontSize: 24,
              color: "white",
              flex: 1,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Today&apos;s Schedule
          </Text>
        </View>
        <View style={styles.scheduleCardInformationTitle}>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Time
          </Text>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Course
          </Text>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Room
          </Text>
        </View>
        <View style={styles.scheduleCardClassInfo}>
          <Text style={styles.textColor}>10:00 AM</Text>
          <Text style={styles.textColor}>Linear Algebra</Text>
          <Text style={styles.textColor}>K-121</Text>
        </View>
        <View style={styles.scheduleCardClassInfo}>
          <Text style={styles.textColor}>10:00 AM</Text>
          <Text style={styles.textColor}>Linear Algebra</Text>
          <Text style={styles.textColor}>K-121</Text>
        </View>
        <View style={styles.scheduleCardClassInfo}>
          <Text style={styles.textColor}>10:00 AM</Text>
          <Text style={styles.textColor}>Linear Algebra</Text>
          <Text style={styles.textColor}>K-121</Text>
        </View>
        <View style={styles.scheduleCardClassInfo}>
          <Text style={styles.textColor}>10:00 AM</Text>
          <Text style={styles.textColor}>Linear Algebra</Text>
          <Text style={styles.textColor}>K-121</Text>
        </View>
        <View style={styles.scheduleCardScheduleBox}>
          <Text style={{ color: "black", fontSize: 18, fontWeight: "bold" }}>
            + Add Schedule
          </Text>
        </View>
      </View>

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

  // start of Schedule Card
  scheduleCard: {
    backgroundColor: "#484848",
    width: "80%",
    height: "30%",
    borderRadius: 20,
    padding: 15,
  },
  scheduleCardTitleLine: {
    marginBottom: 5,
    flexDirection: "row",
  },
  scheduleCardInformationTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    justifyContent: "space-between",
    marginHorizontal: 25,
  },
  scheduleCardClassInfo: {
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 25,
  },
  scheduleCardScheduleBox: {
    height: 30,
    borderRadius: 20,
    backgroundColor: "#FDBB30",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
  },

  // start of Event Card
  eventCard: {
    position: "relative",
    top: 70,
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
