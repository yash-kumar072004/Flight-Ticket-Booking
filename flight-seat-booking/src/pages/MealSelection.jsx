import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updatePassengerMeals } from "../redux/slices/bookingSlice.js";

function MealSelection() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const flight = useSelector((state) => state.booking.flight);
  const passengers = useSelector((state) => state.booking.passengers);

  const meals = [
    {
      id: 1,
      name: "Vegetarian Gourmet",
      icon: "🥗",
      description: "Steamed fragrant rice, paneer butter masala, crisp garden salad & gulab jamun",
      price: 250,
    },
    {
      id: 2,
      name: "Non-Veg Royal",
      icon: "🍗",
      description: "Butter chicken with saffron rice, mixed veggies, dinner roll & chocolate mousse",
      price: 350,
    },
    {
      id: 3,
      name: "Vegan Fresh",
      icon: "🥬",
      description: "Organic quinoa pilaf, spiced roasted vegetables & fresh tropical fruit platter",
      price: 300,
    },
    {
      id: 4,
      name: "Junior Explorer",
      icon: "🧒",
      description: "Kid-friendly macaroni & cheese, crispy potato tots, fruit cup & chocolate cookie",
      price: 200,
    },
  ];

  const [passengerMeals, setPassengerMeals] = React.useState(
    passengers.map((passenger) => ({
      seat: passenger.seat,
      meals: passenger.meals,
    }))
  );

  function getPassengerMeals(seat) {
    const passenger = passengerMeals.find((item) => item.seat === seat);
    return passenger ? passenger.meals : [];
  }

  function updateMeal(seat, meal) {
    const currentMeals = getPassengerMeals(seat);
    const existingMeal = currentMeals.find((item) => item.id === meal.id);

    let updatedMeals;
    if (existingMeal) {
      updatedMeals = currentMeals.map((item) =>
        item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedMeals = [...currentMeals, { id: meal.id, name: meal.name, price: meal.price, quantity: 1 }];
    }

    setPassengerMeals(
      passengerMeals.map((p) => (p.seat === seat ? { seat: seat, meals: updatedMeals } : p))
    );
  }

  function removeMeal(seat, meal) {
    const currentMeals = getPassengerMeals(seat);
    const existingMeal = currentMeals.find((item) => item.id === meal.id);
    if (!existingMeal) return;

    let updatedMeals;
    if (existingMeal.quantity === 1) {
      updatedMeals = currentMeals.filter((item) => item.id !== meal.id);
    } else {
      updatedMeals = currentMeals.map((item) =>
        item.id === meal.id ? { ...item, quantity: item.quantity - 1 } : item
      );
    }

    setPassengerMeals(
      passengerMeals.map((p) => (p.seat === seat ? { seat: seat, meals: updatedMeals } : p))
    );
  }

  function getMealQuantity(seat, mealId) {
    const currentMeals = getPassengerMeals(seat);
    const selectedMeal = currentMeals.find((meal) => meal.id === mealId);
    return selectedMeal ? selectedMeal.quantity : 0;
  }

  function continueBooking() {
    passengerMeals.forEach((passenger) => {
      dispatch(
        updatePassengerMeals({
          seat: passenger.seat,
          meals: passenger.meals,
        })
      );
    });

    navigate("/flights/" + flight.id + "/luggage");
  }

  if (!flight || passengers.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center animate-fade-in-up">
        <div className="text-4xl mb-4">🍽️</div>
        <h1 className="text-xl font-bold text-white mb-2">Booking information not found</h1>
        <p className="text-sm text-slate-400 mb-6">
          Please select your flight and seats first.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full py-2.5 px-4 rounded-xl font-semibold bg-sky-500 hover:bg-sky-400 text-white transition-colors"
        >
          ← Back to Flights
        </button>
      </div>
    );
  }

  const totalMealCost = passengerMeals.reduce((acc, p) => {
    return acc + p.meals.reduce((mAcc, m) => mAcc + m.price * m.quantity, 0);
  }, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
      {/* Step Indicator */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-bold text-xs">
              ✓
            </span>
            <span>Seats</span>
          </div>
          <div className="h-0.5 flex-1 mx-2 sm:mx-4 bg-emerald-500/40"></div>

          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-bold text-xs">
              ✓
            </span>
            <span>Passengers</span>
          </div>
          <div className="h-0.5 flex-1 mx-2 sm:mx-4 bg-emerald-500/40"></div>

          <div className="flex items-center gap-2 text-sky-400">
            <span className="w-6 h-6 rounded-full bg-sky-500/20 border border-sky-400 flex items-center justify-center font-bold text-xs">
              3
            </span>
            <span>Meals</span>
          </div>
          <div className="h-0.5 flex-1 mx-2 sm:mx-4 bg-slate-800"></div>

          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs">
              4
            </span>
            <span>Luggage</span>
          </div>
          <div className="h-0.5 flex-1 mx-2 sm:mx-4 bg-slate-800"></div>

          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs">
              5
            </span>
            <span>Pass</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          In-Flight Meal Selection
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Indulge in chef-curated culinary options during your journey
        </p>
      </div>

      {/* Info notice */}
      <div className="mb-8 p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-between text-xs text-sky-300">
        <div className="flex items-center gap-2">
          <span className="text-base">ℹ️</span>
          <span>Meals are optional. You can select meals for individual passengers or continue directly.</span>
        </div>
        {totalMealCost > 0 && (
          <span className="font-semibold text-white bg-sky-500/20 px-2.5 py-1 rounded-lg">
            Total Meals: ₹{totalMealCost}
          </span>
        )}
      </div>

      {/* Per-Passenger Meal Sections */}
      <div className="space-y-8">
        {passengerMeals.map((passenger, index) => {
          const passInfo = passengers.find((p) => p.seat === passenger.seat);
          const passengerName = passInfo?.name || `Passenger ${index + 1}`;

          return (
            <div
              key={passenger.seat}
              className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">{passengerName}</h2>
                    <span className="text-xs text-slate-400">Seat {passenger.seat}</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {passenger.meals.length} item{passenger.meals.length !== 1 ? "s" : ""} chosen
                </span>
              </div>

              {/* Meals Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {meals.map((meal) => {
                  const quantity = getMealQuantity(passenger.seat, meal.id);
                  const isSelected = quantity > 0;

                  return (
                    <div
                      key={meal.id}
                      className={`flex flex-col justify-between p-4 rounded-xl border transition-all duration-200 ${
                        isSelected
                          ? "bg-sky-950/30 border-sky-500/50 shadow-lg shadow-sky-500/10"
                          : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <div className="text-3xl mb-2">{meal.icon}</div>
                        <h3 className="font-semibold text-sm text-white">{meal.name}</h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {meal.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                        <span className="font-bold text-sky-400 text-sm">
                          ₹{meal.price}
                        </span>

                        {/* Quantity Counter */}
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
                          <button
                            type="button"
                            disabled={quantity === 0}
                            onClick={() => removeMeal(passenger.seat, meal)}
                            className="w-6 h-6 rounded flex items-center justify-center text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            −
                          </button>
                          <span className="w-5 text-center text-xs font-semibold text-white">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateMeal(passenger.seat, meal)}
                            className="w-6 h-6 rounded flex items-center justify-center text-sm font-bold bg-sky-500 hover:bg-sky-400 text-white transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4">
        <button
          type="button"
          onClick={() => navigate("/flights/" + flight.id + "/passenger")}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          ← Back to Passengers
        </button>

        <button
          type="button"
          onClick={continueBooking}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-xl shadow-sky-500/25 transition-all duration-200 cursor-pointer"
        >
          Continue to Luggage →
        </button>
      </div>
    </div>
  );
}

export default MealSelection;