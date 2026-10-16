import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authenticateUser } from "../utils/authStorage.js";
import { loginSuccess } from "../redux/slices/authSlice.js";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Where to redirect after login (default to /my-tickets or home)
  const from = location.state?.from?.pathname || "/my-tickets";

  function handleLogin(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = authenticateUser(email, password);

    if (result.success) {
      dispatch(loginSuccess(result.user));
      navigate(from, { replace: true });
    } else {
      setError(result.message || "Invalid email or password");
      setIsLoading(false);
    }
  }

  function fillDemoUser() {
    setEmail("yash@example.com");
    setPassword("password123");
    setError("");
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 animate-fade-in-up">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/90 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 rounded-full bg-sky-500/15 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-36 h-36 rounded-full bg-blue-600/15 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-sky-500/25">
            ✈️
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Sign in to access your booked tickets, boarding passes & travel history
          </p>
        </div>

        {/* Quick Demo Fill Button */}
        <div className="mb-6 p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[11px] font-semibold text-sky-400 block uppercase tracking-wider">
              ⚡ Quick Testing
            </span>
            <span className="text-xs text-slate-300 font-mono">yash@example.com / password123</span>
          </div>
          <button
            type="button"
            onClick={fillDemoUser}
            className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-semibold transition-all cursor-pointer border border-sky-400/30 active:scale-95"
          >
            Auto Fill
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="user-email"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
            >
              Email Address
            </label>
            <input
              id="user-email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="user-password"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <input
                id="user-password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-xl shadow-sky-500/25 transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : "Sign In to Account"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              state={location.state}
              className="font-semibold text-sky-400 hover:text-sky-300 hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
