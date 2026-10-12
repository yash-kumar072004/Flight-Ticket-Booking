import { useState } from "react";
import FlightCard from "./FlightCard.jsx";
import { loadFlights } from "../utils/flightStorage.jsx";

function FlightList() {
  const [flights] = useState(() => loadFlights());
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFlights = flights.filter((flight) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      flight.name.toLowerCase().includes(query) ||
      flight.from.toLowerCase().includes(query) ||
      flight.to.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-4">
          ✨ Premium Sky Travel
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Fly in Comfort with{" "}
          <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
            SkyBook
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
          Choose your flight, customize seating with our interactive aircraft layout, reserve delicious meals, and get ready for takeoff.
        </p>

        {/* Search bar */}
        <div className="mt-8 relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            🔍
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city (e.g. Delhi, Mumbai, Bangalore) or flight..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all text-sm shadow-xl"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Flight Cards Grid */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Available Flights</h2>
          <p className="text-xs text-slate-400">Showing {filteredFlights.length} scheduled departures</p>
        </div>
      </div>

      {filteredFlights.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80">
          <div className="text-4xl mb-3">🛫</div>
          <h3 className="text-lg font-semibold text-white mb-1">No flights match your search</h3>
          <p className="text-sm text-slate-400 mb-4">Try searching for a different city or airline.</p>
          <button
            onClick={() => setSearchQuery("")}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFlights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FlightList;