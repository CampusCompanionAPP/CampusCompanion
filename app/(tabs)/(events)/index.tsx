import { EventCard } from "@/components/event-box";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const CATEGORIES = ["Today", "This Week", "Social", "Academic"];

const MOCK_DATA = [
  {
    id: "1",
    title: "Nature Bound Caving",
    dateLabel: "2/7 7:45 AM - 6:00 PM",
    description:
      "Come cave with us at Howard's Waterfall Cave! On this trip, you will get an introduction on how to safely navigate caves, learn about their beautiful formations, and have the chance to conquer some tight squeezes!",
    imageUrl:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=400",
  },
  {
    id: "2",
    title: "Vinyasa Yoga",
    dateLabel: "2/9 7:00 AM - 8:00 PM",
    description:
      "Vinyasa yoga is a style of yoga that matches breath to movement to achieve a continuous flow.",
    imageUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400",
  },
  {
    id: "3",
    title: "Fundraiser - Selling Cookies",
    dateLabel: "2/9 10:00 AM - 10:00 PM",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    imageUrl:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400",
  },
];

export default function EventsScreen() {
  const [activeTab, setActiveTab] = useState("Today");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Image
          source={require("@/assets/images/KSU_logo.png")}
          style={styles.logo}
        />

        <View style={styles.searchBar}>
          <Text style={styles.searchLabel}>Search</Text>
          <TextInput placeholderTextColor="#a1a1aa" style={styles.input} />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {CATEGORIES.map((category) => (
            <Pressable
              key={category}
              onPress={() => setActiveTab(category)}
              style={[styles.tab, activeTab === category && styles.activeTab]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === category && styles.activeTabText,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {MOCK_DATA.map((item) => (
          <EventCard key={item.id} event={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#20201B",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
    gap: 12,
  },
  logo: {
    width: 35,
    height: 35,
  },
  searchBar: {
    flex: 1,
    backgroundColor: "#3f3f46",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchLabel: {
    color: "#a1a1aa",
    marginRight: 8,
    fontSize: 14,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 14,
  },
  searchIcon: {
    fontSize: 18,
    color: "#FDBB30",
  },
  tabsContainer: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: "#484848",
  },
  activeTab: {
    backgroundColor: "#FDBB30",
  },
  tabText: {
    color: "#d4d4d8",
    fontWeight: "600",
  },
  activeTabText: {
    color: "black",
  },
  list: {
    paddingHorizontal: 20, // Adds that 'gutter' on the sides of the screen
    paddingBottom: 40,
  },
});
