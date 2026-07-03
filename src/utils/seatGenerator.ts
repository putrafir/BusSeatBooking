import { BUS_CONFIG } from "../constants/busConfig";
import { BusType, Seat } from "../types/booking";

export const generateSeats = (busType: BusType): Seat[] => {
  const config = BUS_CONFIG[busType];
  const seats: Seat[] = [];

  config.rows.forEach((row) => {
    for (let column = 1; column <= config.columns; column++) {
      seats.push({
        id: `${row}${column}`,
        row,
        column,
        isWindow: column === 1 || column === config.columns,
      });
    }
  });

  return seats;
};
