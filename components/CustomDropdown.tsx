import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

// Define the shape of your data
interface DropdownItem {
  label: string;
  value: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

const data: DropdownItem[] = [
  { label: "Profile", value: "profile", icon: "person-outline" },
  { label: "Settings", value: "settings", icon: "settings-outline" },
  {
    label: "Support",
    value: "help-circle-outline",
    icon: "help-circle-outline",
  },
  { label: "Logout", value: "logout", icon: "log-out-outline" },
];

export default function CustomDropdown() {
  const [value, setValue] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  const router = useRouter();

  // Custom renderer for each row in the list
  const renderItem = (item: DropdownItem) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.icon && <Ionicons name={item.icon} size={20} color="#555" />}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Dropdown
        style={[
          styles.dropdown,
          isFocus && { borderColor: "#007AFF", borderWidth: 2 },
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        containerStyle={styles.listContainer} // Styles the popup box
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Select an option"
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
          // Example: Navigate using Expo Router
          if (item.value !== "logout") {
          }
        }}
        renderLeftIcon={() => (
          <Ionicons
            style={styles.icon}
            color={isFocus ? "#007AFF" : "#888"}
            name="menu-outline"
            size={20}
          />
        )}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: "100%",
  },
  dropdown: {
    height: 55,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
  },
  listContainer: {
    borderRadius: 12,
    marginTop: 8,
    overflow: "hidden",
  },
  icon: {
    marginRight: 10,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#888",
  },
  selectedTextStyle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
});
