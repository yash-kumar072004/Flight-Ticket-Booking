import { useState } from "react";

function TicketCard({ ticket, onViewPass, onCancelBooking }) {
  const [copied, setCopied] = useState(false);
  const { pnr, flight, passengers, totalAmount, bookingDate, status } = ticket;

  function copyPnr(e) {
    e.stopPropagation();
    navigator.clipboard.writeText(pnr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isCancelled = status === "CANCELLED";
  const passengerNames = passengers.map((p) => p.name || "Guest").join(", ");

  return (
    <div
      className={`group relative rounded-3xl bg-slate-900/80 border transition-all duration-300 hover:shadow-2xl overflow-hidden backdrop-blur-md ${
        isCancelled
          ? "border-rose-900/40 opacity-75"
          : "border-slate-800/90 hover:border-sky-500/40 hover:shadow-sky-500/10"
      }`}
    >
      {/* Decorative top ribbon */}
      <div
        className={`h-1.5 w-full ${
          isCancelled
            ? "bg-rose-500"
            : "bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600"
        }`}
      />

      <div className="p-6 sm:p-7">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-lg">
              ✈️
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                {flight.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-400 font-mono">Date: {flight.date}</span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] text-slate-500">
                  Booked: {new Date(bookingDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* PNR Code Pill */}
            <div
              onClick={copyPnr}
              title="Click to copy PNR"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs font-mono transition-colors"
            >
              <span className="text-slate-400">PNR:</span>
              <span className="font-bold text-amber-400">{pnr}</span>
              <span className="text-[11px] text-slate-400">{copied ? "✓" : "📋"}</span>
            </div>

            {/* Status Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isCancelled
                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        {/* Flight Route Box */}
        <div className="my-5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-2xl font-black text-white">{flight.departureTime}</span>
            <p className="text-xs font-bold text-sky-400 uppercase tracking-wider mt-0.5">
              {flight.from}
            </p>
          </div>

          <div className="flex flex-col items-center px-4 flex-1">
            <span className="text-[11px] text-slate-400 mb-1">Direct Flight</span>
            <div className="w-full flex items-center gap-1 max-w-[140px]">
              <div className="h-0.5 flex-1 bg-sky-500/30 rounded-full"></div>
              <span className="text-sky-400 text-xs">✈</span>
              <div className="h-0.5 flex-1 bg-sky-500/30 rounded-full"></div>
            </div>
            <span className="text-[10px] text-slate-500 mt-1">Terminal 2 • Gate G-04</span>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-white">{flight.arrivalTime}</span>
            <p className="text-xs font-bold text-sky-400 uppercase tracking-wider mt-0.5">
              {flight.to}
            </p>
          </div>
        </div>

        {/* Passenger & Booking Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-xs">
          <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
            <span className="text-slate-400 block mb-0.5">Passengers</span>
            <span className="text-white font-semibold block truncate" title={passengerNames}>
              {passengerNames}
            </span>
          </div>

          <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
            <span className="text-slate-400 block mb-0.5">Reserved Seat(s)</span>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {passengers.map((p) => (
                <span
                  key={p.seat}
                  className="px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-300 font-bold text-xs"
                >
                  {p.seat}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
            <span className="text-slate-400 block mb-0.5">Add-ons</span>
            <span className="text-slate-300 font-medium">
              {passengers.reduce((sum, p) => sum + (p.meals?.length || 0), 0)} Meals • Luggage
            </span>
          </div>

          <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
            <span className="text-slate-400 block mb-0.5">Total Paid</span>
            <span className="text-base font-extrabold text-amber-400">
              ₹{totalAmount?.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => onViewPass(ticket)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>🎫</span>
            <span>View Boarding Pass</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewPass(ticket)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>📄</span>
              <span>Download PDF</span>
            </button>

            {!isCancelled && (
              <button
                type="button"
                onClick={() => onCancelBooking(ticket)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
              >
                Cancel Flight
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketCard;
