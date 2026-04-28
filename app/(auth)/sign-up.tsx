import OtpInput from "@bhojaniasgar/react-native-otp-input";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AnimatedInput from "@src/components/AnimatedInput";
import { ThemedText } from "@src/components/themed-text";
import { ThemedView } from "@src/components/themed-view";
import Timer from "@src/components/Timer";
import { COLORS } from "@src/constants/color";
import { supabase } from "@src/services/database";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-root-toast";

export default function Page() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const { t } = useTranslation();

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     if (session) {
  //       router.replace("/(auth)/set-up");
  //     }
  //   });

  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_, session) => {
  //     if (session) {
  //       router.replace("/(auth)/set-up");
  //     }
  //   });

  //   return () => subscription.unsubscribe();
  // }, []);

  const onSignUpPress = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) throw error;
      else if (
        data.user &&
        data.user.identities &&
        data.user.identities.length === 0
      ) {
        Alert.alert(t("sign-up.email-err"), "", [{ text: t("normal.ok") }]);
        return;
      }

      setPendingVerification(true);
    } catch (err: any) {
      const errorMessage = err.message || t("normal.err-msg");
      Toast.show(errorMessage, {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        hideOnPress: true,
        backgroundColor: COLORS.danger,
        textColor: "#FFFFFF",
      });
    }
  };

  const onVerifyPress = async (code: string) => {
    if (!email || !code) return;

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code.trim(),
        type: "signup",
      });

      if (error) throw error;

      if (data.user) {
        const { error: dbError } = await supabase.from("users").insert([
          {
            usr_id: data.user.id,
            username: name.trim(),
            email: email.trim(),
            password: password.trim(),
            first_name: "",
            last_name: "",
            img_url: "",
            degree: "",
            major: "",
            grad_date: null,
            language: "English",
          },
        ]);

        if (dbError) {
          console.error(dbError.message);
        }
      }

      router.replace("/(auth)");

      // if (data.session) {
      //   router.replace("/(auth)/set-up");
      // }
    } catch (err: any) {
      const errorMessage = err.message || t("normal.err-msg");
      Alert.alert("", errorMessage, [{ text: t("normal.ok") }]);

      // Toast.show(errorMessage, {
      //   duration: Toast.durations.LONG,
      //   position: Toast.positions.CENTER,
      //   shadow: true,
      //   hideOnPress: true,
      //   backgroundColor: COLORS.danger,
      //   textColor: "#FFFFFF",
      // });
    }
  };

  if (pendingVerification) {
    return (
      <ThemedView style={[styles.container, { alignItems: "center" }]}>
        <ThemedText type="title" style={[styles.title, { marginTop: 250 }]}>
          {t("sign-up.veriTitle")}
        </ThemedText>

        <ThemedText style={styles.description}>
          {t("sign-up.veriDesc")}
        </ThemedText>

        <OtpInput
          pinCount={6}
          code={code}
          selectionColor={"transparent"}
          autoFocusOnLoad
          editable
          containerStyle={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "auto",
          }}
          size="custom"
          codeInputFieldStyle={{
            flex: 1,
            outline: "none",
            borderColor: COLORS.secondary,
            color: COLORS.secondary,
            borderWidth: 2,
            width: 60,
            height: 60,
          }}
          filledInputFieldStyle={{
            outline: "none",
            borderColor: COLORS.primary,
            color: COLORS.primary,
          }}
          codeInputHighlightStyle={{
            outline: "none",
            borderColor: COLORS.secondary,
            borderWidth: 3.5,
          }}
          errorInputFieldStyle={{
            outline: "none",
            borderColor: COLORS.danger,
            color: COLORS.danger,
          }}
          onCodeChanged={(code) => setCode(code || "")}
          onCodeFilled={(code) => {
            onVerifyPress(code);
          }}
        />

        <Timer
          seconds={120}
          style={{ fontSize: 24, color: COLORS.secondary, paddingTop: 10 }}
        />
      </ThemedView>
    );
  }

  const getPasswordValidations = (password: string) => [
    { label: t("sign-up.crit1"), valid: password.length >= 12 },
    { label: t("sign-up.crit2"), valid: /\d/.test(password) },
    {
      label: t("sign-up.crit3"),
      valid: /[@$!%*?&]/.test(password),
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
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
      <Text style={[styles.title, { marginTop: -20, marginBottom: 20 }]}>
        {t("sign-up.title")}
      </Text>

      <AnimatedInput
        value={name}
        placeholder={t("sign-up.usr")}
        onChangeText={(name) => setName(name)}
      />

      <AnimatedInput
        value={email}
        placeholder={t("sign-up.email")}
        onChangeText={(email) => setEmail(email)}
        keyboardType="email-address"
      />

      <AnimatedInput
        value={password}
        placeholder={t("sign-up.pass")}
        onChangeText={(password) => setPassword(password)}
        isPasswordField
      />

      <View style={styles.passwordValidationContainer}>
        {getPasswordValidations(password).map((item, index) => (
          <View
            key={index}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 3,
            }}
          >
            <MaterialCommunityIcons
              name={item.valid ? "check-circle-outline" : "circle-outline"}
              size={14}
              color={item.valid ? COLORS.primary : COLORS.danger}
            />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: item.valid ? COLORS.primary : COLORS.danger,
                marginBlock: 1,
              }}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          (!name ||
            !email ||
            !getPasswordValidations(password).every((item) => item.valid)) &&
            styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={onSignUpPress}
        disabled={
          !name ||
          !email ||
          !getPasswordValidations(password).every((item) => item.valid)
        }
      >
        <ThemedText style={styles.buttonText}>{t("sign-up.btn1")}</ThemedText>
      </Pressable>

      <View style={styles.linkContainer}>
        <ThemedText style={{ color: COLORS.secondary }}>
          {t("sign-up.link1")}{" "}
        </ThemedText>
        <Link href="/sign-in">
          <ThemedText
            type="link"
            style={{ color: COLORS.primary, fontWeight: 600 }}
          >
            {t("sign-up.link2")}
          </ThemedText>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  logo: { width: 157, height: 148, marginBottom: 38 },
  title: {
    // marginBottom: 8,
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: 500,
  },
  passwordValidationContainer: {
    width: 288,
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
  },
  passwordValidationList: {
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    color: COLORS.secondary,
    textAlign: "center",
  },
  button: {
    width: 288,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "transparent",
    marginTop: 20,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  linkContainer: {
    flexDirection: "row",
    gap: 4,
    marginTop: 12,
    alignItems: "center",
  },
});
