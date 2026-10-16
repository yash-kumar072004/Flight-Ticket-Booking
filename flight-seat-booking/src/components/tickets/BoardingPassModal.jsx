import { useState } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

function BoardingPassModal({ ticket, onClose }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  if (!ticket) return null;

  const { flight, passengers, pnr, bookingDate, totalAmount, status } = ticket;

  async function handleDownloadPDF() {
    const modalPasses = document.querySelectorAll(".modal-boarding-pass");
    if (modalPasses.length === 0) return;

    setIsDownloading(true);
    setDownloadError("");

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      for (let index = 0; index < modalPasses.length; index++) {
        const pass = modalPasses[index];
        const canvas = await html2canvas(pass, {
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

      const fileName = `boarding-pass-${pnr || "flight"}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setDownloadError("PDF download failed. You can use 'Print' instead.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in-up">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">✈️</span>
            <div>
              <h2 className="text-base font-bold text-white">Boarding Pass & Ticket</h2>
              <span className="text-xs font-mono text-sky-400">PNR: {pnr}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isDownloading}
              onClick={handleDownloadPDF}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{isDownloading ? "⏳" : "📄"}</span>
              <span>{isDownloading ? "Generating..." : "Download PDF"}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>🖨️</span>
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {downloadError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{downloadError}</span>
          </div>
        )}

        {/* Modal Body - Boarding Passes */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {passengers.map((passenger, index) => (
            <div
              key={passenger.seat}
              className="modal-boarding-pass relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 shadow-xl"
            >
              {/* Airline Header Bar */}
              <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 px-6 py-3.5 flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">✈️</span>
                  <div>
                    <span className="text-base font-bold tracking-tight">SkyBook Airlines</span>
                    <span className="block text-[9px] tracking-widest uppercase opacity-80">
                      Official Passenger Boarding Document
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      status === "CANCELLED"
                        ? "bg-rose-500/30 text-rose-200"
                        : "bg-emerald-500/30 text-emerald-200"
                    }`}
                  >
                    {status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md">
                    Passenger {index + 1}
                  </span>
                </div>
              </div>

              {/* Ticket Route Banner */}
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div>
                    <span className="text-2xl font-black text-white">{flight.departureTime}</span>
                    <p className="text-xs font-bold text-sky-400 uppercase tracking-wider mt-0.5">
                      {flight.from}
                    </p>
                  </div>

                  <div className="flex flex-col items-center px-4 flex-1">
                    <span className="text-xs text-slate-400 font-medium mb-1">{flight.name}</span>
                    <div className="w-full flex items-center gap-1 max-w-[140px]">
                      <div className="h-0.5 flex-1 bg-sky-500/40 rounded-full"></div>
                      <span className="text-sky-400 text-xs">✈</span>
                      <div className="h-0.5 flex-1 bg-sky-500/40 rounded-full"></div>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 font-mono">{flight.date}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-white">{flight.arrivalTime}</span>
                    <p className="text-xs font-bold text-sky-400 uppercase tracking-wider mt-0.5">
                      {flight.to}
                    </p>
                  </div>
                </div>

                {/* Primary Pass Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                      Passenger Name
                    </span>
                    <span className="text-sm font-bold text-white block truncate">
                      {passenger.name || "Guest"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                      Seat
                    </span>
                    <span className="text-base font-extrabold text-sky-400 block">
                      {passenger.seat}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                      PNR Code
                    </span>
                    <span className="text-sm font-mono font-bold text-amber-400 block">{pnr}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                      Gate
                    </span>
                    <span className="text-sm font-bold text-white block">G-04 (T2)</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                      Age / Gender
                    </span>
                    <span className="text-xs text-slate-300 block">
                      {passenger.age ? `${passenger.age} yrs • ` : ""}{passenger.gender || "-"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                      Contact
                    </span>
                    <span className="text-xs text-slate-300 block truncate">
                      {passenger.phone || "-"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                      Meals
                    </span>
                    <span className="text-xs text-slate-300 block">
                      {passenger.meals?.length > 0
                        ? passenger.meals.map((m) => m.name).join(", ")
                        : "None"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                      Luggage
                    </span>
                    <span className="text-xs text-slate-300 block">
                      {passenger.luggage?.weight || flight.luggage?.includedWeight || 15} kg
                    </span>
                  </div>
                </div>

                {/* Perforation line */}
                <div className="relative py-1">
                  <div className="border-t-2 border-dashed border-slate-800"></div>
                </div>

                {/* Barcode representation */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-white p-2 rounded-lg">
                    {[4, 2, 5, 3, 2, 6, 2, 4, 3, 5, 2, 6, 3, 4, 2, 5, 2, 6].map((w, i) => (
                      <div
                        key={i}
                        className="h-7 bg-black rounded-[0.5px]"
                        style={{ width: `${w}px` }}
                      ></div>
                    ))}
                    <span className="text-[9px] font-mono font-bold text-black ml-2 tracking-wider">
                      {pnr}-{passenger.seat}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400">
                    Booked on: {new Date(bookingDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Total Ticket Price:</span>
            <span className="text-xl font-bold text-amber-400 ml-2">
              ₹{totalAmount?.toLocaleString("en-IN")}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default BoardingPassModal;
