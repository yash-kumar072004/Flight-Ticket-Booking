import { useNavigate } from "react-router-dom";

function FlightCard(props) {
  const flight = props.flight;
  const navigate = useNavigate();

  function selectFlight() {
    navigate("/flights/" + flight.id);
  }

  return (
    <div
      onClick={selectFlight}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-sky-500/50 p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-1 cursor-pointer backdrop-blur-sm"
    >
      {/* Decorative gradient corner glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-sky-500/5 group-hover:bg-sky-500/15 blur-2xl transition-all duration-500 pointer-events-none" />

      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 text-sm font-semibold">
              ✈️
            </div>
            <div>
              <h3 className="text-base font-semibold text-white group-hover:text-sky-300 transition-colors">
                {flight.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono">FL-{flight.id.toString().padStart(3, "0")}</p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Available
          </span>
        </div>

        {/* Route Details */}
        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/60 mb-5">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <span className="text-2xl font-bold text-white tracking-tight">
                {flight.departureTime}
              </span>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">
                {flight.from}
              </p>
            </div>

            <div className="flex flex-col items-center px-4 flex-1">
              <div className="w-full flex items-center gap-1">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-700 to-sky-500/40 rounded-full"></div>
                <span className="text-sky-400 text-sm transform group-hover:translate-x-1 transition-transform duration-300">
                  ✈
                </span>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-sky-500/40 to-slate-700 rounded-full"></div>
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-1">Direct Flight</span>
            </div>

            <div className="text-right">
              <span className="text-2xl font-bold text-white tracking-tight">
                {flight.arrivalTime}
              </span>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">
                {flight.to}
              </p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
          <div className="bg-slate-800/30 rounded-lg p-2.5 border border-slate-800/40">
            <span className="text-slate-400 block mb-0.5">Travel Date</span>
            <span className="text-slate-200 font-medium">{flight.date}</span>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-2.5 border border-slate-800/40">
            <span className="text-slate-400 block mb-0.5">Total Capacity</span>
            <span className="text-slate-200 font-medium">{flight.totalSeats} Seats</span>
          </div>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
        <div>
          <span className="text-xs text-slate-400 block">Starting from</span>
          <div className="text-xl font-bold text-white">
            ₹{flight.price.toLocaleString("en-IN")}
            <span className="text-xs text-slate-400 font-normal ml-1">/ person</span>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            selectFlight();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/25 group-hover:shadow-sky-500/40 transition-all duration-200"
        >
          Select
          <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
        </button>
      </div>
    </div>
  );
}

export default FlightCard;