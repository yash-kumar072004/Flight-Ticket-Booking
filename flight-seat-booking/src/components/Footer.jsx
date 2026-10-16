import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-lg shadow-lg shadow-sky-500/20">
                ✈️
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-sky-100 to-sky-400 bg-clip-text text-transparent">
                SkyBook
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Modern digital airline booking platform. Seamless seat reservation, gourmet meal selection, and 24/7 boarding pass access.
            </p>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Explore & Book
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-sky-400 transition-colors">
                  Search Flights
                </Link>
              </li>
              <li>
                <Link to="/my-tickets" className="hover:text-sky-400 transition-colors">
                  My Bookings & Tickets
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-sky-400 transition-colors">
                  Passenger Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-sky-400 transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Passenger Services */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Passenger Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span>💺</span>
                <span>Interactive Cabin Map</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>🍽️</span>
                <span>Pre-ordered In-flight Meals</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>🧳</span>
                <span>Extra Baggage Allowance</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>📄</span>
                <span>Instant PDF Boarding Passes</span>
              </li>
            </ul>
          </div>

          {/* Staff & Admin */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Operations & Admin
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors"
                >
                  <span>🔒</span>
                  <span>Admin Operations Portal</span>
                </Link>
              </li>
              <li className="text-[11px] text-slate-500 pt-2">
                Need support? SkyBook operates 24/7 across all major national airports.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SkyBook Airlines Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Carriage</span>
            <span>•</span>
            <span>Flight Safety Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
