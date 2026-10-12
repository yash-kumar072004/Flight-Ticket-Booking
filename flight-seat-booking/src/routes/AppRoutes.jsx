import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import FlightList from "../components/FlightList.jsx";
import FlightDetails from "../pages/FlightDetails.jsx";
import PassengerDetails from "../pages/PassengerDetails.jsx";
import MealSelection from "../pages/MealSelection.jsx";
import LuggageSelection from "../pages/LuggageSelection.jsx";
import BoardingPass from "../pages/BoardingPass.jsx";
import AdminLogin from "../pages/AdminLogin.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";

function AppRoutes () {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<FlightList />}
        />

        <Route
          path="/flights/:flightId"
          element={<FlightDetails />}
        />

        <Route
          path="/flights/:flightId/passenger"
          element={<PassengerDetails />}
        />

        <Route
          path="/flights/:flightId/meals"
          element={<MealSelection />}
        />

        <Route
          path="/flights/:flightId/luggage"
          element={<LuggageSelection />}
        />

        <Route
          path="/flights/:flightId/boarding-pass"
          element={<BoardingPass />}
        />
        <Route
          path="/admin"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;