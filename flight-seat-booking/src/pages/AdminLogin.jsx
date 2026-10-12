import React from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  function loginAdmin(event) {
    event.preventDefault();

    if (email === "admin@gmail.com" && password === "1234") {
      setError("");
      navigate("/admin/dashboard");
      return;
    }

    setError("Invalid email or password. Default is admin@gmail.com / 1234");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 animate-fade-in-up">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/90 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-amber-500/10">
            🔐
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Log in to manage airline flights, schedules & capacity
          </p>
        </div>

        <form onSubmit={loginAdmin} className="space-y-5">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
            >
              Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              required
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 text-sm transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              placeholder="••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 text-sm transition-all"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Demo credentials:</span>
            <span className="font-mono text-slate-300">admin@gmail.com / 1234</span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-xl shadow-amber-500/20 transition-all duration-200 cursor-pointer"
          >
            Sign In to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;