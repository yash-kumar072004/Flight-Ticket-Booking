import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "./bookingSlice.jsx";
import {
  loadBooking
} from "./localStorage.jsx";

var savedBooking = loadBooking();

var preloadedState;

if (savedBooking) {
  preloadedState = {
    booking: savedBooking
  };
}

var store = configureStore({
  reducer: {
    booking: bookingReducer
  },

  preloadedState: preloadedState
});

store.subscribe(function () {
  var booking =
    store.getState().booking;

  localStorage.setItem(
    "booking",
    JSON.stringify(booking)
  );
});

export default store;