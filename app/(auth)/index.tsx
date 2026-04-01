import Button from "@/components/Button";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function AuthLanding() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("@/assets/images/KSU_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>
          Start your journey with{"\n"}your portable guide.
        </Text>

        {/* <Pressable
          onPress={() => router.push("/(auth)/sign-up")}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
          ]}
        >
          <Text style={styles.primaryButtonText}>Create account</Text>
        </Pressable> */}

        <Button
          text="Create account"
          style={{
            backgroundColor: "#FFF",
            borderColor: "#FFF",
            marginBottom: 48,
          }}
          onPress={() => router.push("/(auth)/sign-up")}
        />

        <Text style={styles.helperText}>Already have an account?</Text>

        {/* <Link href="/(auth)/sign-in" asChild> */}
        {/* <Pressable
          onPress={() => router.push("/(auth)/sign-in")}
          style={({ pressed }) => [
            styles.outlineButton,
            pressed && {
              opacity: 0.9,
              transform: [{ scale: 0.99 }],
            },
          ]}
        >
          <Text style={styles.outlineButtonText}>Sign in</Text>
        </Pressable> */}
        {/* </Link> */}

        <Button
          text="Sign in"
          outline
          style={{ marginBottom: 7 }}
          onPress={() => router.push("/(auth)/sign-in")}
        />

        <Pressable
          onPress={() => router.replace("/(tabs)/(home)")}
          style={styles.guestWrap}
        >
          <Text style={styles.guestText}>Sign in as guest</Text>
        </Pressable>
      </View>
    </View>
  );
}

const GOLD = "#FDBB30";
const BG = "#20201B";
const MUTED = "#CFCFCF";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    // paddingHorizontal: 30,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    marginTop: 91,
  },
  logo: {
    width: 157,
    height: 148,
    marginBottom: 20,
    marginTop: 90,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 48,
  },
  primaryButton: {
    width: 288,
    backgroundColor: "white",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 48,
  },
  primaryButtonText: {
    color: "#111",
    fontSize: 16,
    fontWeight: "700",
  },
  helperText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: 400,
    marginBottom: 23,
  },
  outlineButton: {
    width: 288,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: GOLD,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 7,
    backgroundColor: "transparent",
  },
  outlineButtonText: {
    color: GOLD,
    fontSize: 16,
    fontWeight: "700",
  },
  guestWrap: {
    paddingVertical: 14,
  },
  guestText: {
    color: "#C5C6C8",
    fontSize: 14,
    fontWeight: "600",
  },
});
