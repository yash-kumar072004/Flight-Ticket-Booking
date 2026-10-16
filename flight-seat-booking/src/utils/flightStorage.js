import defaultFlights from "../data/flights.json";

export function loadFlights() {
  const savedFlights = localStorage.getItem("flights");

  if (!savedFlights) {
    return defaultFlights;
  }

  try {
    return JSON.parse(savedFlights);
  } catch {
    return defaultFlights;
  }
}

export function saveFlights(flights) {
  localStorage.setItem("flights", JSON.stringify(flights));
}

export function bookSeats(flightId, selectedSeats) {
  const flights = loadFlights();

  const updatedFlights = flights.map((flight) => {
    if (flight.id !== flightId) {
      return flight;
    }

    const bookedSeats = flight.bookedSeats || [];
    const newSeats = selectedSeats.filter((seat) => !bookedSeats.includes(seat));
    const updatedBookedSeats = [...bookedSeats, ...newSeats];

    return {
      ...flight,
      bookedSeats: updatedBookedSeats,
    };
  });

  saveFlights(updatedFlights);
  return updatedFlights;
}

export function clearFlights() {
  localStorage.removeItem("flights");
}

const flightStorage = {
  loadFlights,
  saveFlights,
  bookSeats,
  clearFlights,
};

export default flightStorage;
