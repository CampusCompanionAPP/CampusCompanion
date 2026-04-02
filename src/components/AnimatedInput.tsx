import { COLORS } from "@src/constants/color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";

interface AnimatedInputProps extends TextInputProps {
  value: any;
  placeholder: string;
  style?: StyleProp<TextStyle>;
  isPasswordField?: boolean;
  noAnimation?: boolean;
  width?: any;
  height?: any;
  placeholderSize?: any;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  value,
  placeholder,
  style,
  isPasswordField = false,
  noAnimation = false,
  width = 288,
  height = 46,
  placeholderSize = 16,
  ...props
}) => {
  const animated = useRef(new Animated.Value(value ? 1 : 0)).current;
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const floatingLabelStyle = {
    top: animated.interpolate({
      inputRange: [0, 1],
      outputRange: [12, -10],
    }),
    fontSize: animated.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animated.interpolate({
      inputRange: [0, 1],
      outputRange: [
        COLORS.secondary,
        value && !isFocused ? COLORS.secondary : COLORS.primary,
      ],
    }),
  };

  return (
    <View
      style={[
        styles.inputWrapper,
        isFocused && styles.inputWrapperHover,
        { width: width, height: height },
      ]}
    >
      {!noAnimation && (
        <Animated.Text style={[styles.floatingLabel, floatingLabelStyle]}>
          {placeholder}
        </Animated.Text>
      )}

      <TextInput
        underlineColorAndroid={"transparent"}
        selectionColor={COLORS.primary}
        style={[
          styles.wrappedInput,
          { fontSize: placeholderSize },
          Platform.OS === "web" && ({ outlineStyle: "none" } as any),
          style,
          isPasswordField && { width: `90%`, marginLeft: -7, marginRight: 10 },
          noAnimation && { textAlign: "center", fontSize: 16 },
        ]}
        value={value}
        placeholder={noAnimation ? placeholder : ""}
        placeholderTextColor={COLORS.secondary}
        onFocus={() => {
          setIsFocused(true);
          Animated.timing(animated, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }).start();
        }}
        onBlur={() => {
          setIsFocused(false);

          if (!value) {
            Animated.timing(animated, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }).start();
          }
        }}
        secureTextEntry={!isPasswordVisible && isPasswordField}
        autoCapitalize="none"
        spellCheck={false}
        autoCorrect={false}
        {...props}
      />
      {isPasswordField && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={{ position: "absolute", alignSelf: "flex-end", right: 5 }}
        >
          <MaterialCommunityIcons
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={24}
            color={isFocused ? COLORS.primary : COLORS.secondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AnimatedInput;

const styles = StyleSheet.create({
  inputWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    // width: 288,
    // height: 46,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    // padding: 12,
    paddingEnd: 12,
    backgroundColor: "transparent",
    marginBottom: 11,
    color: COLORS.primary,
    zIndex: -2,
  },
  inputWrapperHover: {
    borderColor: COLORS.primary,
  },
  wrappedInput: {
    width: `100%`,
    height: `100%`,
    marginLeft: 10,
    color: COLORS.primary,
    // fontSize: 16,
  },
  floatingLabel: {
    position: "absolute",
    left: 5,
    // color: COLORS.primary,
    backgroundColor: COLORS.background,

    paddingHorizontal: 5,
    zIndex: -1,
  },
});
