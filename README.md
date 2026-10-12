# ✈️ SkyBook — Flight Seat Booking & Management System

SkyBook is a modern, responsive, and full-featured airline reservation web application built with **React 19**, **Vite**, **Tailwind CSS v4**, and **Redux Toolkit**. It delivers an end-to-end flight booking journey from interactive cabin seat selection to personalized add-ons and downloadable boarding passes, paired with a dedicated administrator portal for flight operations.

---

## ✨ Features

### 🛫 User Flight Booking Workflow
- **Flight Discovery & Search**: Browse scheduled domestic and international flights with live filtering by departure city, arrival destination, or airline name.
- **Interactive Cabin Seat Map**: Visual wide-body aircraft fuselage layout (Boeing 787 with 3-4-3 seating and dual aisles). Real-time indicators for:
  - 💺 Available seats
  - 🪟 Window seats with dedicated badges
  - ⛔ Already-booked seats (disabled & crossed out)
  - 🎯 Multi-seat selection with real-time base fare computation
- **Passenger Management**: Dynamic profile forms generated per selected seat, capturing full name, email address, phone number, age, and gender with built-in input validation.
- **In-Flight Meal Selection**: Per-passenger culinary selections featuring Vegetarian Gourmet, Non-Veg Royal, Vegan Fresh, and Junior Explorer options with quantity counters.
- **Luggage Allowance & Excess Baggage**: Configurable luggage weights per passenger, showing complimentary baggage limits vs. maximum allowances, with real-time excess baggage fee calculation (₹100/kg) and overweight limit warnings.
- **Digital Boarding Passes & PDF Export**:
  - High-fidelity airline boarding pass tickets with perforated tear-off styling, barcode graphics, gate info, and passenger subtotals.
  - **One-click PDF download** powered by `html2canvas-pro` and `jsPDF`, with native support for Tailwind CSS v4's modern `oklch()` color space.
  - Built-in **Print / Save as PDF** browser fallback (`window.print()`).

---

### 🔐 Admin Flight Operations Portal
- **Protected Access**: Dedicated login gate for airline operations staff.
- **Operational KPI Analytics**: Real-time overview of total scheduled flights, booked passenger seats, and overall aircraft occupancy rates.
- **Flight Schedule Management (CRUD)**:
  - Create new flights (airline name, route, departure/arrival times, travel date, base price, total aircraft capacity, and luggage policies).
  - Edit existing schedules and fare structures.
  - Delete retired or canceled flights.
  - Persistent state saved to browser `localStorage`.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Modern UI library with Concurrent Mode & React Compiler optimization |
| **Vite 8** | High-speed frontend build tool and dev server |
| **Tailwind CSS v4** | Modern utility-first CSS styling via `@tailwindcss/vite` |
| **Redux Toolkit** | Centralized booking state management (flight, seats, passengers, add-ons) |
| **React Router v7** | Client-side routing with clean step-by-step navigation |
| **html2canvas-pro** | Canvas rendering engine with support for CSS `oklch()` color functions |
| **jsPDF** | Client-side vector and image PDF document generator |

---

## 📁 Project Structure

```text
flight-seat-booking/
├── public/                 # Static assets & favicon
├── src/
│   ├── assets/             # Images and SVG icons
│   ├── components/         # Reusable UI components
│   │   ├── FlightCard.jsx  # Glassmorphic flight card with route timeline
│   │   ├── FlightList.jsx  # Flight exploration grid with search filter
│   │   └── Navbar.jsx      # Global navigation header with portal links
│   ├── data/
│   │   └── flights.json    # Default scheduled flight fixtures
│   ├── pages/              # Application views & workflows
│   │   ├── AdminDashboard.jsx   # Admin flight schedule management & KPIs
│   │   ├── AdminLogin.jsx       # Admin authentication screen
│   │   ├── BoardingPass.jsx     # Boarding pass generator & PDF exporter
│   │   ├── FlightDetails.jsx    # Interactive aircraft seat selection map
│   │   ├── LuggageSelection.jsx # Baggage weight & fee calculator
│   │   ├── MealSelection.jsx    # In-flight meal menu & quantity selector
│   │   └── PassengerDetails.jsx # Passenger information input forms
│   ├── redux/              # Global state management
│   │   ├── bookingSlice.jsx# Redux slice for active booking workflow
│   │   ├── localStorage.jsx# Storage helpers for Redux state
│   │   └── store.jsx       # Redux store configuration
│   ├── routes/
│   │   └── AppRoutes.jsx   # Route definitions & router configuration
│   ├── utils/
│   │   └── flightStorage.jsx # LocalStorage persistence for flight inventory
│   ├── App.jsx             # Root application wrapper
│   ├── index.css           # Tailwind CSS v4 entry point & design tokens
│   └── main.jsx            # Application bootstrap with Redux Provider
├── index.html              # HTML entry point with Inter font integration
├── package.json            # Project dependencies and script commands
└── vite.config.js          # Vite config with React and Tailwind plugins
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone or open the repository:**
   ```bash
   cd "flight-seat-booking"
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to the local development URL (typically `http://localhost:5173/`).

---

## 🔑 Admin Portal Demo Credentials

To access the administrative console, click the **Admin Portal** link in the navigation header or navigate to `/admin`:

- **Email**: `admin@gmail.com`
- **Password**: `1234`

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles and bundles production assets into the `dist/` directory. |
| `npm run preview` | Locally serves the production build for smoke testing. |
| `npm run lint` | Runs ESLint across all source files to verify code quality. |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
