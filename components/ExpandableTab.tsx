import { COLORS } from "@/constants/color";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ExpandableTabProps extends React.PropsWithChildren {
  header: string;
  onExpand?: (expanded: boolean) => void;
  onToggle: () => void;
  expanded: boolean;
}

const ExpandableTab: React.FC<ExpandableTabProps> = ({
  header,
  onExpand,
  onToggle,
  expanded,
  children,
}) => {
  // const [isExpanded, setIsExpanded] = useState(false);
  const animation = useSharedValue(0);
  const [measuredHeight, setMeasuredHeight] = useState(0);

  // const toggleTap = () => {
  //   const nextState = !isExpanded;
  //   setIsExpanded(nextState);
  //   animation.value = withTiming(isExpanded ? 0 : 1, { duration: 300 });

  //   if (onExpand) onExpand(nextState);
  // };

  useEffect(() => {
    const nextState = !expanded;
    animation.value = withTiming(nextState ? 0 : 1, { duration: 300 });
    if (onExpand) onExpand(!nextState);
  }, [expanded]);

  const animatedExpandStyle = useAnimatedStyle(() => {
    return {
      height: animation.value * measuredHeight,
      opacity: animation.value,
      overflow: "hidden",
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${animation.value * 90}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.header,
            { color: expanded ? COLORS.primary : COLORS.secondary },
          ]}
        >
          {header}
        </Text>
        <Animated.View style={animatedIconStyle}>
          <Ionicons
            name={"chevron-forward"}
            size={24}
            color={expanded ? COLORS.primary : COLORS.secondary}
          />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={animatedExpandStyle}>
        <View
          style={styles.content}
          onLayout={(event) => {
            const h = event.nativeEvent.layout.height;
            if (h > 0 && measuredHeight !== h) {
              setMeasuredHeight(h);
            }
          }}
        >
          {children}
        </View>
      </Animated.View>

      {measuredHeight === 0 && (
        <View
          pointerEvents="none"
          style={[
            styles.content,
            { position: "absolute", opacity: 0, zIndex: -1 },
          ]}
          onLayout={(event) =>
            setMeasuredHeight(event.nativeEvent.layout.height)
          }
        >
          {children}
        </View>
      )}

      <View style={styles.separator} />
    </View>
  );
};

export default ExpandableTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    borderColor: COLORS.secondary,
    width: `100%`,
    display: "flex",
    flexDirection: "column",
  },
  tab: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 16,
  },
  content: {
    width: `100%`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.secondary,
    marginVertical: 10,
  },
});
