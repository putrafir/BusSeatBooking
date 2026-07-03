import { StyleSheet, Text, View } from "react-native";

export default function Legend() {
  return (
    <View style={styles.container}>
      <View style={styles.legendItem}>
        <View style={[styles.legendBox, styles.availableLegend]} />
        <Text style={styles.legendText}>Available</Text>
      </View>

      <View style={styles.legendItem}>
        <View style={[styles.legendBox, styles.selectedLegend]} />
        <Text style={styles.legendText}>Selected</Text>
      </View>

      <View style={styles.legendItem}>
        <View style={[styles.legendBox, styles.bookedLegend]} />
        <Text style={styles.legendText}>Booked</Text>
      </View>
    </View>
  );
}

const PRIMARY_COLOR = "#0B2D5B";
const MUTED_COLOR = "#6B7280";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendBox: {
    width: 14,
    height: 14,
    borderRadius: 4,
    marginRight: 6,
  },
  availableLegend: {
    backgroundColor: "#E5E7EB",
  },
  selectedLegend: {
    backgroundColor: PRIMARY_COLOR,
  },
  bookedLegend: {
    backgroundColor: "#9CA3AF",
  },
  legendText: {
    fontSize: 12,
    color: MUTED_COLOR,
  },
});