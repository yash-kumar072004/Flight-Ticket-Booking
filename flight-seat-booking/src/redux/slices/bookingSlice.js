import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  flight: null,
  selectedSeats: [],
  passengers: [],
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setFlight: (state, action) => {
      state.flight = action.payload;
    },

    setSelectedSeats: (state, action) => {
      const selectedSeats = action.payload;
      const oldPassengers = state.passengers;

      state.selectedSeats = selectedSeats;

      state.passengers = selectedSeats.map((seat) => {
        const existingPassenger = oldPassengers.find((p) => p.seat === seat);

        if (existingPassenger) {
          return existingPassenger;
        }

        return {
          seat: seat,
          name: "",
          email: "",
          phone: "",
          age: "",
          gender: "",
          meals: [],
          luggage: {
            weight: 0,
            cost: 0,
          },
        };
      });
    },

    updatePassengerDetails: (state, action) => {
      const { seat, details } = action.payload;

      state.passengers = state.passengers.map((passenger) => {
        if (passenger.seat === seat) {
          return {
            ...passenger,
            ...details,
          };
        }
        return passenger;
      });
    },

    updatePassengerMeals: (state, action) => {
      const { seat, meals } = action.payload;

      state.passengers = state.passengers.map((passenger) => {
        if (passenger.seat === seat) {
          return {
            ...passenger,
            meals: meals,
          };
        }
        return passenger;
      });
    },

    updatePassengerLuggage: (state, action) => {
      const { seat, luggage } = action.payload;

      state.passengers = state.passengers.map((passenger) => {
        if (passenger.seat === seat) {
          return {
            ...passenger,
            luggage: luggage,
          };
        }
        return passenger;
      });
    },

    resetBooking: (state) => {
      state.flight = null;
      state.selectedSeats = [];
      state.passengers = [];
    },
  },
});

export const {
  setFlight,
  setSelectedSeats,
  updatePassengerDetails,
  updatePassengerMeals,
  updatePassengerLuggage,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
