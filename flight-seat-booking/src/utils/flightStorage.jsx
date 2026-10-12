import defaultFlights from "../data/flights.json";

function loadFlights () {
  var savedFlights =
    localStorage.getItem("flights");

  if (!savedFlights) {
    return defaultFlights;
  }

  try {
    return JSON.parse(savedFlights);
  } catch {
    return defaultFlights;
  }
}

function saveFlights (flights) {
  localStorage.setItem(
    "flights",
    JSON.stringify(flights)
  );
}

function bookSeats (
  flightId,
  selectedSeats
) {
  var flights = loadFlights();

  var updatedFlights =
    flights.map(function (flight) {
      if (flight.id !== flightId) {
        return flight;
      }

      var bookedSeats =
        flight.bookedSeats || [];

      var updatedBookedSeats =
        bookedSeats.concat(
          selectedSeats.filter(
            function (seat) {
              return !bookedSeats.includes(
                seat
              );
            }
          )
        );

      return {
        ...flight,
        bookedSeats:
          updatedBookedSeats
      };
    });

  saveFlights(updatedFlights);

  return updatedFlights;
}

function clearFlights () {
  localStorage.removeItem("flights");
}

export {
  loadFlights,
  saveFlights,
  bookSeats,
  clearFlights
};