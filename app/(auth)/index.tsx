import { supabase } from "@/src/services/database";
import Button from "@src/components/Button";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function AuthLanding() {
  const { t } = useTranslation();

  const onSignInAnony = async () => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) throw new Error();

      router.replace("/(tabs)/(home)");
    } catch (err) {
      Alert.alert(t("normal.err-msg"), "", [{ text: t("normal.ok") }]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("@/assets/images/KSU_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>
          {/* Start your journey with{"\n"}your portable guide. */}
          {t("auth.title")}
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
          text={t("auth.btn1")}
          style={{
            backgroundColor: "#FFF",
            borderColor: "#FFF",
            marginBottom: 48,
          }}
          onPress={() => router.push("/(auth)/sign-up")}
        />

        <Text style={styles.helperText}>{t("auth.helper")}</Text>

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
          text={t("auth.btn2")}
          outline
          style={{ marginBottom: 7 }}
          onPress={() => router.push("/(auth)/sign-in")}
        />

        <Pressable
          onPress={() => onSignInAnony()}
          style={({ pressed }) => [
            styles.guestWrap,
            pressed && { opacity: 0.5 },
          ]}
        >
          <Text style={styles.guestText}>{t("auth.guest")}</Text>
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
