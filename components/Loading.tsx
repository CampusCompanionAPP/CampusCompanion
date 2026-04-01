import { COLORS } from "@/constants/color";
import React from "react";
import { ActivityIndicator, Modal, View } from "react-native";

const Loading = () => {
  return (
    <Modal transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    </Modal>
  );
};

export default Loading;
