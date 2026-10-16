# ✈️ SkyBook — Flight Booking & Management System

SkyBook is a modern, responsive, and full-featured airline reservation web application built with **React 19**, **Vite**, **Tailwind CSS v4**, and **Redux Toolkit**. It delivers an end-to-end flight booking journey from interactive cabin seat selection to personalized add-ons and downloadable boarding passes, complete with user accounts, persistent ticket history, and an administrator operations portal.

---

## ✨ Features

### 👤 User Authentication & Profile
- **Passenger Registration (`/register`)**: Create an account with full name, email, phone number, gender, and password. Instant auto-login upon registration.
- **Passenger Sign In (`/login`)**: Secure authentication with session persistence. Includes an **Auto Fill Demo User** button for 1-click testing (`yash@example.com` / `password123`).
- **Profile & Navbar Integration**:
  - Live passenger profile badge with avatar and user initials.
  - Interactive dropdown showing name, email, phone, active booking count, and sign out.
  - Active booking counter badge in navigation bar.
- **Smart Booking Autofill**: When logged in, Passenger 1 details can be auto-filled directly from the user's profile with one click.

---

### 🎫 Anytime Ticket Access ("My Tickets" — `/my-tickets`)
- **24/7 Digital Ticket Retrieval**: All confirmed flights are permanently saved to the passenger's account.
- **Comprehensive Ticket Cards**:
  - Departure & arrival cities with flight times and dates.
  - Unique **PNR Code** with one-click copy to clipboard.
  - Reserved seat badges (`12A`, `12B`), meal and luggage summaries, and total fare paid.
  - Real-time status indicators (`CONFIRMED` or `CANCELLED`).
- **Actions on Any Ticket**:
  - 🎫 **View Full Boarding Pass**: Opens an interactive modal displaying official boarding documents and barcodes.
  - 📄 **Download PDF**: Generates and downloads high-resolution PDF boarding passes anytime.
  - 🖨️ **Print**: Quick hardcopy printing.
  - ❌ **Flight Cancellation**: Cancels the ticket with confirmation and automatically releases reserved seats in the flight inventory.
- **Instant PNR Lookup Tool**: Passengers or guests can look up any booking simply by entering their 9-character PNR code.

---

### 🛫 Flight Booking Workflow
- **Flight Discovery & Search (`/`)**: Browse scheduled domestic and international flights with live filtering by route, departure city, destination, and sort by fare or departure time.
- **Interactive Cabin Seat Map**: Visual wide-body aircraft fuselage layout (Boeing 787 with 3-4-3 seating and dual aisles).
  - 💺 Available seats
  - 🪟 Window seats with dedicated badges
  - ⛔ Already-booked seats (disabled & crossed out)
  - 🎯 Multi-seat selection with real-time base fare computation
- **Passenger Details (`/flights/:id/passenger`)**: Dynamic passenger profile cards generated per selected seat with input validation.
- **In-Flight Meal Selection (`/flights/:id/meals`)**: Gourmet culinary selections featuring Vegetarian Gourmet, Non-Veg Royal, Vegan Fresh, and Junior Explorer options with quantity counters.
- **Luggage Allowance (`/flights/:id/luggage`)**: Configurable baggage weights per passenger with complimentary limits vs. excess baggage calculation (₹100/kg).
- **Official Boarding Passes (`/flights/:id/boarding-pass`)**: High-fidelity airline boarding pass with barcode graphics, PNR confirmation, PDF download, and immediate "Save to My Tickets" integration.

---

### 🔐 Admin Flight Operations Portal (`/admin`)
- **Protected Access**: Dedicated login gate for airline operations staff (`admin@gmail.com` / `1234`).
- **Operational KPI Analytics**: Real-time overview of total scheduled flights, booked passenger seats, and overall aircraft occupancy rates.
- **Flight Schedule Management (CRUD)**:
  - Create new flights (airline, route, departure/arrival times, date, price, aircraft capacity, luggage policies).
  - Edit existing schedules and fare structures.
  - Delete flights and release aircraft capacity.

---

## 📁 Project Structure

```text
flight-seat-booking/
├── public/                     # Static assets & favicon
├── src/
│   ├── assets/                 # Brand assets & SVG graphics
│   ├── components/             # Reusable UI components
│   │   ├── FlightCard.jsx      # Interactive flight card with route timeline
│   │   ├── FlightList.jsx      # Flight list wrapper (backwards-compatible)
│   │   ├── Footer.jsx          # Complete airline footer with service links
│   │   ├── Navbar.jsx          # Header with navigation, ticket badge & user profile
│   │   └── tickets/            # Ticket-specific components
│   │       ├── BoardingPassModal.jsx # Full boarding pass popup with PDF & Print
│   │       └── TicketCard.jsx  # Rich ticket card in My Tickets view
│   ├── data/
│   │   └── flights.json        # Default flight schedules & routes
│   ├── pages/                  # Page-level route views
│   │   ├── AdminDashboard.jsx  # Admin operations & flight scheduling
│   │   ├── AdminLogin.jsx      # Admin login authentication gate
│   │   ├── BoardingPass.jsx    # Booking confirmation & immediate pass view
│   │   ├── FlightDetails.jsx   # Cabin seat selection map
│   │   ├── Home.jsx            # Flight exploration, filters & features
│   │   ├── Login.jsx           # Passenger sign in with demo autofill
│   │   ├── LuggageSelection.jsx# Baggage allowance & extra weight fees
│   │   ├── MealSelection.jsx   # In-flight gourmet meal ordering
│   │   ├── MyTickets.jsx       # 24/7 ticket view, PNR lookup & cancellation
│   │   ├── PassengerDetails.jsx# Passenger information & autofill
│   │   └── Register.jsx        # Account registration
│   ├── redux/                  # Redux Toolkit state management
│   │   ├── localStorage.js     # Storage synchronization
│   │   ├── store.js            # Combined Redux store
│   │   └── slices/             # Modular feature slices
│   │       ├── authSlice.js    # Authentication & user session state
│   │       ├── bookingSlice.js # Active booking in-flight state
│   │       └── ticketSlice.js  # Booked tickets & active ticket selection
│   ├── routes/
│   │   └── AppRoutes.jsx       # React Router v7 application route mapping
│   ├── utils/                  # Persistent data & business logic
│   │   ├── authStorage.js      # User registry & session management
│   │   ├── flightStorage.js    # Flight schedules & seat occupancy
│   │   └── ticketStorage.js    # Persistent tickets, PNR generator & cancellations
│   ├── App.css                 # Application styles
│   ├── App.jsx                 # App root component
│   ├── index.css               # Tailwind CSS v4 design tokens & utilities
│   └── main.jsx                # Application DOM entry point
├── package.json
└── vite.config.js
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Access / Notes |
| :--- | :--- | :--- | :--- |
| **Passenger User** | `yash@example.com` | `password123` | View booked tickets, boarding passes, auto-fill profile details |
| **Admin Operations** | `admin@gmail.com` | `1234` | Access Admin Dashboard to manage flights & schedules |

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the local Vite development server
npm run dev

# 3. Build for production
npm run build

# 4. Run ESLint code checks
npm run lint
```
