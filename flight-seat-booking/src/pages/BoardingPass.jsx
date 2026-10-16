import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { resetBooking } from "../redux/slices/bookingSlice.js";
import { bookSeats } from "../utils/flightStorage.js";
import { createTicket } from "../utils/ticketStorage.js";

function BoardingPass() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const flight = useSelector((state) => state.booking.flight);
  const selectedSeats = useSelector((state) => state.booking.selectedSeats);
  const passengers = useSelector((state) => state.booking.passengers);
  const currentUser = useSelector((state) => state.auth?.user);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [pnr] = useState(() => "SKY" + Math.floor(100000 + Math.random() * 900000));
  const hasSavedRef = useRef(false);

  function calculateMealCost(meals) {
    let total = 0;
    meals.forEach((meal) => {
      total += meal.price * meal.quantity;
    });
    return total;
  }

  function calculateTotal(passenger) {
    const mealCost = calculateMealCost(passenger.meals);
    const luggageCost = passenger.luggage.cost;
    return flight ? flight.price + mealCost + luggageCost : 0;
  }

  const overallTotal = passengers.reduce((sum, p) => sum + calculateTotal(p), 0);

  useEffect(() => {
    if (flight && selectedSeats.length > 0 && !hasSavedRef.current) {
      hasSavedRef.current = true;
      bookSeats(flight.id, selectedSeats);

      createTicket({
        pnr: pnr,
        userId: currentUser?.id || "guest",
        userEmail: currentUser?.email || passengers[0]?.email || "",
        flight: flight,
        passengers: passengers,
        totalAmount: overallTotal,
      });
    }
  }, [flight, selectedSeats, currentUser, passengers, overallTotal, pnr]);

  async function downloadPDF() {
    const boardingPasses = document.querySelectorAll(".boarding-pass");
    if (boardingPasses.length === 0) return;

    setIsDownloading(true);
    setDownloadError("");

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      for (let index = 0; index < boardingPasses.length; index++) {
        const boardingPass = boardingPasses[index];

        const canvas = await html2canvas(boardingPass, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#090d16",
          logging: false,
        });

        const imageData = canvas.toDataURL("image/png");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let imageWidth = pageWidth - 20;
        let imageHeight = (canvas.height * imageWidth) / canvas.width;

        if (imageHeight > pageHeight - 20) {
          imageHeight = pageHeight - 20;
          imageWidth = (canvas.width * imageHeight) / canvas.height;
        }

        const x = (pageWidth - imageWidth) / 2;
        const y = 10;

        if (index > 0) {
          pdf.addPage();
        }

        pdf.addImage(imageData, "PNG", x, y, imageWidth, imageHeight);
      }

      const fileName =
        "boarding-passes-" +
        (flight?.name ? flight.name.replace(/[^a-zA-Z0-9]/g, "-") : "flight") +
        ".pdf";

      pdf.save(fileName);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      setDownloadError(
        "PDF generation encountered an issue. You can click 'Print / Save as PDF' below as an alternative."
      );
    } finally {
      setIsDownloading(false);
    }
  }

  function goHome() {
    dispatch(resetBooking());
    navigate("/");
  }

  if (!flight || passengers.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center animate-fade-in-up">
        <div className="text-4xl mb-4">🎫</div>
        <h1 className="text-xl font-bold text-white mb-2">Boarding pass not found</h1>
        <p className="text-sm text-slate-400 mb-6">
          Please select your flight and complete the booking process.
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
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

          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-bold text-xs">
              ✓
            </span>
            <span>Meals</span>
          </div>
          <div className="h-0.5 flex-1 mx-2 sm:mx-4 bg-emerald-500/40"></div>

          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-bold text-xs">
              ✓
            </span>
            <span>Luggage</span>
          </div>
          <div className="h-0.5 flex-1 mx-2 sm:mx-4 bg-emerald-500/40"></div>

          <div className="flex items-center gap-2 text-sky-400">
            <span className="w-6 h-6 rounded-full bg-sky-500/20 border border-sky-400 flex items-center justify-center font-bold text-xs">
              5
            </span>
            <span>Pass</span>
          </div>
        </div>
      </div>

      {/* Confirmation Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          ✓ Booking Confirmed & Seats Reserved • PNR: <span className="font-mono text-amber-300 font-bold">{pnr}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Official Boarding Passes
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Present your digital pass or download the PDF version for airport check-in.
        </p>
        <p className="text-xs text-sky-400 mt-1 font-medium">
          ✓ Automatically saved to your account! You can retrieve this ticket anytime under <strong>My Tickets</strong>.
        </p>
      </div>

      {/* List of Boarding Passes */}
      <div className="space-y-8">
        {passengers.map((passenger, index) => {
          const mealCost = calculateMealCost(passenger.meals);
          const luggageCost = passenger.luggage.cost;
          const passengerTotal = calculateTotal(passenger);

          return (
            /* Note: .boarding-pass class is strictly required for html2canvas querySelector */
            <div
              key={passenger.seat}
              className="boarding-pass relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl transition-all"
            >
              {/* Airline Header Bar */}
              <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 px-6 sm:px-8 py-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✈️</span>
                  <div>
                    <span className="text-lg font-bold tracking-tight">SkyBook Airlines</span>
                    <span className="block text-[10px] tracking-widest uppercase opacity-80">
                      Official Passenger Boarding Document
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
                    Passenger {index + 1}
                  </span>
                </div>
              </div>

              {/* Main Ticket Body */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Flight Route banner */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">
                      {flight.departureTime}
                    </span>
                    <p className="text-xs font-bold text-sky-400 uppercase tracking-wider mt-0.5">
                      {flight.from}
                    </p>
                  </div>

                  <div className="flex flex-col items-center px-4 flex-1">
                    <span className="text-xs text-slate-400 font-medium mb-1">
                      {flight.name}
                    </span>
                    <div className="w-full flex items-center gap-1 max-w-[160px]">
                      <div className="h-0.5 flex-1 bg-sky-500/40 rounded-full"></div>
                      <span className="text-sky-400 text-sm">✈</span>
                      <div className="h-0.5 flex-1 bg-sky-500/40 rounded-full"></div>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 font-mono">{flight.date}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">
                      {flight.arrivalTime}
                    </span>
                    <p className="text-xs font-bold text-sky-400 uppercase tracking-wider mt-0.5">
                      {flight.to}
                    </p>
                  </div>
                </div>

                {/* Primary Pass Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-0.5">
                      Passenger
                    </span>
                    <span className="text-sm font-bold text-white block truncate">
                      {passenger.name || "Guest"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-0.5">
                      Seat Number
                    </span>
                    <span className="text-base font-extrabold text-sky-400 block">
                      {passenger.seat}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-0.5">
                      Gate
                    </span>
                    <span className="text-sm font-bold text-white block">
                      G-04 (Terminal 2)
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-0.5">
                      Boarding Time
                    </span>
                    <span className="text-sm font-bold text-amber-400 block">
                      30 mins prior
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-0.5">
                      Age / Gender
                    </span>
                    <span className="text-xs font-medium text-slate-300 block">
                      {passenger.age} yrs • {passenger.gender}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-0.5">
                      Contact
                    </span>
                    <span className="text-xs font-medium text-slate-300 block truncate">
                      {passenger.phone}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-0.5">
                      Email
                    </span>
                    <span className="text-xs font-medium text-slate-300 block truncate">
                      {passenger.email}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-0.5">
                      Status
                    </span>
                    <span className="text-xs font-bold text-emerald-400 block">
                      CONFIRMED
                    </span>
                  </div>
                </div>

                {/* Add-ons Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Meals */}
                  <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
                    <span className="font-semibold text-slate-300 block mb-2">🍽️ Meals</span>
                    {passenger.meals.length === 0 ? (
                      <span className="text-slate-500 italic">No meals selected</span>
                    ) : (
                      <div className="space-y-1">
                        {passenger.meals.map((meal) => (
                          <div key={meal.id} className="flex justify-between text-slate-300">
                            <span>{meal.name} × {meal.quantity}</span>
                            <span className="font-semibold text-slate-200">₹{meal.price * meal.quantity}</span>
                          </div>
                        ))}
                        <div className="pt-1.5 border-t border-slate-800 flex justify-between font-semibold text-sky-400">
                          <span>Meal Total:</span>
                          <span>₹{mealCost}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Luggage */}
                  <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
                    <span className="font-semibold text-slate-300 block mb-2">🧳 Luggage</span>
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-300">
                        <span>Declared Weight:</span>
                        <span className="font-semibold text-slate-200">{passenger.luggage.weight} kg</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Complimentary:</span>
                        <span className="text-emerald-400">{flight.luggage.includedWeight} kg</span>
                      </div>
                      <div className="pt-1.5 border-t border-slate-800 flex justify-between font-semibold text-sky-400">
                        <span>Luggage Fee:</span>
                        <span>₹{luggageCost}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tear-off Perforation Divider */}
                <div className="relative py-2">
                  <div className="border-t-2 border-dashed border-slate-700"></div>
                  <div className="absolute -left-10 top-0 w-6 h-6 rounded-full bg-[#080c15]"></div>
                  <div className="absolute -right-10 top-0 w-6 h-6 rounded-full bg-[#080c15]"></div>
                </div>

                {/* Bottom Bar: Barcode aesthetic & Total */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Visual Barcode */}
                  <div className="flex items-center gap-1.5 bg-white p-2.5 rounded-lg">
                    {[4, 2, 6, 3, 2, 5, 2, 7, 3, 4, 2, 8, 3, 5, 2, 4, 6, 2, 5].map((w, i) => (
                      <div
                        key={i}
                        className="h-9 bg-black rounded-[0.5px]"
                        style={{ width: `${w}px` }}
                      ></div>
                    ))}
                    <span className="text-[10px] font-mono font-bold text-black ml-2 tracking-widest">
                      {pnr}-{passenger.seat}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Passenger Subtotal</span>
                    <span className="text-xl font-extrabold text-white">
                      ₹{passengerTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Grand Total & Action Bar */}
      <div className="mt-8 p-6 rounded-3xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Grand Total Paid
          </span>
          <div className="text-3xl font-black text-amber-400">
            ₹{overallTotal.toLocaleString("en-IN")}
            <span className="text-xs text-slate-400 font-normal ml-2">
              (All taxes & fees included)
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => navigate("/my-tickets")}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-xl shadow-sky-500/25 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🎫</span>
            <span>View in My Tickets</span>
          </button>

          <button
            type="button"
            disabled={isDownloading}
            onClick={downloadPDF}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-xl shadow-amber-500/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            {isDownloading ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <span>📄</span>
                <span>Download PDF</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto px-4 py-3.5 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🖨️</span>
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={goHome}
            className="w-full sm:w-auto px-4 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            ✈ New Booking
          </button>
        </div>
      </div>

      {downloadError && (
        <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>{downloadError}</span>
        </div>
      )}
    </div>
  );
}

export default BoardingPass;