export type BusType = "regular" | "express";

export type Seat = {
  id: string;
  row: string;
  column: number;
  isWindow: boolean;
};

export type BookedSeatsData = {
  regular: {
    [date: string]: string[];
  };
  express: {
    [date: string]: string[];
  };
};

export type BookingHistory = {
  id: string;
  busType: BusType;
  seats: string[];
  totalPrice: number;
  bookingDate: string;
  createdAt: string;
};
