import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleProp, Text, TextStyle } from "react-native";

interface TimerProps {
  seconds: number;
  style?: StyleProp<TextStyle>;
}

const Timer: React.FC<TimerProps> = ({ seconds, style }) => {
  const [secondsLeft, setSecondsLeft] = useState(seconds);
  const router = useRouter();

  useEffect(() => {
    if (secondsLeft <= 0) {
      router.replace("/(auth)");
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const format = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return <Text style={style}>{format(secondsLeft)}</Text>;
};

export default Timer;
