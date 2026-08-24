# FitZone Gym & Class Booking System

**Course**: ITUE301 – Advanced Web Development Frameworks  
**Examination**: Open-Book Practical Examination | B.Tech. Semester 5 | AY 2026–27  
**Institution**: Chandubhai S. Patel Institute of Technology (CSPIT), CHARUSAT  
**Department**: Information Technology / Computer Engineering  
**Exam Set**: Set B – FitZone Gym & Class Booking System  
**Repository Name**: `itue301-exam-24ce089-d1`  

---

## 📋 Executive Summary & Scenario

FitZone Gym previously managed class bookings informally via a WhatsApp group, leading to frequent double-bookings, unorganized schedules, and member no-shows. 

This repository contains a full-stack, enterprise-grade **MERN (MongoDB, Express.js, React, Node.js)** booking system where:
- **Members** reserve trainer-led fitness classes and manage their active bookings.
- **Trainers** display real-time availability and specialization details.
- **Administrators** monitor system statistics and manage gym rosters.

---

## 🏗️ System Architecture & Folder Layout

```
FitZone Project Root
├── backend/
│   ├── config/
│   │   └── db.js                 # Mongoose database connection establishing MongoDB link
│   ├── controllers/
│   │   ├── authController.js     # Member login & JWT generation
│   │   ├── bookingController.js  # Class booking creation, user bookings fetch with populate, status update
│   │   └── trainerController.js  # Public trainer listing controller
│   ├── middleware/
│   │   ├── authGuard.js          # JWT Bearer token authentication & member context attachment
│   │   ├── errorHandler.js       # Global error middleware handling Mongoose ValidationError cleanly
│   │   └── requestLogger.js      # Global logger tracking [METHOD] [PATH] [STATUS] [RESPONSE-TIME ms]
│   ├── models/
│   │   ├── ClassBooking.js       # Mongoose schema referencing Member and Trainer models
│   │   ├── Member.js             # Mongoose schema for gym members with enum validations
│   │   └── Trainer.js            # Mongoose schema for fitness trainers
│   ├── routes/
│   │   └── api.js                # REST API router endpoints under /api/v1/
│   ├── .env                      # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── package.json              # Backend dependencies & run scripts
│   ├── seed.js                   # Automated database populator script
│   └── server.js                 # Express server entry point (node server.js / npm start)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.jsx    # React Router navigation header with active link states
│   │   │   ├── ProtectedRoute.jsx# Auth wrapper redirecting unauthenticated users to /
│   │   │   └── TrainerCard.jsx   # Reusable component with availability object map styling
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Context holding { member, token, role, login, logout }
│   │   ├── pages/
│   │   │   ├── AdminPanel.jsx    # Lazy-loaded route with React.lazy + Suspense
│   │   │   ├── ClassesPage.jsx   # Trainer cards, search filter, and booking form state
│   │   │   ├── LoginPage.jsx     # Member authentication page with quick demo login
│   │   │   └── MyBookingsPage.jsx# Logged-in member's populated class reservations
│   │   ├── App.jsx               # Client routes & React.lazy Suspense configuration
│   │   ├── index.css             # Modern dark glassmorphism aesthetic styling
│   │   └── main.jsx              # React DOM mounting entry point
│   ├── index.html                # Main HTML template with Google Fonts
│   ├── package.json              # Frontend dependencies & Vite scripts
│   └── vite.config.js            # Vite configuration with API backend proxy
│
└── README.md                     # Comprehensive project documentation
```

---

## ✨ Task-by-Task Implementation Details

### Task 1: React Component Architecture
- **Reusable `TrainerCard` Component** (`/frontend/src/components/TrainerCard.jsx`):
  - Accepts props: `name`, `specialization`, `available`.
  - Uses an object lookup map for availability status labels and dynamic CSS styling:
    ```javascript
    const availabilityMap = { true: 'Available', false: 'Fully Booked' };
    const availabilityClassMap = { true: 'status-badge available', false: 'status-badge fully-booked' };
    ```
- **Page Composition**: Modular division into `LoginPage`, `ClassesPage`, `MyBookingsPage`, and `AdminPanel`.

### Task 2: React Routing and State Management
- **React Router Configuration**:
  - `/` → `LoginPage`
  - `/classes` → `ClassesPage` (protected)
  - `/my-bookings` → `MyBookingsPage` (protected)
  - `/admin` → `AdminPanel` (protected & lazy-loaded using `React.lazy()` + `Suspense`)
- **Global `AuthContext`**:
  - Exposes context value: `value={{ member, token, role, login, logout }}`.
  - Persists authentication state in `localStorage`.
  - `ProtectedRoute` wrapper automatically redirects unauthenticated users to `/`.
- **Interactive Form State**:
  - `ClassesPage` manages booking form inputs (`selectedTrainer`, `className`, `bookingDate`, `selectedTimeSlot`) via `useState`.
  - Renders live state changes dynamically on screen before submission.

