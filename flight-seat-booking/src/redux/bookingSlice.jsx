import { createSlice } from "@reduxjs/toolkit";

var initialState = {
  flight: null,

  selectedSeats: [],

  passengers: []
};

var bookingSlice = createSlice({
  name: "booking",
  initialState: initialState,

  reducers: {
    setFlight: function (state, action) {
      state.flight = action.payload;
    },

    setSelectedSeats: function (state, action) {
      var selectedSeats = action.payload;
      var oldPassengers = state.passengers;

      state.selectedSeats = selectedSeats;

      state.passengers = selectedSeats.map(
        function (seat) {
          var existingPassenger = oldPassengers.find(
            function (passenger) {
              return passenger.seat === seat;
            }
          );

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
              cost: 0
            }
          };
        }
      );
    },

    updatePassengerDetails: function (state, action) {
      var seat = action.payload.seat;
      var details = action.payload.details;

      state.passengers = state.passengers.map(
        function (passenger) {
          if (passenger.seat === seat) {
            return {
              ...passenger,
              ...details
            };
          }

          return passenger;
        }
      );
    },

    updatePassengerMeals: function (state, action) {
      var seat = action.payload.seat;
      var meals = action.payload.meals;

      state.passengers = state.passengers.map(
        function (passenger) {
          if (passenger.seat === seat) {
            return {
              ...passenger,
              meals: meals
            };
          }

          return passenger;
        }
      );
    },

    updatePassengerLuggage: function (state, action) {
      var seat = action.payload.seat;
      var luggage = action.payload.luggage;

      state.passengers = state.passengers.map(
        function (passenger) {
          if (passenger.seat === seat) {
            return {
              ...passenger,
              luggage: luggage
            };
          }

          return passenger;
        }
      );
    },

    resetBooking: function (state) {
      state.flight = null;
      state.selectedSeats = [];
      state.passengers = [];
    }
  }
});

export var setFlight =
  bookingSlice.actions.setFlight;

export var setSelectedSeats =
  bookingSlice.actions.setSelectedSeats;

export var updatePassengerDetails =
  bookingSlice.actions.updatePassengerDetails;

export var updatePassengerMeals =
  bookingSlice.actions.updatePassengerMeals;

export var updatePassengerLuggage =
  bookingSlice.actions.updatePassengerLuggage;

export var resetBooking =
  bookingSlice.actions.resetBooking;

export default bookingSlice.reducer;