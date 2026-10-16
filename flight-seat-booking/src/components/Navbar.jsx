import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice.js";
import { getUserTickets } from "../utils/ticketStorage.js";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth?.user);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = location.pathname.startsWith("/admin");

  // Get user ticket count for badge
  const userTickets = currentUser ? getUserTickets(currentUser.email, currentUser.id) : [];
  const activeTicketCount = userTickets.filter((t) => t.status === "CONFIRMED").length;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    dispatch(logout());
    setDropdownOpen(false);
    navigate("/");
  }

  // Get user initials
  function getInitials(name) {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

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

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3">
          <Link
            to="/"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              location.pathname === "/"
                ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            Explore Flights
          </Link>

          {/* My Tickets Nav Item */}
          <Link
            to="/my-tickets"
            className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              location.pathname === "/my-tickets"
                ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <span>🎫</span>
            <span>My Tickets</span>
            {isAuthenticated && activeTicketCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-sky-500 text-slate-950">
                {activeTicketCount}
              </span>
            )}
          </Link>

          {/* Admin link */}
          {isAdmin ? (
            <Link
              to="/admin/dashboard"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20"
            >
              Admin Dashboard
            </Link>
          ) : (
            <Link
              to="/admin"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
            >
              <span>🔒</span>
              <span>Admin</span>
            </Link>
          )}

          <div className="h-4 w-px bg-slate-800 mx-1"></div>

          {/* User Auth Section */}
          {isAuthenticated && currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-sky-500/20">
                  {currentUser.avatar || getInitials(currentUser.name)}
                </div>
                <div className="text-left hidden lg:block">
                  <span className="text-xs font-bold text-white block leading-tight max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-sky-400 block leading-none">Passenger</span>
                </div>
                <span className="text-slate-400 text-[10px] ml-1">▼</span>
              </button>

              {/* Profile Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl py-2 z-50 animate-fade-in-up">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-slate-800/80">
                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    {currentUser.phone && (
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {currentUser.phone}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="py-1">
                    <Link
                      to="/my-tickets"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center justify-between px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span>🎫</span>
                        <span>My Bookings</span>
                      </span>
                      {activeTicketCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-400">
                          {activeTicketCount}
                        </span>
                      )}
                    </Link>

                    <Link
                      to="/"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                    >
                      <span>🔍</span>
                      <span>Find Flights</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <span>🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/20 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && (
            <Link
              to="/my-tickets"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 text-xs font-bold flex items-center gap-1"
            >
              <span>🎫</span>
              {activeTicketCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center text-[10px]">
                  {activeTicketCount}
                </span>
              )}
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-base"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-3 animate-fade-in-up">
          {isAuthenticated && currentUser && (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-sm font-bold">
                {currentUser.avatar || getInitials(currentUser.name)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                location.pathname === "/"
                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              ✈️ Explore Flights
            </Link>

            <Link
              to="/my-tickets"
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                location.pathname === "/my-tickets"
                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🎫</span>
                <span>My Bookings & Tickets</span>
              </span>
              {activeTicketCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500 text-slate-950">
                  {activeTicketCount}
                </span>
              )}
            </Link>

            <Link
              to="/admin"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              🔒 Admin Operations Portal
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2 w-full">
                <Link
                  to="/login"
                  className="py-2.5 rounded-xl text-center text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="py-2.5 rounded-xl text-center text-xs font-bold bg-sky-500 text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
