import DateTimePicker from "@react-native-community/datetimepicker";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BUS_CONFIG } from "../constants/busConfig";
import { getBookingHistory } from "../storage/bookingStorage";
import { BookingHistory } from "../types/booking";
import { formatCurrency } from "../utils/formatCurrency";

export default function HistoryScreen() {
  const [history, setHistory] = useState<BookingHistory[]>([]);
  const [filterDate, setFilterDate] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, []),
  );

  const loadHistory = async () => {
    const data = await getBookingHistory();
    setHistory(data);
  };

  const filteredHistory = useMemo(() => {
    if (!filterDate) {
      return history;
    }

    return history.filter((item) => item.bookingDate === filterDate);
  }, [history, filterDate]);

  const totalRevenue = useMemo(() => {
    return filteredHistory.reduce((total, item) => total + item.totalPrice, 0);
  }, [filteredHistory]);

  const formatDateKey = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const formatDisplayDate = (dateKey: string) => {
    if (!dateKey) {
      return "All Dates";
    }

    const date = new Date(dateKey);

    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleDateChange = (_event: unknown, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (date) {
      setFilterDate(formatDateKey(date));
    }
  };

  const handleClearFilter = () => {
    setFilterDate("");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={BACKGROUND_COLOR}
        translucent={false}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Sales History</Text>

        <View style={styles.filterCard}>
          <Text style={styles.filterLabel}>Filter by Date</Text>

          <Pressable
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {formatDisplayDate(filterDate)}
            </Text>
          </Pressable>

          {filterDate && (
            <Pressable style={styles.clearButton} onPress={handleClearFilter}>
              <Text style={styles.clearButtonText}>Clear Filter</Text>
            </Pressable>
          )}

          {showDatePicker && (
            <DateTimePicker
              value={filterDate ? new Date(filterDate) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Revenue</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(totalRevenue)}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Transactions</Text>
            <Text style={styles.summaryValue}>{filteredHistory.length}</Text>
          </View>
        </View>

        {filteredHistory.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No booking history yet</Text>
            <Text style={styles.emptyDescription}>
              Booking data will appear here after you confirm a seat booking.
            </Text>
          </View>
        ) : (
          filteredHistory.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <View>
                  <Text style={styles.busType}>
                    {BUS_CONFIG[item.busType].label} Class
                  </Text>
                  <Text style={styles.dateText}>
                    {formatDisplayDate(item.bookingDate)}
                  </Text>
                </View>

                <Text style={styles.priceText}>
                  {formatCurrency(item.totalPrice)}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.label}>Booked Seats</Text>
                <Text style={styles.value}>{item.seats.join(", ")}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Seat Count</Text>
                <Text style={styles.value}>{item.seats.length} seat(s)</Text>
              </View>
            </View>
          ))
        )}

        <Link href="/" asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backButtonText}>Back to Booking</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const PRIMARY_COLOR = "#0B2D5B";
const BACKGROUND_COLOR = "#F3F4F6";
const MUTED_COLOR = "#6B7280";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 18,
  },
  filterCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
  },
  dateButtonText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  clearButton: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  clearButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: "700",
  },
  summaryContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 6,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 13,
    color: MUTED_COLOR,
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: PRIMARY_COLOR,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginTop: 12,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  emptyDescription: {
    fontSize: 14,
    color: MUTED_COLOR,
    textAlign: "center",
    lineHeight: 20,
  },
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  busType: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    color: MUTED_COLOR,
  },
  priceText: {
    fontSize: 15,
    fontWeight: "700",
    color: PRIMARY_COLOR,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 12,
  },
  label: {
    fontSize: 14,
    color: MUTED_COLOR,
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textAlign: "right",
    flex: 1,
  },
  backButton: {
    marginTop: 24,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
