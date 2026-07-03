import DateTimePicker from "@react-native-community/datetimepicker";
import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  BUS_CONFIG,
  BUS_TYPES,
  MAX_SELECTED_SEATS,
} from "../constants/busConfig";
import {
  getBookedSeats,
  getBookingHistory,
  saveBookedSeats,
  saveBookingHistory,
} from "../storage/bookingStorage";
import { BookedSeatsData, BookingHistory, BusType } from "../types/booking";
import { formatCurrency } from "../utils/formatCurrency";
import { calculateTotalPrice } from "../utils/priceCalculator";
import { generateSeats } from "../utils/seatGenerator";

export default function BookingScreen() {
  const [busType, setBusType] = useState<BusType>("regular");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<BookedSeatsData>({
    regular: {},
    express: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const seats = useMemo(() => generateSeats(busType), [busType]);

  const totalPrice = useMemo(() => {
    return calculateTotalPrice(busType, selectedSeats, seats);
  }, [busType, selectedSeats, seats]);

  useEffect(() => {
    loadBookedSeats();
  }, []);

  useEffect(() => {
    setSelectedSeats([]);
  }, [busType]);

  const formatDateKey = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const formatDisplayDate = (dateKey: string) => {
    if (!dateKey) {
      return "Select departure date";
    }

    const date = new Date(dateKey);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const loadBookedSeats = async () => {
    const data = await getBookedSeats();

    setBookedSeats(data);
    setIsLoading(false);
  };

  const handleSelectBusType = (type: BusType) => {
    setBusType(type);
  };

  const handleDateChange = (_event: unknown, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(formatDateKey(date));
      setSelectedSeats([]);
    }
  };

  const handleSelectSeat = (seatId: string) => {
    if (!selectedDate) {
      Alert.alert("Select Date", "Please select departure date first.");
      return;
    }

    const bookedSeatsByDate = bookedSeats[busType][selectedDate] || [];
    const isBooked = bookedSeatsByDate.includes(seatId);
    const isSelected = selectedSeats.includes(seatId);

    if (isBooked) {
      return;
    }

    if (isSelected) {
      setSelectedSeats((currentSeats) =>
        currentSeats.filter((item) => item !== seatId),
      );
      return;
    }

    if (selectedSeats.length >= MAX_SELECTED_SEATS) {
      Alert.alert("Maximum Seat", "You can only select up to 5 seats.");
      return;
    }

    setSelectedSeats((currentSeats) => [...currentSeats, seatId]);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate) {
      Alert.alert("Select Date", "Please select departure date first.");
      return;
    }

    if (selectedSeats.length === 0) {
      Alert.alert("No Seat Selected", "Please select at least one seat.");
      return;
    }

    const currentBookedSeats = bookedSeats[busType][selectedDate] || [];
    const newBookedSeatsForDate = [...currentBookedSeats, ...selectedSeats];

    const shouldResetSeats = newBookedSeatsForDate.length >= seats.length;

    const updatedBookedSeats: BookedSeatsData = {
      ...bookedSeats,
      [busType]: {
        ...bookedSeats[busType],
        [selectedDate]: shouldResetSeats ? [] : newBookedSeatsForDate,
      },
    };

    const currentHistory = await getBookingHistory();

    const newHistory: BookingHistory = {
      id: `${Date.now()}`,
      busType,
      seats: selectedSeats,
      totalPrice,
      bookingDate: selectedDate,
      createdAt: new Date().toISOString(),
    };

    const updatedHistory = [newHistory, ...currentHistory];

    await saveBookedSeats(updatedBookedSeats);
    await saveBookingHistory(updatedHistory);

    setBookedSeats(updatedBookedSeats);
    setSelectedSeats([]);

    if (shouldResetSeats) {
      Alert.alert(
        "Booking Confirmed",
        "All seats on this date are fully booked. Seats have been reset automatically.",
      );
    } else {
      Alert.alert("Booking Confirmed", "Your selected seats have been booked.");
    }
  };
  const renderSeat = (seatId: string) => {
    const isSelected = selectedSeats.includes(seatId);
    const bookedSeatsByDate = selectedDate
      ? bookedSeats[busType][selectedDate] || []
      : [];

    const isBooked = bookedSeatsByDate.includes(seatId);
    const isExpress = busType === "express";

    return (
      <Pressable
        key={seatId}
        disabled={isBooked}
        onPress={() => handleSelectSeat(seatId)}
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
  };

  const renderSeatRows = () => {
    const config = BUS_CONFIG[busType];

    return config.rows.map((row) => {
      const leftSeats = [`${row}1`, `${row}2`];
      const rightSeats = [`${row}3`, `${row}4`];

      return (
        <View key={row} style={styles.seatRow}>
          <View style={styles.seatGroup}>{leftSeats.map(renderSeat)}</View>

          <View style={styles.aisle} />

          <View style={styles.seatGroup}>{rightSeats.map(renderSeat)}</View>
        </View>
      );
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={BACKGROUND_COLOR}
        translucent={false}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Bus Seat Booking</Text>

        <View style={styles.card}>
          <View style={styles.busTypeContainer}>
            {BUS_TYPES.map((type) => {
              const isActive = busType === type;

              return (
                <Pressable
                  key={type}
                  onPress={() => handleSelectBusType(type)}
                  style={styles.radioWrapper}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      isActive && styles.radioOuterActive,
                    ]}
                  >
                    {isActive && <View style={styles.radioInner} />}
                  </View>

                  <Text
                    style={[
                      styles.radioText,
                      isActive && styles.radioTextActive,
                    ]}
                  >
                    {BUS_CONFIG[type].label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              {BUS_CONFIG[busType].label} Class - {seats.length} seats
            </Text>
            <Text style={styles.infoSubText}>
              Window seat price:{" "}
              {formatCurrency(BUS_CONFIG[busType].windowPrice)}
            </Text>
            <Text style={styles.infoSubText}>
              Normal seat price:{" "}
              {formatCurrency(BUS_CONFIG[busType].normalPrice)}
            </Text>
          </View>

          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>Departure Date</Text>

            <Pressable
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {formatDisplayDate(selectedDate)}
              </Text>
            </Pressable>

            {!selectedDate && (
              <Text style={styles.dateWarning}>
                Please select date before choosing a seat.
              </Text>
            )}
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate ? new Date(selectedDate) : new Date()}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={handleDateChange}
            />
          )}

          <View style={styles.legendContainer}>
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

          <View style={styles.seatContainer}>{renderSeatRows()}</View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Selected Seats</Text>
            <Text style={styles.summaryValue}>
              {selectedSeats.length > 0 ? selectedSeats.join(", ") : "-"}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Price</Text>
            <Text style={styles.summaryPrice}>
              {formatCurrency(totalPrice)}
            </Text>
          </View>

          <Pressable
            style={styles.confirmButton}
            onPress={handleConfirmBooking}
          >
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          </Pressable>

          <Link href="/history" asChild>
            <Pressable style={styles.historyButton}>
              <Text style={styles.historyButtonText}>View Sales History</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const PRIMARY_COLOR = "#0B2D5B";
const BACKGROUND_COLOR = "#F3F4F6";
// const BORDER_COLOR = "#E5E7EB";
const MUTED_COLOR = "#6B7280";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 24,
  },
  loadingText: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  busTypeContainer: {
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
  infoBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  infoSubText: {
    fontSize: 13,
    color: MUTED_COLOR,
    marginTop: 2,
  },

  dateBox: {
    marginBottom: 16,
  },
  dateLabel: {
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
  dateWarning: {
    fontSize: 12,
    color: "#DC2626",
    marginTop: 6,
  },
  legendContainer: {
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
  seatContainer: {
    marginBottom: 20,
  },
  seatRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  seatGroup: {
    flexDirection: "row",
    gap: 10,
  },
  aisle: {
    width: 34,
  },
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
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 7,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#111827",
  },
  summaryValue: {
    fontSize: 15,
    color: MUTED_COLOR,
    maxWidth: "55%",
    textAlign: "right",
  },
  summaryPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  confirmButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 18,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  historyButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  historyButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 15,
    fontWeight: "700",
  },
});
