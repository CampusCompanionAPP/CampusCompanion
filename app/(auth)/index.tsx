import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Link, router } from 'expo-router';

export default function AuthLanding() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("@/assets/images/ksu-logo-emblem.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>
          Start your journey with{"\n"}your portable guide.
        </Text>

        <Pressable
          onPress={() => router.push("/(auth)/sign-up")} // replace with /sign-up if you have it
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
          ]}
        >
          <Text style={styles.primaryButtonText}>Create account</Text>
        </Pressable>

        <Text style={styles.helperText}>Already have an account?</Text>

        <Link href="/(auth)/sign-in" asChild>
          <Pressable
            style={({ pressed }) => [
              styles.outlineButton,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.outlineButtonText}>Sign in</Text>
          </Pressable>
        </Link>

        <Pressable onPress={() => router.replace("/")} style={styles.guestWrap}>
          <Text style={styles.guestText}>Sign in as guest</Text>
        </Pressable>
      </View>
    </View>
  );
}

const GOLD = '#FDBB30';
const BG = '#20201B';
const MUTED = '#CFCFCF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 230,
    height: 230,
    marginBottom: 18,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 26,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 18,
  },
  primaryButtonText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '700',
  },
  helperText: {
    color: MUTED,
    fontSize: 14,
    marginBottom: 12,
  },
  outlineButton: {
    width: '100%',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: GOLD,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: 'transparent',
  },
  outlineButtonText: {
    color: GOLD,
    fontSize: 16,
    fontWeight: '700',
  },
  guestWrap: {
    paddingVertical: 8,
  },
  guestText: {
    color: MUTED,
    fontSize: 14,
    fontWeight: '600',
  },
});
