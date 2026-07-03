import AsyncStorage from "@react-native-async-storage/async-storage";
import { BookedSeatsData, BookingHistory } from "../types/booking";

const BOOKED_SEATS_KEY = "BOOKED_SEATS";
const BOOKING_HISTORY_KEY = "BOOKING_HISTORY";

const defaultBookedSeats: BookedSeatsData = {
  regular: {},
  express: {},
};

export const getBookedSeats = async (): Promise<BookedSeatsData> => {
  try {
    const data = await AsyncStorage.getItem(BOOKED_SEATS_KEY);

    console.log("BOOKED SEATS LOADED:", data);

    if (!data) {
      return defaultBookedSeats;
    }

    return JSON.parse(data);
  } catch (error) {
    console.log("Failed to get booked seats:", error);
    return defaultBookedSeats;
  }
};

export const saveBookedSeats = async (data: BookedSeatsData): Promise<void> => {
  try {
    await AsyncStorage.setItem(BOOKED_SEATS_KEY, JSON.stringify(data));

    const savedData = await AsyncStorage.getItem(BOOKED_SEATS_KEY);
    console.log("BOOKED SEATS SAVED:", savedData);
  } catch (error) {
    console.log("Failed to save booked seats:", error);
  }
};

export const getBookingHistory = async (): Promise<BookingHistory[]> => {
  try {
    const data = await AsyncStorage.getItem(BOOKING_HISTORY_KEY);

    console.log("BOOKING HISTORY LOADED:", data);

    if (!data) {
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    console.log("Failed to get booking history:", error);
    return [];
  }
};

export const saveBookingHistory = async (
  history: BookingHistory[],
): Promise<void> => {
  try {
    await AsyncStorage.setItem(BOOKING_HISTORY_KEY, JSON.stringify(history));

    const savedData = await AsyncStorage.getItem(BOOKING_HISTORY_KEY);
    console.log("BOOKING HISTORY SAVED:", savedData);
  } catch (error) {
    console.log("Failed to save booking history:", error);
  }
};
