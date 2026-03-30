import { COLORS } from "@/constants/color";
import React from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { ThemedText } from "./themed-text";

interface ButtonProps extends PressableProps {
  text: string;
  outline?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Button: React.FC<ButtonProps> = ({
  text,
  outline = false,
  style,
  ...props
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        outline ? styles.outline_button : styles.button,
        pressed
          ? outline
            ? styles.outline_pressed
            : styles.button_pressed
          : null,
        style,
      ]}
      {...props}
    >
      {({ pressed }) => (
        <ThemedText
          style={[
            outline ? styles.outline_buttonText : styles.buttonText,
            pressed ? (outline ? { color: "#FFFFFF" } : null) : null,
          ]}
        >
          {text}
        </ThemedText>
      )}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  outline_button: {
    width: 288,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "transparent",
  },

  outline_buttonText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 16,
  },

  outline_pressed: {
    backgroundColor: COLORS.primary,
    transform: [{ scale: 0.98 }],
  },

  button: {
    width: 288,
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#000000",
    fontWeight: "600",
    fontSize: 16,
  },

  button_pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
