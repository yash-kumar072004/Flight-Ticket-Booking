import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "./slices/bookingSlice.js";
import authReducer from "./slices/authSlice.js";
import ticketReducer from "./slices/ticketSlice.js";
import { loadBooking, saveBooking } from "./localStorage.js";

const savedBooking = loadBooking();

const preloadedState = savedBooking
  ? {
      booking: savedBooking,
    }
  : undefined;

const store = configureStore({
  reducer: {
    booking: bookingReducer,
    auth: authReducer,
    tickets: ticketReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  const { booking } = store.getState();
  saveBooking(booking);
});

export default store;
