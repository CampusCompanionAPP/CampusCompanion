import { CATEGORIES, MOCK_DATA } from "@/src/constants/events";
import { EventCard } from "@src/components/event-box";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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

export default function EventsScreen() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("Today");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Image
          source={require("@/assets/images/KSU_logo.png")}
          style={styles.logo}
        />

        <View style={styles.searchBar}>
          <Text style={styles.searchLabel}>{t("event.search")}</Text>
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
                {t(`event.${category}`)}
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
