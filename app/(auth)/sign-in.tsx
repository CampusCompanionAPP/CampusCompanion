import AnimatedInput from "@src/components/AnimatedInput";
import Button from "@src/components/Button";
import { ThemedText } from "@src/components/themed-text";
import { COLORS } from "@src/constants/color";
import { supabase } from "@src/services/database";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Image, ScrollView, StyleSheet, View } from "react-native";

export default function Page() {
  // const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showEmailCode, setShowEmailCode] = useState(false);

  const { t } = useTranslation();

  const onSignInPress = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      if (data.session) router.replace("/(tabs)/(home)");
    } catch (err: any) {
      const errorMessage = err.message || t("normal.err-msg");
      Alert.alert("", t("sign-in.errMsg"), [{ text: t("normal.ok") }]);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={require("@/assets/images/KSU_logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      {/* <ThemedText type="title" style={styles.title}>
        Sign in
      </ThemedText> */}
      {/* <ThemedText style={styles.label}>Email address</ThemedText> */}

      <AnimatedInput
        value={email}
        placeholder={t("sign-in.email")}
        onChangeText={(email) => setEmail(email)}
        keyboardType="email-address"
      />

      <AnimatedInput
        value={password}
        placeholder={t("sign-in.pass")}
        onChangeText={(password) => setPassword(password)}
        isPasswordField
      />

      <View style={styles.linkContainer}>
        <ThemedText style={{ color: COLORS.secondary }}>
          {t("sign-in.link1")}{" "}
        </ThemedText>
        <Link href="/sign-up">
          <ThemedText
            type="link"
            style={{ color: COLORS.primary, fontWeight: 600 }}
          >
            {t("sign-in.link2")}
          </ThemedText>
        </Link>
      </View>

      {/* <Pressable
        style={({ pressed }) => [
          styles.button,
          (!email || !password) && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        // onPress={onSignInPress}
        disabled={!email || !password}
      >
        <ThemedText style={styles.buttonText}>Sign in</ThemedText>
      </Pressable> */}

      <Button
        text={t("sign-in.btn1")}
        outline
        disabled={!email || !password}
        style={[(!email || !password) && { opacity: 0.5 }]}
        onPress={onSignInPress}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    // gap: 12,
    backgroundColor: COLORS.background,
    // justifyContent: "flex-start",
    // alignItems: "center",
  },
  logo: {
    width: 157,
    height: 148,
    marginBottom: 38,
    marginTop: 185,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    opacity: 0.8,
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
  },
  button: {
    width: 288,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 1,
  },
  buttonText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  linkContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    marginBottom: 11,
  },
});
