import { Pressable, StyleSheet, Text } from "react-native";

type SeatItemProps = {
  seatId: string;
  isSelected: boolean;
  isBooked: boolean;
  isExpress: boolean;
  onPress: (seatId: string) => void;
};

export default function SeatItem({
  seatId,
  isSelected,
  isBooked,
  isExpress,
  onPress,
}: SeatItemProps) {
  return (
    <Pressable
      disabled={isBooked}
      onPress={() => onPress(seatId)}
      style={[
        styles.seat,
        isExpress && styles.expressSeat,
        isSelected && styles.selectedSeat,
        isBooked && styles.bookedSeat,
      ]}
    >
      <Text
        style={[
          styles.seatText,
          isSelected && styles.selectedSeatText,
          isBooked && styles.bookedSeatText,
        ]}
      >
        {seatId}
      </Text>
    </Pressable>
  );
}

const PRIMARY_COLOR = "#0B2D5B";

const styles = StyleSheet.create({
  seat: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  expressSeat: {
    height: 76,
  },
  selectedSeat: {
    backgroundColor: PRIMARY_COLOR,
  },
  bookedSeat: {
    backgroundColor: "#9CA3AF",
  },
  seatText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  selectedSeatText: {
    color: "#FFFFFF",
  },
  bookedSeatText: {
    color: "#FFFFFF",
  },
});
