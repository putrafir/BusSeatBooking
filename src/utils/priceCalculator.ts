import { BUS_CONFIG } from "../constants/busConfig";
import { BusType, Seat } from "../types/booking";

export const calculateSeatPrice = (busType: BusType, seat: Seat): number => {
  const config = BUS_CONFIG[busType];

  return seat.isWindow ? config.windowPrice : config.normalPrice;
};

export const calculateTotalPrice = (
  busType: BusType,
  selectedSeatIds: string[],
  seats: Seat[],
): number => {
  return selectedSeatIds.reduce((total, seatId) => {
    const seat = seats.find((item) => item.id === seatId);

    if (!seat) {
      return total;
    }

    return total + calculateSeatPrice(busType, seat);
  }, 0);
};
