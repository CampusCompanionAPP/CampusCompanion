import { COLORS } from "@src/constants/color";
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
  textSize?: any;
  width?: any;
  height?: any;
  textWeight?: any;
  color?: any;
}

const Button: React.FC<ButtonProps> = ({
  text,
  outline = false,
  style,
  textSize = 16,
  width = 288,
  height = 55,
  textWeight = "600",
  color = COLORS.primary,
  ...props
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        { width: width, height: height },
        outline ? styles.outline_button : styles.button,
        pressed
          ? outline
            ? styles.outline_pressed && { backgroundColor: color }
            : styles.button_pressed
          : null,
        style,
      ]}
      {...props}
    >
      {({ pressed }) => (
        <ThemedText
          style={[
            { fontSize: textSize, fontWeight: textWeight },
            outline ? { color: color } : styles.buttonText,
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
    // width: 288,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLORS.primary,
    // paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  // outline_buttonText: {
  //   color: COLORS.primary,
  //   // fontWeight: "600",
  //   // fontSize: 16,
  // },

  outline_pressed: {
    // backgroundColor: COLORS.primary,
    transform: [{ scale: 0.98 }],
  },

  button: {
    // width: 288,
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLORS.primary,
    // paddingVertical: 14,
    // height: 55,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#000000",
    // fontWeight: "600",
    // fontSize: 16,
  },

  button_pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
