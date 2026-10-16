// Persistent storage for SkyBook passenger tickets and boarding passes

import { loadFlights, saveFlights } from "./flightStorage.js";

const TICKETS_KEY = "skybook_tickets";

// Initial seed ticket for the demo user
const DEFAULT_TICKETS = [
  {
    id: "TKT-DEMO-001",
    pnr: "SKY884920",
    userId: "user-1",
    userEmail: "yash@example.com",
    bookingDate: "2026-03-10T14:32:00.000Z",
    status: "CONFIRMED", // CONFIRMED | CANCELLED
    flight: {
      id: 1,
      name: "Air India AI-101",
      from: "Delhi",
      to: "Mumbai",
      departureTime: "06:00",
      arrivalTime: "08:15",
      price: 5500,
      date: "2026-04-15",
      totalSeats: 120,
      luggage: {
        includedWeight: 15,
        maximumWeight: 25
      }
    },
    passengers: [
      {
        seat: "12A",
        name: "Yash Kumar",
        email: "yash@example.com",
        phone: "+91 98765 43210",
        age: "24",
        gender: "Male",
        meals: [
          {
            id: 1,
            name: "Vegetarian Gourmet",
            price: 250,
            quantity: 1
          }
        ],
        luggage: {
          weight: 18,
          cost: 300
        }
      }
    ],
    totalAmount: 6050
  }
];

export function getAllTickets() {
  try {
    const data = localStorage.getItem(TICKETS_KEY);
    if (!data) {
      localStorage.setItem(TICKETS_KEY, JSON.stringify(DEFAULT_TICKETS));
      return DEFAULT_TICKETS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading tickets:", error);
    return DEFAULT_TICKETS;
  }
}

export function saveTickets(tickets) {
  try {
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
  } catch (error) {
    console.error("Error saving tickets:", error);
  }
}

export function createTicket(ticketData) {
  const tickets = getAllTickets();

  // Generate random 6-character alphanumeric PNR if not provided
  const pnr = ticketData.pnr || ("SKY" + Math.floor(100000 + Math.random() * 900000));
  const newTicket = {
    id: "TKT-" + Date.now().toString(36).toUpperCase() + "-" + Math.floor(100 + Math.random() * 900),
    pnr: pnr,
    bookingDate: new Date().toISOString(),
    status: "CONFIRMED",
    ...ticketData
  };

  tickets.unshift(newTicket);
  saveTickets(tickets);
  return newTicket;
}

export function getUserTickets(userEmail, userId = null) {
  const tickets = getAllTickets();
  if (!userEmail && !userId) return [];

  const lowerEmail = userEmail ? userEmail.toLowerCase().trim() : "";

  return tickets.filter((ticket) => {
    if (userId && ticket.userId === userId) return true;
    if (lowerEmail && ticket.userEmail?.toLowerCase() === lowerEmail) return true;
    // Check if any passenger in ticket has matching email
    if (lowerEmail && ticket.passengers?.some((p) => p.email?.toLowerCase() === lowerEmail)) {
      return true;
    }
    return false;
  });
}

export function getTicketByPnr(pnr) {
  if (!pnr) return null;
  const cleanPnr = pnr.trim().toUpperCase();
  const tickets = getAllTickets();
  return tickets.find((t) => t.pnr.toUpperCase() === cleanPnr) || null;
}

export function cancelTicket(ticketId) {
  const tickets = getAllTickets();
  let cancelledTicket = null;

  const updatedTickets = tickets.map((t) => {
    if (t.id === ticketId || t.pnr === ticketId) {
      cancelledTicket = { ...t, status: "CANCELLED" };
      return cancelledTicket;
    }
    return t;
  });

  if (cancelledTicket) {
    saveTickets(updatedTickets);

    // Release seats in flightStorage if the flight exists
    try {
      const flights = loadFlights();
      const flightIndex = flights.findIndex((f) => f.id === cancelledTicket.flight?.id);
      if (flightIndex !== -1) {
        const bookedSeatsToRelease = cancelledTicket.passengers.map((p) => p.seat);
        flights[flightIndex].bookedSeats = (flights[flightIndex].bookedSeats || []).filter(
          (seat) => !bookedSeatsToRelease.includes(seat)
        );
        saveFlights(flights);
      }
    } catch (e) {
      console.error("Failed to release seats on flight cancellation:", e);
    }

    return { success: true, ticket: cancelledTicket };
  }

  return { success: false, message: "Ticket not found." };
}
