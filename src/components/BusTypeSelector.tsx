import { Pressable, StyleSheet, Text, View } from "react-native";

import { BUS_CONFIG, BUS_TYPES } from "../constants/busConfig";
import { BusType } from "../types/booking";

type BusTypeSelectorProps = {
  selectedBusType: BusType;
  onSelectBusType: (type: BusType) => void;
};

export default function BusTypeSelector({
  selectedBusType,
  onSelectBusType,
}: BusTypeSelectorProps) {
  return (
    <View style={styles.container}>
      {BUS_TYPES.map((type) => {
        const isActive = selectedBusType === type;

        return (
          <Pressable
            key={type}
            onPress={() => onSelectBusType(type)}
            style={styles.radioWrapper}
          >
            <View
              style={[styles.radioOuter, isActive && styles.radioOuterActive]}
            >
              {isActive && <View style={styles.radioInner} />}
            </View>

            <Text
              style={[styles.radioText, isActive && styles.radioTextActive]}
            >
              {BUS_CONFIG[type].label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const PRIMARY_COLOR = "#0B2D5B";
const MUTED_COLOR = "#6B7280";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 18,
  },
  radioWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioOuterActive: {
    borderColor: PRIMARY_COLOR,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PRIMARY_COLOR,
  },
  radioText: {
    fontSize: 15,
    color: MUTED_COLOR,
  },
  radioTextActive: {
    color: "#111827",
    fontWeight: "600",
  },
});
