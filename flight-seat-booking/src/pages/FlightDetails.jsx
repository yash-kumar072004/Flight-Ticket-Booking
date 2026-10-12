import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { loadFlights } from "../utils/flightStorage.jsx";
import { setFlight, setSelectedSeats } from "../redux/bookingSlice.jsx";

function FlightDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const flightId = Number(params.flightId);
  const flight = loadFlights().find((item) => item.id === flightId);

  const [selectedSeats, setSelectedSeatsState] = React.useState([]);

  if (!flight) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center animate-fade-in-up">
        <div className="text-4xl mb-4">🔍</div>
        <h1 className="text-xl font-bold text-white mb-2">Flight not found</h1>
        <p className="text-sm text-slate-400 mb-6">
          The flight you are looking for does not exist or has been removed.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full py-2.5 px-4 rounded-xl font-semibold bg-sky-500 hover:bg-sky-400 text-white transition-colors"
        >
          ← Back to Flights
        </button>
      </div>
    );
  }

  const seatLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"];
  const totalRows = Math.ceil(flight.totalSeats / seatLetters.length);
  const seatRows = [];

  for (let row = 1; row <= totalRows; row++) {
    const rowSeats = [];
    seatLetters.forEach((letter) => {
      if ((row - 1) * seatLetters.length + rowSeats.length >= flight.totalSeats) {
        return;
      }
      const seatNumber = row + letter;
      let seatStatus = "available";

      if ((flight.bookedSeats || []).includes(seatNumber)) {
        seatStatus = "booked";
      }

      const seatType = letter === "A" || letter === "K" ? "window-seat" : "aisle-seat";

      rowSeats.push({
        number: seatNumber,
        status: seatStatus,
        type: seatType,
      });
    });

    seatRows.push({
      number: row,
      seats: rowSeats,
    });
  }

  function selectSeat(seat) {
    if (seat.status === "booked") return;

    if (selectedSeats.includes(seat.number)) {
      setSelectedSeatsState(selectedSeats.filter((s) => s !== seat.number));
    } else {
      setSelectedSeatsState([...selectedSeats, seat.number]);
    }
  }

  function continueBooking() {
    if (selectedSeats.length === 0) return;
    dispatch(setFlight(flight));
    dispatch(setSelectedSeats(selectedSeats));
    navigate("/flights/" + flight.id + "/passenger");
  }

  const flightCost = flight.price * selectedSeats.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
      {/* Step Indicator */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 text-sky-400">
            <span className="w-6 h-6 rounded-full bg-sky-500/20 border border-sky-400 flex items-center justify-center font-bold text-xs">
              1
            </span>
            <span>Seats</span>
          </div>
          <div className="h-0.5 flex-1 mx-2 sm:mx-4 bg-slate-800"></div>

          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs">
              2
            </span>
            <span>Passengers</span>
          </div>
          <div className="h-0.5 flex-1 mx-2 sm:mx-4 bg-slate-800"></div>

          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs">
              3
            </span>
            <span>Meals</span>
          </div>
          <div className="h-0.5 flex-1 mx-2 sm:mx-4 bg-slate-800"></div>

          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs">
              4
            </span>
            <span>Luggage</span>
          </div>
          <div className="h-0.5 flex-1 mx-2 sm:mx-4 bg-slate-800"></div>

          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs">
              5
            </span>
            <span>Pass</span>
          </div>
        </div>
      </div>

      {/* Flight Info Banner */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-5 sm:p-6 mb-8 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {flight.departureTime}
              </span>
              <p className="text-xs uppercase font-semibold tracking-wider text-slate-400">
                {flight.from}
              </p>
            </div>

            <div className="flex flex-col items-center px-4">
              <span className="text-xs text-sky-400 font-medium mb-1">Non-stop</span>
              <div className="w-24 sm:w-32 flex items-center gap-1">
                <div className="h-0.5 flex-1 bg-sky-500/30 rounded-full"></div>
                <span className="text-sky-400 text-xs">✈</span>
                <div className="h-0.5 flex-1 bg-sky-500/30 rounded-full"></div>
              </div>
              <span className="text-[11px] text-slate-400 mt-1">{flight.date}</span>
            </div>

            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {flight.arrivalTime}
              </span>
              <p className="text-xs uppercase font-semibold tracking-wider text-slate-400">
                {flight.to}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
            <div>
              <span className="text-xs text-slate-400 block">Flight</span>
              <span className="text-sm font-semibold text-slate-200">{flight.name}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Fare</span>
              <span className="text-xl font-bold text-sky-400">
                ₹{flight.price.toLocaleString("en-IN")}
                <span className="text-xs text-slate-400 font-normal"> /seat</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Aircraft Map + Summary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Airplane Fuselage & Seat Map */}
        <div className="lg:col-span-8 bg-slate-900/70 rounded-3xl border border-slate-800/80 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Cabin Layout</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">
                Boeing 787
              </span>
            </h2>

            {/* Seat Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-slate-800 border border-slate-700"></span>
                <span className="text-slate-300">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-sky-500 border border-sky-400 shadow-sm shadow-sky-500/50"></span>
                <span className="text-slate-300">Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-slate-900/80 border border-slate-800 opacity-50"></span>
                <span className="text-slate-400">Booked</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span>🪟</span>
                <span>Window</span>
              </div>
            </div>
          </div>

          {/* Plane Cockpit visual */}
          <div className="max-w-lg mx-auto mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/60 border border-slate-700 text-xs font-semibold text-slate-300 uppercase tracking-wider">
              ✈️ Front / Cockpit
            </div>
          </div>

          {/* Column Headers */}
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[500px]">
              <div className="grid grid-cols-[30px_repeat(3,1fr)_20px_repeat(4,1fr)_20px_repeat(3,1fr)] gap-2 text-center text-xs font-semibold text-slate-400 mb-3 px-2">
                <span>#</span>
                <span className="text-sky-400">A 🪟</span>
                <span>B</span>
                <span>C</span>
                <span className="text-slate-600">|</span>
                <span>D</span>
                <span>E</span>
                <span>F</span>
                <span>G</span>
                <span className="text-slate-600">|</span>
                <span>H</span>
                <span>J</span>
                <span className="text-sky-400">K 🪟</span>
              </div>

              {/* Rows */}
              <div className="space-y-2.5">
                {seatRows.map((row) => (
                  <div
                    key={row.number}
                    className="grid grid-cols-[30px_repeat(3,1fr)_20px_repeat(4,1fr)_20px_repeat(3,1fr)] gap-2 items-center px-2"
                  >
                    <span className="text-xs font-mono font-medium text-slate-500 text-center">
                      {row.number}
                    </span>

                    {/* Left seats A-C */}
                    {row.seats.slice(0, 3).map((seat) => renderSeatButton(seat))}

                    {/* Left Aisle */}
                    <div className="w-full flex justify-center text-slate-700 text-xs">·</div>

                    {/* Middle seats D-G */}
                    {row.seats.slice(3, 7).map((seat) => renderSeatButton(seat))}

                    {/* Right Aisle */}
                    <div className="w-full flex justify-center text-slate-700 text-xs">·</div>

                    {/* Right seats H-K */}
                    {row.seats.slice(7).map((seat) => renderSeatButton(seat))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-6 text-xs text-slate-500 font-medium">
            ▼ Rear / Galley & Restrooms
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4 sticky top-24 bg-slate-900/90 rounded-3xl border border-slate-800/80 p-6 backdrop-blur-md shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-4 pb-3 border-b border-slate-800">
            Booking Summary
          </h3>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Selected Seats</span>
              <span className="font-semibold text-white">
                {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Ticket Count</span>
              <span className="font-semibold text-white">{selectedSeats.length}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Price per Ticket</span>
              <span className="font-semibold text-slate-300">
                ₹{flight.price.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Total Base Fare</span>
                <span className="text-2xl font-extrabold text-sky-400">
                  ₹{flightCost.toLocaleString("en-IN")}
                </span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
                {selectedSeats.length} Seat{selectedSeats.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={selectedSeats.length === 0}
            onClick={continueBooking}
            className={`w-full py-3.5 px-5 rounded-2xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
              selectedSeats.length > 0
                ? "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 cursor-pointer"
                : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
            }`}
          >
            <span>Proceed to Passengers</span>
            <span>→</span>
          </button>

          {selectedSeats.length === 0 && (
            <p className="text-xs text-amber-400/80 text-center mt-3">
              Please select at least 1 seat on the layout to proceed.
            </p>
          )}
        </div>
      </div>
    </div>
  );

  function renderSeatButton(seat) {
    const isBooked = seat.status === "booked";
    const isSelected = selectedSeats.includes(seat.number);

    let classes =
      "h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-all duration-200 ";

    if (isBooked) {
      classes += "bg-slate-900/60 text-slate-600 border border-slate-800/80 cursor-not-allowed opacity-40 line-through";
    } else if (isSelected) {
      classes +=
        "bg-gradient-to-tr from-sky-500 to-blue-600 text-white border border-sky-400 shadow-md shadow-sky-500/30 scale-105";
    } else {
      classes +=
        "bg-slate-800/90 text-slate-300 border border-slate-700 hover:border-sky-400 hover:bg-sky-500/20 hover:text-white cursor-pointer";
    }

    return (
      <button
        key={seat.number}
        type="button"
        disabled={isBooked}
        onClick={() => selectSeat(seat)}
        aria-label={`Seat ${seat.number}`}
        className={classes}
      >
        {seat.number}
      </button>
    );
  }
}

export default FlightDetails;