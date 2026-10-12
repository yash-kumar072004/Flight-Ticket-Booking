import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-xl shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
            ✈️
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-sky-100 to-sky-400 bg-clip-text text-transparent">
              SkyBook
            </span>
            <span className="block text-[10px] font-medium tracking-widest text-sky-400 uppercase">
              Airlines
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/"
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/"
                ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            Explore Flights
          </Link>

          {isAdmin ? (
            <Link
              to="/admin/dashboard"
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"
            >
              Admin Dashboard
            </Link>
          ) : (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <span>🔒</span>
              <span className="hidden sm:inline">Admin Portal</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
