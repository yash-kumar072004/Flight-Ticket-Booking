import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tickets: [],
  selectedTicket: null,
  loading: false,
};

const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    setUserTickets: (state, action) => {
      state.tickets = action.payload;
    },
    addTicketSuccess: (state, action) => {
      state.tickets.unshift(action.payload);
    },
    selectTicket: (state, action) => {
      state.selectedTicket = action.payload;
    },
    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
    },
    cancelTicketSuccess: (state, action) => {
      const ticketId = action.payload;
      state.tickets = state.tickets.map((t) =>
        t.id === ticketId ? { ...t, status: "CANCELLED" } : t
      );
      if (state.selectedTicket && state.selectedTicket.id === ticketId) {
        state.selectedTicket.status = "CANCELLED";
      }
    },
  },
});

export const {
  setUserTickets,
  addTicketSuccess,
  selectTicket,
  clearSelectedTicket,
  cancelTicketSuccess,
} = ticketSlice.actions;

export default ticketSlice.reducer;
