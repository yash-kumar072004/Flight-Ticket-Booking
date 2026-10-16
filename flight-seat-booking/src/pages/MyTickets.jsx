import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserTickets, getTicketByPnr, cancelTicket } from "../utils/ticketStorage.js";
import TicketCard from "../components/tickets/TicketCard.jsx";
import BoardingPassModal from "../components/tickets/BoardingPassModal.jsx";

function MyTickets() {
  const currentUser = useSelector((state) => state.auth?.user);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  const [cancelledTicketIds, setCancelledTicketIds] = useState([]);
  const [filterTab, setFilterTab] = useState("all"); // all | confirmed | cancelled
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicketForModal, setSelectedTicketForModal] = useState(null);
  const [notification, setNotification] = useState("");

  // PNR lookup state for guest users or quick retrieval
  const [lookupPnr, setLookupPnr] = useState("");
  const [lookupError, setLookupError] = useState("");

  // Derive user tickets reactively
  const rawTickets = useMemo(() => {
    if (!currentUser) return [];
    return getUserTickets(currentUser.email, currentUser.id);
  }, [currentUser]);

  const tickets = useMemo(() => {
    return rawTickets.map((t) =>
      cancelledTicketIds.includes(t.id) ? { ...t, status: "CANCELLED" } : t
    );
  }, [rawTickets, cancelledTicketIds]);

  function handleCancelBooking(ticket) {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel booking ${ticket.pnr} for ${ticket.flight.name}? Seats will be released.`
    );
    if (!confirmCancel) return;

    const res = cancelTicket(ticket.id);
    if (res.success) {
      setCancelledTicketIds((prev) => [...prev, ticket.id]);
      setNotification(`Booking ${ticket.pnr} has been cancelled successfully.`);
      setTimeout(() => setNotification(""), 4000);
    }
  }

  function handlePnrLookup(e) {
    e.preventDefault();
    setLookupError("");
    const found = getTicketByPnr(lookupPnr);
    if (found) {
      setSelectedTicketForModal(found);
      setLookupPnr("");
    } else {
      setLookupError("No booking found with PNR: " + lookupPnr.toUpperCase().trim());
    }
  }

  // Filtered tickets based on tab and search
  const filteredTickets = tickets.filter((t) => {
    // Tab filter
    if (filterTab === "confirmed" && t.status !== "CONFIRMED") return false;
    if (filterTab === "cancelled" && t.status !== "CANCELLED") return false;

    // Search query filter
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const flightName = t.flight?.name?.toLowerCase() || "";
    const from = t.flight?.from?.toLowerCase() || "";
    const to = t.flight?.to?.toLowerCase() || "";
    const pnr = t.pnr?.toLowerCase() || "";
    const passengerNames = t.passengers?.map((p) => p.name?.toLowerCase()).join(" ") || "";

    return (
      flightName.includes(q) ||
      from.includes(q) ||
      to.includes(q) ||
      pnr.includes(q) ||
      passengerNames.includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500/95 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-fade-in-up">
          <span>✓</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Boarding Pass Modal */}
      {selectedTicketForModal && (
        <BoardingPassModal
          ticket={selectedTicketForModal}
          onClose={() => setSelectedTicketForModal(null)}
        />
      )}

      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
            🎫 Digital Tickets & Boarding Passes
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {isAuthenticated ? `Welcome, ${currentUser?.name || "Traveler"}` : "My Flight Tickets"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Access your booked flights anytime, retrieve boarding passes, and download PDFs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>✈️</span>
            <span>Book New Flight</span>
          </Link>
        </div>
      </div>

      {/* If Not Logged In */}
      {!isAuthenticated && (
        <div className="my-10 space-y-8">
          <div className="max-w-2xl mx-auto bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-10 text-center backdrop-blur-xl shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-3xl mx-auto mb-4">
              🔐
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Sign in to view your tickets</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              Log in to your SkyBook account to view all your upcoming trips, download boarding passes, or manage your bookings anytime.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-xl shadow-sky-500/20 transition-all"
              >
                Sign In to Account
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Create New Account
              </Link>
            </div>
          </div>

          {/* Quick PNR Retrieval Box for Guests */}
          <div className="max-w-xl mx-auto bg-slate-950/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🔍</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Quick PNR Lookup
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Booked as a guest or looking for a specific flight? Enter your 9-character PNR code:
            </p>

            <form onSubmit={handlePnrLookup} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. SKY884920"
                value={lookupPnr}
                onChange={(e) => setLookupPnr(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white uppercase font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-sky-500 hover:bg-sky-400 text-white transition-colors cursor-pointer"
              >
                Find Ticket
              </button>
            </form>

            {lookupError && (
              <p className="text-xs text-rose-400 mt-2 font-medium flex items-center gap-1.5">
                <span>⚠️</span>
                <span>{lookupError}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* If Logged In */}
      {isAuthenticated && (
        <div className="mt-8 space-y-6">
          {/* Controls: Search & Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFilterTab("all")}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  filterTab === "all"
                    ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All Tickets ({tickets.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterTab("confirmed")}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  filterTab === "confirmed"
                    ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Confirmed ({tickets.filter((t) => t.status === "CONFIRMED").length})
              </button>

              <button
                type="button"
                onClick={() => setFilterTab("cancelled")}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  filterTab === "cancelled"
                    ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Cancelled ({tickets.filter((t) => t.status === "CANCELLED").length})
              </button>
            </div>

            {/* Search within tickets */}
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                placeholder="Search by PNR, City or Flight..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <span className="absolute left-3 top-2.5 text-xs text-slate-400 pointer-events-none">
                🔍
              </span>
            </div>
          </div>

          {/* Tickets List */}
          {filteredTickets.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8">
              <div className="text-4xl mb-3">🎫</div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {tickets.length === 0 ? "No tickets booked yet" : "No matching tickets found"}
              </h3>
              <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">
                {tickets.length === 0
                  ? "Explore our available flights, choose your preferred seat, and your boarding pass will appear right here!"
                  : "Try clearing your search query or changing the filter tab."}
              </p>
              {tickets.length === 0 ? (
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white transition-colors"
                >
                  Explore Flights
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterTab("all");
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onViewPass={(t) => setSelectedTicketForModal(t)}
                  onCancelBooking={handleCancelBooking}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyTickets;
