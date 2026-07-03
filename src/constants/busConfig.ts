import { BusType } from "../types/booking";

export const BUS_CONFIG = {
  regular: {
    label: "Regular",
    totalSeats: 20,
    rows: ["A", "B", "C", "D", "E"],
    columns: 4,
    normalPrice: 100000,
    windowPrice: 150000,
    seatStyle: "square",
  },
  express: {
    label: "Express",
    totalSeats: 12,
    rows: ["A", "B", "C"],
    columns: 4,
    normalPrice: 150000,
    windowPrice: 200000,
    seatStyle: "rectangle",
  },
} as const;

export const BUS_TYPES: BusType[] = ["regular", "express"];

export const MAX_SELECTED_SEATS = 5;
