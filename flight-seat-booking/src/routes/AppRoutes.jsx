import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Home from "../pages/Home.jsx";
import FlightDetails from "../pages/FlightDetails.jsx";
import PassengerDetails from "../pages/PassengerDetails.jsx";
import MealSelection from "../pages/MealSelection.jsx";
import LuggageSelection from "../pages/LuggageSelection.jsx";
import BoardingPass from "../pages/BoardingPass.jsx";
import MyTickets from "../pages/MyTickets.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import AdminLogin from "../pages/AdminLogin.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col justify-between selection:bg-sky-500 selection:text-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flights/:flightId" element={<FlightDetails />} />
            <Route path="/flights/:flightId/passenger" element={<PassengerDetails />} />
            <Route path="/flights/:flightId/meals" element={<MealSelection />} />
            <Route path="/flights/:flightId/luggage" element={<LuggageSelection />} />
            <Route path="/flights/:flightId/boarding-pass" element={<BoardingPass />} />

            {/* User Authentication & Tickets */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-tickets" element={<MyTickets />} />

            {/* Admin Operations */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default AppRoutes;