### Task 3: Express REST API + Middleware
- **Endpoints Structure** (`/api/v1`):
  - `POST /api/v1/auth/login` – Member login & token issuance.
  - `GET /api/v1/trainers` – Public trainer directory.
  - `POST /api/v1/bookings` – Create class booking (Protected).
  - `GET /api/v1/bookings/my` – Retrieve logged-in member bookings (Protected).
  - `PATCH /api/v1/bookings/:id/status` – Update booking status (Protected).
- **Custom Middlewares**:
  - `requestLogger`: Measures response duration using `res.on('finish')` and logs `[METHOD] [PATH] [STATUS] [RESPONSE-TIME ms]`.
  - `authGuard`: Extracts Bearer token, verifies JWT, and attaches `req.member`.
  - `errorHandler`: Global error handling middleware returning structured JSON responses with appropriate HTTP status codes (200, 201, 400, 401, 500).

### Task 4: REST API Consumption in React
- **Data Fetching**: `ClassesPage` retrieves trainers from `GET /api/v1/trainers` via `fetch()` inside `useEffect()`.
- **State Management**: Maintains 3 explicit states: `trainers`, `loading`, and `error`.
- **Client-Side Real-Time Search**: Filters the pre-fetched trainers list by specialization using `.filter()` at render time without triggering redundant network requests.

### Task 5: MongoDB + Mongoose Schema Design & Validation
- **Database Connection**: Establishes link via `process.env.MONGO_URI`.
- **Mongoose Schemas & Schema-Level Validation**:
  - `Member`: `name` (required), `email` (required, unique), `membershipType` (enum: `basic`, `premium`, `platinum`, default `basic`), `password` (required).
  - `Trainer`: `name` (required), `specialization` (required), `available` (Boolean, default `true`).
  - `ClassBooking`: `memberId` (ref `Member`), `trainerId` (ref `Trainer`), `className` (required), `date` (required), `timeSlot` (required), `status` (enum: `booked`, `attended`, `cancelled`, default `booked`).
- **Mongoose Population**: `GET /api/v1/bookings/my` executes `.populate('memberId', 'name email')` and `.populate('trainerId', 'name specialization')`.
- **Clean Validation Error Response**: `errorHandler` catches `ValidationError` and transforms Mongoose `err.errors` into user-friendly JSON error messages.

---

## 🛠️ REST API Specification Table

| Method | Endpoint | Protection | Description | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Public | Authenticates member and returns JWT token | `200 OK` / `401 Unauthorized` |
| `GET` | `/api/v1/trainers` | Public | Returns array of all gym trainers | `200 OK` |
| `POST` | `/api/v1/bookings` | Protected | Creates a new class booking | `201 Created` / `400 Bad Request` |
| `GET` | `/api/v1/bookings/my` | Protected | Returns member's bookings with populated refs | `200 OK` / `401 Unauthorized` |
| `PATCH` | `/api/v1/bookings/:id/status` | Protected | Updates status (`booked`, `attended`, `cancelled`) | `200 OK` / `400 Bad Request` |

---

## 🚀 Step-by-Step Installation & Running Guide

### 1. Environment Configuration (`.env`)

Backend configuration file located at `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fitzone
JWT_SECRET=fitzone_secret_key_2026
```

### 2. Backend Server Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Seed MongoDB database with initial Members, Trainers, and Sample Booking
npm run seed

# Start Express server (Entrypoint: server.js)
npm start
```
*Backend server will start running at `http://localhost:5000`.*

### 3. Frontend Client Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
*Frontend application will be accessible at `http://localhost:3000`.*

---

## 🔐 Test User Credentials

For testing during evaluation or viva, use the following pre-configured credentials:

| Role | Email | Password | Membership |
| :--- | :--- | :--- | :--- |
| **Member** | `john@fitzone.com` | `123456` | Platinum |
| **Member** | `jane@fitzone.com` | `123456` | Premium |
| **Admin** | `admin@fitzone.com` | `123456` | Platinum (Admin) |

*(Note: The login screen also features Quick Demo buttons for instant 1-click login).*

---

## 📝 Verification Checklist

- [x] React frontend with 3 distinct pages (`LoginPage`, `ClassesPage`, `MyBookingsPage`).
- [x] Reusable `TrainerCard` component with availability conditional styling.
- [x] Client-side routing with protected routes (`ProtectedRoute`).
- [x] Lazy-loaded `/admin` panel using `React.lazy` + `Suspense`.
- [x] Global `AuthContext` handling login, logout, and token persistence.
- [x] Express backend exposing 5 REST endpoints under `/api/v1/`.
- [x] Global `requestLogger` tracking method, path, status, and response time.
- [x] `authGuard` middleware protecting authorized routes.
- [x] Global `errorHandler` middleware returning structured JSON responses.
- [x] Mongoose schemas with validations, references, and `.populate()`.
- [x] Real-time client-side search filtering trainers by specialization.
- [x] Complete documentation & seed script.
