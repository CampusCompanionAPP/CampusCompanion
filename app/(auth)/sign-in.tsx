import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSignIn } from "@clerk/clerk-expo";
import type { EmailCodeFactor } from "@clerk/types";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import { Image, Pressable, StyleSheet, TextInput, View } from "react-native";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [showEmailCode, setShowEmailCode] = React.useState(false);

  // Handle the submission of the sign-in form
  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Check for tasks and navigate to custom UI to help users resolve them
              // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
              console.log(session?.currentTask);
              return;
            }

            router.replace("/");
          },
        });
      } else if (signInAttempt.status === "needs_second_factor") {
        // Check if email_code is a valid second factor
        // This is required when Client Trust is enabled and the user
        // is signing in from a new device.
        // See https://clerk.com/docs/guides/secure/client-trust
        const emailCodeFactor = signInAttempt.supportedSecondFactors?.find(
          (factor): factor is EmailCodeFactor =>
            factor.strategy === "email_code",
        );

        if (emailCodeFactor) {
          await signIn.prepareSecondFactor({
            strategy: "email_code",
            emailAddressId: emailCodeFactor.emailAddressId,
          });
          setShowEmailCode(true);
        }
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, signIn, setActive, router, emailAddress, password]);

  // Handle the submission of the email verification code
  const onVerifyPress = React.useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code,
      });

      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Check for tasks and navigate to custom UI to help users resolve them
              // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
              console.log(session?.currentTask);
              return;
            }

            router.replace("/");
          },
        });
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, signIn, setActive, router, code]);

  // Display email code verification form
  if (showEmailCode) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Verify your email
        </ThemedText>
        <ThemedText style={styles.description}>
          A verification code has been sent to your email.
        </ThemedText>
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter verification code"
          placeholderTextColor="#666666"
          onChangeText={(code) => setCode(code)}
          keyboardType="numeric"
        />
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={onVerifyPress}
        >
          <ThemedText style={styles.buttonText}>Verify</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require("@assets/images/KSU_logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      {/* <ThemedText type="title" style={styles.title}>
        Sign in
      </ThemedText> */}
      {/* <ThemedText style={styles.label}>Email address</ThemedText> */}
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email"
        placeholderTextColor="#C5C6C8"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        keyboardType="email-address"
      />
      {/* <ThemedText style={styles.label}>Password</ThemedText> */}
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Password"
        placeholderTextColor="#C5C6C8"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />

      <View style={styles.linkContainer}>
        <ThemedText>Don&apos;t have an account? </ThemedText>
        <Link href="/sign-up">
          <ThemedText type="link" style={{ color: "#FDBB30" }}>
            Sign up
          </ThemedText>
        </Link>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          (!emailAddress || !password) && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={onSignInPress}
        disabled={!emailAddress || !password}
      >
        <ThemedText style={styles.buttonText}>Sign in</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const GOLD = "#FDBB30";
const BG = "#20201B";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    // gap: 12,
    backgroundColor: BG,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  logo: {
    marginTop: 91,
    width: 157,
    height: 148,
    marginBottom: 38,
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
  input: {
    width: 288,
    borderWidth: 2,
    borderColor: "#C5C6C8",
    padding: 12,
    fontSize: 16,
    backgroundColor: "transparent",
    marginBottom: 11,
  },
  button: {
    width: 288,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: GOLD,
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
    color: GOLD,
    fontWeight: "600",
  },
  linkContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    marginBottom: 11,
  },
});
