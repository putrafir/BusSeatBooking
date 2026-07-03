# Bus Seat Booking App

Bus Seat Booking is a React Native mobile application that allows users to book bus seats based on bus class and departure date. This project was built as a technical test for the Intern React Native Developer position.

## Features

### Main Features

- Select bus class:
  - Regular Class
  - Express Class
- Dynamic seat layout based on selected bus class
- Select and unselect seats
- Maximum 5 seats per booking
- Different seat pricing for window seats and regular seats
- Live total price calculation
- Confirm booking
- Booked seats become unavailable
- Local storage using AsyncStorage
- Automatic seat reset when all seats for a bus type and selected date are fully booked

### Bonus Features

- Departure date picker
- Seats are booked based on selected departure date
- Sales history screen
- Total revenue calculation
- Date filter for sales history

## Bus Class Rules

### Regular Class

- Total seats: 20
- Layout: 10 seats left and 10 seats right
- Window seat price: Rp 150.000
- Regular seat price: Rp 100.000

### Express Class

- Total seats: 12
- Layout: 6 seats left and 6 seats right
- Window seat price: Rp 200.000
- Regular seat price: Rp 150.000

## Tech Stack

- React Native
- Expo
- Expo Router
- TypeScript
- AsyncStorage
- React Native DateTimePicker

## Project Structure

```txt
src/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   └── history.tsx
├── components/
│   ├── BusTypeSelector.tsx
│   ├── Legend.tsx
│   └── SeatItem.tsx
├── constants/
│   └── busConfig.ts
├── storage/
│   └── bookingStorage.ts
├── types/
│   └── booking.ts
└── utils/
    ├── formatCurrency.ts
    ├── priceCalculator.ts
    └── seatGenerator.ts
```

## How to Run

1. Clone this repository:

```bash
git clone https://github.com/putrafir/BusSeatBooking.git
cd BusSeatBooking
```

2. Install dependencies:

```bash
npm install
```

3. Run the Project

```bash
npx expo start
```

## APK Download

APK download link:

drive link:

```text
https://drive.google.com/file/d/1CGpSaYzYEtIq9IsemHtunNAJQsSnaaRF/view?usp=sharing
```

expo link:

```text
https://expo.dev/accounts/putrafir/projects/BusSeatBooking/builds/c2f10d6b-f00d-452f-8caf-dec132b4fd42
```

## Notes

This application uses local storage only. No backend is required.
