import React from "react";
import { useNavigate } from "react-router-dom";
import { loadFlights, saveFlights } from "../utils/flightStorage.js";

function AdminDashboard() {
  const navigate = useNavigate();

  const [flights, setFlights] = React.useState(loadFlights());
  const [showForm, setShowForm] = React.useState(false);
  const [editingFlightId, setEditingFlightId] = React.useState(null);

  const [flightName, setFlightName] = React.useState("");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [departureTime, setDepartureTime] = React.useState("");
  const [arrivalTime, setArrivalTime] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [date, setDate] = React.useState("");
  const [totalSeats, setTotalSeats] = React.useState("");
  const [includedWeight, setIncludedWeight] = React.useState("");
  const [maximumWeight, setMaximumWeight] = React.useState("");

  function resetForm() {
    setFlightName("");
    setFrom("");
    setTo("");
    setDepartureTime("");
    setArrivalTime("");
    setPrice("");
    setDate("");
    setTotalSeats("");
    setIncludedWeight("");
    setMaximumWeight("");
    setEditingFlightId(null);
  }

  function openAddFlightForm() {
    resetForm();
    setShowForm(true);
  }

  function openEditFlightForm(flight) {
    setEditingFlightId(flight.id);
    setFlightName(flight.name);
    setFrom(flight.from);
    setTo(flight.to);
    setDepartureTime(flight.departureTime);
    setArrivalTime(flight.arrivalTime);
    setPrice(flight.price);
    setDate(flight.date);
    setTotalSeats(flight.totalSeats);
    setIncludedWeight(flight.luggage.includedWeight);
    setMaximumWeight(flight.luggage.maximumWeight);
    setShowForm(true);
  }

  function closeForm() {
    resetForm();
    setShowForm(false);
  }

  function saveFlight(event) {
    event.preventDefault();

    const flightData = {
      name: flightName,
      from: from,
      to: to,
      departureTime: departureTime,
      arrivalTime: arrivalTime,
      price: Number(price),
      date: date,
      totalSeats: Number(totalSeats),
      luggage: {
        includedWeight: Number(includedWeight),
        maximumWeight: Number(maximumWeight),
      },
    };

    let updatedFlights;

    if (editingFlightId) {
      updatedFlights = flights.map((flight) => {
        if (flight.id === editingFlightId) {
          return {
            ...flight,
            ...flightData,
          };
        }
        return flight;
      });
    } else {
      const newFlight = {
        id: Date.now(),
        ...flightData,
        bookedSeats: [],
      };
      updatedFlights = flights.concat(newFlight);
    }

    setFlights(updatedFlights);
    saveFlights(updatedFlights);
    closeForm();
  }

  function deleteFlight(flightId) {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this flight?"
    );
    if (!shouldDelete) return;

    const updatedFlights = flights.filter((flight) => flight.id !== flightId);
    setFlights(updatedFlights);
    saveFlights(updatedFlights);
  }

  function goToLogin() {
    navigate("/admin");
  }

  // Calculate overview stats
  const totalBookedSeats = flights.reduce((sum, f) => sum + (f.bookedSeats?.length || 0), 0);
  const totalCapacity = flights.reduce((sum, f) => sum + (f.totalSeats || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            ✈️ Airline Operations
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Admin Flight Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure routes, update pricing, monitor seat capacity and manage luggage policies
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openAddFlightForm}
            className="px-4 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Add Flight</span>
          </button>

          <button
            type="button"
            onClick={goToLogin}
            className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Scheduled Flights
          </span>
          <span className="text-3xl font-extrabold text-white mt-1 block">
            {flights.length}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">Across Indian metros</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Booked Seats
          </span>
          <span className="text-3xl font-extrabold text-sky-400 mt-1 block">
            {totalBookedSeats}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Out of {totalCapacity} seats
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Seat Occupancy
          </span>
          <span className="text-3xl font-extrabold text-emerald-400 mt-1 block">
            {totalCapacity > 0 ? Math.round((totalBookedSeats / totalCapacity) * 100) : 0}%
          </span>
          <span className="text-xs text-slate-500 mt-1 block">Average system-wide load</span>
        </div>
      </div>

      {/* Modal / Inline Flight Edit & Add Form */}
      {showForm && (
        <div className="bg-slate-900/90 border border-sky-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl mb-8 relative">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{editingFlightId ? "✏️ Edit Flight Schedule" : "➕ Register New Flight"}</span>
            </h2>
            <button
              type="button"
              onClick={closeForm}
              className="text-slate-400 hover:text-white text-lg font-bold p-1"
            >
              ✕
            </button>
          </div>

          <form onSubmit={saveFlight}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              {/* Flight Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Flight Name / Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Air India AI-101"
                  value={flightName}
                  onChange={(e) => setFlightName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-sm"
                />
              </div>

              {/* From */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Origin City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delhi"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-sm"
                />
              </div>

              {/* To */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Destination City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-sm"
                />
              </div>

              {/* Departure */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Departure Time *
                </label>
                <input
                  type="time"
                  required
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-sm"
                />
              </div>

              {/* Arrival */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Arrival Time *
                </label>
                <input
                  type="time"
                  required
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-sm"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Base Price (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="5500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-sm"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Flight Date *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-sm"
                />
              </div>

              {/* Total Seats */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Total Aircraft Seats *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="150"
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-sm"
                />
              </div>

              {/* Luggage Included */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Included Luggage (kg) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="15"
                  value={includedWeight}
                  onChange={(e) => setIncludedWeight(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-sm"
                />
              </div>

              {/* Maximum Luggage */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Max Permitted Luggage (kg) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="25"
                  value={maximumWeight}
                  onChange={(e) => setMaximumWeight(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                {editingFlightId ? "Save Changes" : "Create Flight"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Flight Management Cards */}
      <div className="space-y-4">
        {flights.map((flight) => {
          const bookedCount = flight.bookedSeats?.length || 0;
          const availableCount = flight.totalSeats - bookedCount;
          const occupancyRate = Math.round((bookedCount / flight.totalSeats) * 100);

          return (
            <div
              key={flight.id}
              className="bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 backdrop-blur-md shadow-xl transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Flight info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center text-xl shrink-0">
                    ✈️
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-white">{flight.name}</h3>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                        {flight.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-sky-300">
                      <span>{flight.from}</span>
                      <span className="text-xs text-slate-500">({flight.departureTime})</span>
                      <span className="text-slate-500">→</span>
                      <span>{flight.to}</span>
                      <span className="text-xs text-slate-500">({flight.arrivalTime})</span>
                    </div>
                  </div>
                </div>

                {/* Capacity & Price stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-slate-400 block mb-0.5">Price</span>
                    <span className="text-sm font-bold text-white">
                      ₹{flight.price.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-slate-400 block mb-0.5">Seats</span>
                    <span className="text-sm font-bold text-white">
                      {bookedCount} / {flight.totalSeats}{" "}
                      <span className="text-[10px] text-sky-400 font-normal">({occupancyRate}%)</span>
                    </span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-slate-400 block mb-0.5">Available</span>
                    <span className="text-sm font-bold text-emerald-400">{availableCount}</span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-slate-400 block mb-0.5">Luggage</span>
                    <span className="text-sm font-semibold text-slate-300">
                      {flight.luggage.includedWeight}-{flight.luggage.maximumWeight}kg
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800 justify-end">
                  <button
                    type="button"
                    onClick={() => openEditFlightForm(flight)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteFlight(flight.id)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminDashboard;