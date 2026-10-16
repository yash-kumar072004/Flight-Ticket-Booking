import { useState } from "react";
import FlightCard from "../components/FlightCard.jsx";
import { loadFlights } from "../utils/flightStorage.js";

function Home() {
  const [flights] = useState(() => loadFlights());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");

  // Filter routes
  const filteredFlights = flights
    .filter((flight) => {
      // Route filter
      if (selectedRoute !== "all") {
        const [fromCity, toCity] = selectedRoute.split("-");
        if (flight.from.toLowerCase() !== fromCity || flight.to.toLowerCase() !== toCity) {
          return false;
        }
      }

      // Search query
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase().trim();
      return (
        flight.name.toLowerCase().includes(query) ||
        flight.from.toLowerCase().includes(query) ||
        flight.to.toLowerCase().includes(query) ||
        flight.date.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "time") return a.departureTime.localeCompare(b.departureTime);
      return 0; // recommended default
    });

  const popularRoutes = [
    { label: "All Routes", value: "all" },
    { label: "Delhi → Mumbai", value: "delhi-mumbai" },
    { label: "Mumbai → Bangalore", value: "mumbai-bangalore" },
    { label: "Delhi → Goa", value: "delhi-goa" },
    { label: "Bangalore → Delhi", value: "bangalore-delhi" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-12 relative">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-4">
          ✨ Premium Sky Travel
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4">
          Fly in Comfort with{" "}
          <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
            SkyBook
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
          Choose your flight, customize seating with our interactive aircraft layout, reserve delicious meals, and access your tickets anytime.
        </p>

        {/* Search bar */}
        <div className="mt-8 relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 text-lg">
            🔍
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city (e.g. Delhi, Mumbai, Bangalore) or airline..."
            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all text-sm shadow-2xl backdrop-blur-md"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick route chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          {popularRoutes.map((route) => (
            <button
              key={route.value}
              onClick={() => setSelectedRoute(route.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedRoute === route.value
                  ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                  : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {route.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center text-lg">
            💺
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Live Seat Selection</h4>
            <p className="text-[11px] text-slate-400">Interactive aircraft cabin layout map</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
            🍽️
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Gourmet In-Flight Meals</h4>
            <p className="text-[11px] text-slate-400">Pre-order freshly prepared meal choices</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg">
            🎫
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Anytime Ticket Access</h4>
            <p className="text-[11px] text-slate-400">Save, view & download boarding passes 24/7</p>
          </div>
        </div>
      </div>

      {/* Flight Cards Controls & Grid */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Available Scheduled Flights</h2>
          <p className="text-xs text-slate-400">
            Showing {filteredFlights.length} departures across Indian metros
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="time">Departure Time</option>
          </select>
        </div>
      </div>

      {filteredFlights.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8">
          <div className="text-4xl mb-3">🛫</div>
          <h3 className="text-lg font-semibold text-white mb-1">No flights match your search</h3>
          <p className="text-sm text-slate-400 mb-4 max-w-sm mx-auto">
            Try adjusting your search keywords, origin city, or clear the active route filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedRoute("all");
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Reset All Filters
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

export default Home;
