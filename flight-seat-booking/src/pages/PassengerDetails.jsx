import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updatePassengerDetails } from "../redux/slices/bookingSlice.js";

function PassengerDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const flight = useSelector((state) => state.booking.flight);
  const passengers = useSelector((state) => state.booking.passengers);
  const currentUser = useSelector((state) => state.auth?.user);

  const [passengerData, setPassengerData] = React.useState(() => {
    if (currentUser && passengers.length > 0 && !passengers[0].name) {
      return passengers.map((p, idx) =>
        idx === 0
          ? {
              ...p,
              name: currentUser.name || "",
              email: currentUser.email || "",
              phone: currentUser.phone || "",
              gender: currentUser.gender || p.gender || "Male",
            }
          : p
      );
    }
    return passengers;
  });

  function autofillUser(seat) {
    if (!currentUser) return;
    setPassengerData((prev) =>
      prev.map((p) =>
        p.seat === seat
          ? {
              ...p,
              name: currentUser.name || p.name,
              email: currentUser.email || p.email,
              phone: currentUser.phone || p.phone,
              gender: currentUser.gender || p.gender || "Male",
            }
          : p
      )
    );
  }

  function updatePassenger(event, seat) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    setPassengerData(
      passengerData.map((passenger) => {
        if (passenger.seat === seat) {
          return {
            ...passenger,
            [fieldName]: fieldValue,
          };
        }
        return passenger;
      })
    );
  }

  function isPassengerComplete(passenger) {
    return Boolean(
      passenger.name &&
      passenger.email &&
      passenger.phone &&
      passenger.age &&
      passenger.gender
    );
  }

  function isBookingComplete() {
    if (passengerData.length === 0) return false;
    return passengerData.every((p) => isPassengerComplete(p));
  }

  function continueBooking(e) {
    if (e) e.preventDefault();

    const inputs = document.querySelectorAll(
      ".passenger-card__form input, .passenger-card__form select"
    );

    let isValid = true;
    inputs.forEach((input) => {
      if (!input.checkValidity()) {
        input.reportValidity();
        isValid = false;
      }
    });

    if (!isValid || !isBookingComplete()) {
      return;
    }

    passengerData.forEach((passenger) => {
      dispatch(
        updatePassengerDetails({
          seat: passenger.seat,
          details: {
            name: passenger.name,
            email: passenger.email,
            phone: passenger.phone,
            age: passenger.age,
            gender: passenger.gender,
          },
        })
      );
    });

    navigate("/flights/" + flight.id + "/meals");
  }

  if (!flight || passengers.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center animate-fade-in-up">
        <div className="text-4xl mb-4">📋</div>
        <h1 className="text-xl font-bold text-white mb-2">Booking information not found</h1>
        <p className="text-sm text-slate-400 mb-6">
          Please select your flight and seats before adding passenger details.
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
      {/* Step Indicator */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-bold text-xs">
              ✓
            </span>
            <span>Seats</span>
          </div>
          <div className="h-0.5 flex-1 mx-2 sm:mx-4 bg-emerald-500/40"></div>

          <div className="flex items-center gap-2 text-sky-400">
            <span className="w-6 h-6 rounded-full bg-sky-500/20 border border-sky-400 flex items-center justify-center font-bold text-xs">
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

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Passenger Information
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          {flight.name} • {flight.from} → {flight.to} • {passengers.length} Passenger{passengers.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Form List */}
      <form onSubmit={continueBooking} className="space-y-6">
        {passengerData.map((passenger, index) => (
          <div
            key={passenger.seat}
            className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <h2 className="text-base font-bold text-white">Passenger {index + 1}</h2>
                {currentUser && index === 0 && (
                  <button
                    type="button"
                    onClick={() => autofillUser(passenger.seat)}
                    className="ml-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30 hover:bg-sky-500/25 transition-all cursor-pointer"
                  >
                    ⚡ Use My Details
                  </button>
                )}
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20">
                Seat {passenger.seat}
              </span>
            </div>

            {/* Note: passenger-card__form class retained for querySelector checkValidity */}
            <div className="passenger-card__form grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Full Name */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. John Doe"
                  value={passenger.name}
                  onChange={(e) => updatePassenger(e, passenger.seat)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 text-sm transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="john@example.com"
                  value={passenger.email}
                  onChange={(e) => updatePassenger(e, passenger.seat)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 text-sm transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  pattern="[0-9]{10}"
                  placeholder="10-digit number"
                  value={passenger.phone}
                  onChange={(e) => updatePassenger(e, passenger.seat)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 text-sm transition-all"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  required
                  min="1"
                  max="120"
                  placeholder="e.g. 28"
                  value={passenger.age}
                  onChange={(e) => updatePassenger(e, passenger.seat)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 text-sm transition-all"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  required
                  value={passenger.gender}
                  onChange={(e) => updatePassenger(e, passenger.seat)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 text-sm transition-all"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
          <button
            type="button"
            onClick={() => navigate("/flights/" + flight.id)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            ← Back to Seats
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-xl shadow-sky-500/25 transition-all duration-200 cursor-pointer"
          >
            Continue to Meals →
          </button>
        </div>
      </form>
    </div>
  );
}

export default PassengerDetails;
