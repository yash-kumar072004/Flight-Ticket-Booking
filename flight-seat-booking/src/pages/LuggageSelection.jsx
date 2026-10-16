import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updatePassengerLuggage } from "../redux/slices/bookingSlice.js";

function LuggageSelection() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const flight = useSelector((state) => state.booking.flight);
  const passengers = useSelector((state) => state.booking.passengers);

  const [passengerLuggage, setPassengerLuggage] = React.useState(
    passengers.map((passenger) => ({
      seat: passenger.seat,
      weight: passenger.luggage.weight,
    }))
  );

  function getPassengerLuggage(seat) {
    const passenger = passengerLuggage.find((item) => item.seat === seat);
    return passenger ? passenger.weight : "";
  }

  function updateLuggage(seat, event) {
    const value = event.target.value;

    if (value === "") {
      setPassengerLuggage(
        passengerLuggage.map((passenger) =>
          passenger.seat === seat ? { seat: seat, weight: "" } : passenger
        )
      );
      return;
    }

    const weight = Number(value);
    if (weight < 0) return;

    setPassengerLuggage(
      passengerLuggage.map((passenger) =>
        passenger.seat === seat ? { seat: seat, weight: weight } : passenger
      )
    );
  }

  function calculateLuggageCost(weight) {
    let extraWeight = 0;
    if (weight > flight.luggage.includedWeight) {
      extraWeight = weight - flight.luggage.includedWeight;
    }
    return extraWeight * 100;
  }

  function isPassengerLuggageValid(passenger) {
    if (passenger.weight === "") return false;
    if (Number(passenger.weight) > flight.luggage.maximumWeight) return false;
    return true;
  }

  function isLuggageComplete() {
    if (passengerLuggage.length === 0) return false;
    return passengerLuggage.every((p) => isPassengerLuggageValid(p));
  }

  function continueBooking() {
    if (!isLuggageComplete()) return;

    passengerLuggage.forEach((passenger) => {
      const luggageCost = calculateLuggageCost(passenger.weight);
      dispatch(
        updatePassengerLuggage({
          seat: passenger.seat,
          luggage: {
            weight: passenger.weight,
            cost: luggageCost,
          },
        })
      );
    });

    navigate("/flights/" + flight.id + "/boarding-pass");
  }

  if (!flight || passengers.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center animate-fade-in-up">
        <div className="text-4xl mb-4">🧳</div>
        <h1 className="text-xl font-bold text-white mb-2">Booking information not found</h1>
        <p className="text-sm text-slate-400 mb-6">
          Please select your flight and seats first.
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

          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-bold text-xs">
              ✓
            </span>
            <span>Passengers</span>
          </div>
          <div className="h-0.5 flex-1 mx-2 sm:mx-4 bg-emerald-500/40"></div>

          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-bold text-xs">
              ✓
            </span>
            <span>Meals</span>
          </div>
          <div className="h-0.5 flex-1 mx-2 sm:mx-4 bg-emerald-500/40"></div>

          <div className="flex items-center gap-2 text-sky-400">
            <span className="w-6 h-6 rounded-full bg-sky-500/20 border border-sky-400 flex items-center justify-center font-bold text-xs">
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
          Baggage Selection
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Specify luggage weight per passenger. Extra weight over {flight.luggage.includedWeight} kg is charged at ₹100/kg.
        </p>
      </div>

      {/* Allowance Overview Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl">
            📦
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Complimentary Allowance</span>
            <span className="text-base font-bold text-emerald-400">
              {flight.luggage.includedWeight} kg / passenger
            </span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">
            ⚖️
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Max Permitted Weight</span>
            <span className="text-base font-bold text-amber-400">
              {flight.luggage.maximumWeight} kg / passenger
            </span>
          </div>
        </div>
      </div>

      {/* Passengers Luggage Cards */}
      <div className="space-y-6">
        {passengerLuggage.map((passenger, index) => {
          const passInfo = passengers.find((p) => p.seat === passenger.seat);
          const passengerName = passInfo?.name || `Passenger ${index + 1}`;
          const selectedWeight = getPassengerLuggage(passenger.seat);

          let extraWeight = 0;
          let luggageCost = 0;

          if (selectedWeight !== "") {
            if (selectedWeight > flight.luggage.includedWeight) {
              extraWeight = selectedWeight - flight.luggage.includedWeight;
              luggageCost = calculateLuggageCost(selectedWeight);
            }
          }

          const isOverweight =
            selectedWeight !== "" && Number(selectedWeight) > flight.luggage.maximumWeight;

          return (
            <div
              key={passenger.seat}
              className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">{passengerName}</h2>
                    <span className="text-xs text-slate-400">Seat {passenger.seat}</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20">
                  Seat {passenger.seat}
                </span>
              </div>

              {/* Input section */}
              <div className="mb-6">
                <label
                  htmlFor={"luggage-" + passenger.seat}
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
                >
                  Baggage Weight (in kg) *
                </label>
                <div className="relative">
                  <input
                    id={"luggage-" + passenger.seat}
                    type="number"
                    min="0"
                    placeholder="Enter total luggage weight..."
                    value={selectedWeight}
                    onChange={(e) => updateLuggage(passenger.seat, e)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 text-sm transition-all"
                  />
                  <span className="absolute inset-y-0 right-4 flex items-center text-xs text-slate-400 font-semibold pointer-events-none">
                    KG
                  </span>
                </div>

                {isOverweight && (
                  <div className="mt-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                    <span>⚠️</span>
                    <span>
                      Weight exceeds maximum allowed limit of {flight.luggage.maximumWeight} kg.
                    </span>
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-lg font-bold text-white block">
                    {selectedWeight === "" ? 0 : selectedWeight} kg
                  </span>
                  <span className="text-[11px] text-slate-400">Entered Weight</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-lg font-bold text-amber-400 block">
                    {extraWeight} kg
                  </span>
                  <span className="text-[11px] text-slate-400">Extra Weight</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-lg font-bold text-sky-400 block">
                    ₹{luggageCost}
                  </span>
                  <span className="text-[11px] text-slate-400">Baggage Fee</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4">
        <button
          type="button"
          onClick={() => navigate("/flights/" + flight.id + "/meals")}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          ← Back to Meals
        </button>

        <button
          type="button"
          disabled={!isLuggageComplete()}
          onClick={continueBooking}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${
            isLuggageComplete()
              ? "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-xl shadow-sky-500/25 cursor-pointer"
              : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
          }`}
        >
          Generate Boarding Pass →
        </button>
      </div>
    </div>
  );
}

export default LuggageSelection;
