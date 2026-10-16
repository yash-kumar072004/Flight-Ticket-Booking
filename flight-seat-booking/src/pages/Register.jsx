import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../utils/authStorage.js";
import { registerSuccess } from "../redux/slices/authSlice.js";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "Male",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || "/my-tickets";

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  }

  function handleRegister(e) {
    e.preventDefault();
    setError("");

    // Form validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setIsLoading(true);

    const result = registerUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      password: formData.password,
    });

    if (result.success) {
      dispatch(registerSuccess(result.user));
      navigate(from, { replace: true });
    } else {
      setError(result.message || "Registration failed. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 animate-fade-in-up">
      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800/90 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 rounded-full bg-sky-500/15 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-36 h-36 rounded-full bg-blue-600/15 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-sky-500/25">
            🛫
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create SkyBook Account</h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Register to easily manage your flights, view boarding passes & access exclusive fares
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label
              htmlFor="reg-name"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Full Name *
            </label>
            <input
              id="reg-name"
              name="name"
              type="text"
              required
              placeholder="e.g. Yash Kumar"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="reg-email"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Email Address *
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="reg-phone"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Mobile Number *
              </label>
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="reg-gender"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Gender
            </label>
            <select
              id="reg-gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm transition-all cursor-pointer"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="reg-password"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Password *
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Min 6 chars"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm transition-all pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-confirm-password"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Confirm Password *
              </label>
              <input
                id="reg-confirm-password"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-xl shadow-sky-500/25 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account & Sign In"}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              state={location.state}
              className="font-semibold text-sky-400 hover:text-sky-300 hover:underline"
            >
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
