<!--
╔══════════════════════════════════════════════════════════════════════╗
║                     🤖  AGENT INSTRUCTIONS                          ║
╠══════════════════════════════════════════════════════════════════════╣
║  FIRST STEP: Always read this file before doing ANY work.           ║
║  DO NOT scan or list project directories.                           ║
║  DO NOT open individual files unless editing them.                  ║
║  This file IS the full project context — trust it completely.       ║
║                                                                      ║
║  After every change made to the project:                             ║
║  1. Update the 📋 Change Log table with the new entry.              ║
║  2. Update any affected section (architecture, flows, deps, etc.).  ║
║  3. Commit using professional Conventional Commits format.          ║
╚══════════════════════════════════════════════════════════════════════╝
-->

# 🧠 Project Brain — FitZone Gym & Class Booking System

> **This file is the single source of truth for the project.**  
> It must be updated after every significant change, fix, or addition.

---

## 📌 Project Identity

| Field | Value |
|:---|:---|
| **Project Name** | FitZone Gym & Class Booking System |
| **Exam** | ITUE301 — Advanced Web Frameworks, Open-Book Practical (Set B) |
| **Institution** | CSPIT, CHARUSAT University |
| **Roll Number** | 24CE089 |
| **Batch** | D1 |
| **Repository** | [itue301-exam-24ce089-d1](https://github.com/Nilay-Patel-5/itue301-exam-24ce089-d1) |
| **Tech Stack** | MongoDB · Express.js · React (Vite) · Node.js (MERN) |
| **Status** | ✅ Running & Connected to GitHub |

---

## 🏗️ Project Architecture

```
Internal_Practicals/
│
├── backend/                        Express.js REST API Server
│   ├── config/
│   │   └── db.js                   Mongoose connection (MONGO_URI from .env)
│   ├── controllers/
│   │   ├── authController.js       POST /api/v1/auth/login → JWT issuance
│   │   ├── bookingController.js    POST/GET/PATCH /api/v1/bookings
│   │   └── trainerController.js    GET /api/v1/trainers
│   ├── middleware/
│   │   ├── authGuard.js            Bearer JWT auth → attaches req.member
│   │   ├── errorHandler.js         Global JSON error formatter (last middleware)
│   │   └── requestLogger.js        Logs [METHOD] [PATH] [STATUS] [TIME ms]
│   ├── models/
│   │   ├── ClassBooking.js         Schema: memberId(ref), trainerId(ref), className, date, timeSlot, status
│   │   ├── Member.js               Schema: name, email(unique), phone, password, role, membershipType
│   │   └── Trainer.js              Schema: name, specialization, available(bool)
│   ├── routes/
│   │   └── api.js                  All /api/v1/ route definitions
│   ├── .env                        PORT=5000, MONGO_URI, JWT_SECRET (not committed)
│   ├── package.json                Dependencies: express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv
│   ├── seed.js                     Populates DB with demo members, trainers, and sample booking
│   └── server.js                   Entry point — starts on PORT 5000
│
├── frontend/                       React + Vite Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.jsx      Sticky navbar with React Router Links, user badge, logout
│   │   │   ├── ProtectedRoute.jsx  Redirects unauthenticated users to /
│   │   │   └── TrainerCard.jsx     Reusable card with availability object map styling
│   │   ├── context/
│   │   │   └── AuthContext.jsx     Global auth state: { member, token, role, login(), logout() }
│   │   ├── pages/
│   │   │   ├── AdminPanel.jsx      Lazy-loaded via React.lazy + Suspense (route: /admin)
│   │   │   ├── ClassesPage.jsx     Trainer fetch, specialization search, booking form
│   │   │   ├── LoginPage.jsx       Login form + quick demo fill buttons
│   │   │   └── MyBookingsPage.jsx  Member's bookings with status update controls
│   │   ├── App.jsx                 Router config, React.lazy, Suspense, ProtectedRoute
│   │   ├── index.css               Dark modern glassmorphism theme, CSS variables, animations
│   │   └── main.jsx                ReactDOM.createRoot entry point
│   ├── index.html                  HTML template with Google Fonts (Outfit + Plus Jakarta Sans)
│   ├── package.json                Scripts: dev=npx vite, build, preview
│   └── vite.config.js              Vite + @vitejs/plugin-react, port 3000, proxy /api → :5000
│
├── .gitignore                      Excludes: node_modules/, .env, dist/, build/, OS files
├── B.pdf                           Original exam question paper (Set B)
├── brain.md                        ← THIS FILE — live project knowledge base
└── README.md                       Professional project documentation & setup guide
```

---

## 🔁 Application Flows

### 1. Authentication Flow
```
User submits email + password on LoginPage
  → POST /api/v1/auth/login
  → authController: Member.findOne({ email }) → bcrypt.compare(password, hash)
  → Returns: { token (JWT), member: { id, name, email, membershipType, role } }
  → Frontend: AuthContext.login(member, token) → stored in localStorage
  → Navigate to /classes
```

### 2. Protected Route Flow
```
User navigates to /classes, /my-bookings, or /admin
  → ProtectedRoute checks AuthContext for token
  → If token missing → Navigate to / (LoginPage)
  → If token present → render the requested page
```

### 3. Trainer Listing & Search Flow
```
ClassesPage mounts
  → useEffect() fires → GET /api/v1/trainers (public, no auth)
  → Sets: trainers[], loading, error states
  → Renders TrainerCard for each trainer
  → Search input onChange → .filter() on trainers by specialization (client-side, no API call)
```

### 4. Class Booking Flow
```
Member fills booking form (trainer, className, date, timeSlot)
  → Submits → POST /api/v1/bookings
  → authGuard validates Bearer token → attaches req.member
  → bookingController: ClassBooking.create({ memberId, trainerId, className, date, timeSlot })
  → Returns 201 with populated booking data
  → Frontend: shows success alert
```

### 5. My Bookings Flow
```
MyBookingsPage mounts
  → GET /api/v1/bookings/my (Authorization: Bearer <token>)
  → authGuard validates token
  → bookingController: ClassBooking.find({ memberId: req.member._id })
      .populate('memberId', 'name email')
      .populate('trainerId', 'name specialization')
  → Returns populated bookings array
  → Member can: Mark Attended (PATCH status=attended) or Cancel (PATCH status=cancelled)
```

### 6. Admin Panel Lazy Load Flow
```
User navigates to /admin
  → React Router matches /admin route in App.jsx
  → React.lazy() dynamically imports AdminPanel.jsx as a separate JS chunk
  → Suspense shows fallback spinner while chunk downloads
  → AdminPanel renders after chunk is loaded
```

### 7. Request Logging Flow
```
Any HTTP request hits the Express server
  → requestLogger middleware fires
  → Records start = Date.now()
  → res.on('finish') fires after response is sent
  → Logs: [METHOD] [originalUrl] [statusCode] [Date.now()-start ms]
```

### 8. Error Handling Flow
```
Any controller calls next(error)
  → errorHandler (last middleware) catches it
  → Checks err.name:
      'ValidationError' → 400, maps Object.values(err.errors) → [messages]
      Code 11000       → 400, duplicate field message
      'CastError'      → 400, invalid ObjectId
      'JsonWebToken'   → 401, invalid token
      default          → 500, internal server error
  → Returns: { success: false, message, errors: [...] }
```

---

## 🗃️ MongoDB Schema Reference

### Member Schema
| Field | Type | Rules |
|:---|:---|:---|
| `name` | String | required |
| `email` | String | required, unique, lowercase |
| `phone` | String | default: '' |
| `password` | String | required (bcrypt hashed) |
| `role` | String | enum: [member, admin], default: member |
| `membershipType` | String | enum: [basic, premium, platinum], default: basic |

### Trainer Schema
| Field | Type | Rules |
|:---|:---|:---|
| `name` | String | required |
| `specialization` | String | required |
| `available` | Boolean | default: true |

### ClassBooking Schema
| Field | Type | Rules |
|:---|:---|:---|
| `memberId` | ObjectId | ref: Member, required |
| `trainerId` | ObjectId | ref: Trainer, required |
| `className` | String | required |
| `date` | String | required |
| `timeSlot` | String | required |
| `status` | String | enum: [booked, attended, cancelled], default: booked |

---

## 🌐 REST API Reference

| Method | Endpoint | Auth | Description | Response |
|:---|:---|:---|:---|:---|
| POST | `/api/v1/auth/login` | Public | Member login + JWT | `200 { token, member }` |
| GET | `/api/v1/trainers` | Public | List all trainers | `200 { count, data[] }` |
| POST | `/api/v1/bookings` | 🔒 Bearer | Create class booking | `201 { data: populatedBooking }` |
| GET | `/api/v1/bookings/my` | 🔒 Bearer | Get member's bookings | `200 { count, data[] }` |
| PATCH | `/api/v1/bookings/:id/status` | 🔒 Bearer | Update booking status | `200 { data: updatedBooking }` |

---

## 🔑 Demo Credentials (Seeded via `npm run seed`)

| Role | Email | Password | Membership |
|:---|:---|:---|:---|
| Member | `john@fitzone.com` | `123456` | Platinum |
| Member | `jane@fitzone.com` | `123456` | Premium |
| Admin | `admin@fitzone.com` | `123456` | Platinum |

---

## 🚀 Run Commands

```bash
# Backend (Terminal 1)
cd backend
npm start              # Starts Express server on http://localhost:5000

# Frontend (Terminal 2)
cd frontend
npm run dev            # Starts Vite dev server on http://localhost:3000

# Database Seeding (one-time)
cd backend
npm run seed           # Clears & repopulates MongoDB with demo data
```

---

## 📦 Dependency Reference

### Backend (`/backend/package.json`)
| Package | Purpose |
|:---|:---|
| `express` | HTTP server & routing framework |
| `mongoose` | MongoDB ODM with schema validation |
| `bcryptjs` | Password hashing and comparison |
| `jsonwebtoken` | JWT signing and verification |
| `cors` | Cross-Origin Resource Sharing |
| `dotenv` | Environment variable loader |

### Frontend (`/frontend/package.json`)
| Package | Purpose |
|:---|:---|
| `react` + `react-dom` | Core React library |
| `react-router-dom` | Client-side SPA routing |
| `lucide-react` | Icon set (SVG-based) |
| `vite` | Frontend build tool & dev server |
| `@vitejs/plugin-react` | Vite plugin for JSX transform |

---

## 📋 Change Log

| Date | Type | Description |
|:---|:---|:---|
| 2026-08-24 | `feat` | Initial full-stack MERN application scaffolded from exam PDF (Set B) |
| 2026-08-24 | `feat` | Mongoose schemas: Member, Trainer, ClassBooking with validations |
| 2026-08-24 | `feat` | Express REST API: 5 endpoints under `/api/v1/` |
| 2026-08-24 | `feat` | Custom middleware: requestLogger, authGuard, errorHandler |
| 2026-08-24 | `feat` | React frontend: AuthContext, ProtectedRoute, Navigation, TrainerCard |
| 2026-08-24 | `feat` | Pages: LoginPage, ClassesPage, MyBookingsPage, AdminPanel (lazy-loaded) |
| 2026-08-24 | `chore` | MongoDB seeded with 3 members, 4 trainers, 1 sample booking |
| 2026-08-24 | `style` | Dark modern glassmorphism theme applied via index.css |
| 2026-08-24 | `fix` | CSS warning resolved: added standard `background-clip` + `color: transparent` |
| 2026-08-24 | `fix` | Frontend vite EBUSY error: deleted corrupted node_modules, clean reinstall + `npm approve-scripts esbuild` |
| 2026-08-24 | `chore` | Git repository initialized, `.gitignore` created, connected to GitHub remote |
| 2026-08-24 | `chore` | Initial push to [github.com/Nilay-Patel-5/itue301-exam-24ce089-d1](https://github.com/Nilay-Patel-5/itue301-exam-24ce089-d1) |
| 2026-08-24 | `docs` | Professional README.md with API table, schema reference, setup guide |
| 2026-08-24 | `docs(brain)` | Agent instructions block added to brain.md for context-first workflow |
| 2026-08-24 | `fix(LoginPage)` | Removed Quick Demo Auto-Fill Credentials buttons and `handleQuickLogin` function |
| 2026-08-24 | `fix(server)` | Explicitly configured CORS to allow `localhost:3000` — fixes login from frontend |
| 2026-08-24 | `fix(vite)` | Added `secure:false` and `rewrite` to Vite proxy config to ensure `/api` routes forward correctly |

---

## ⚠️ Known Notes & Gotchas

- **`.env` is NOT committed** — must be recreated manually after cloning. Values: `PORT=5000`, `MONGO_URI=mongodb://127.0.0.1:27017/fitzone`, `JWT_SECRET=fitzone_secret_key_2026`
- **esbuild on Windows**: Requires `npm approve-scripts esbuild` after a clean `npm install` due to npm security policy on newer versions.
- **Vite proxy**: API calls from frontend use `/api/v1/...` — Vite forwards these to `http://localhost:5000` via `vite.config.js` proxy. This avoids CORS issues in development.
- **React.lazy requires default export**: `AdminPanel.jsx` must use `export default` (not named export) for `React.lazy()` to work correctly.
- **populate() requires refs**: `ClassBooking.memberId` and `ClassBooking.trainerId` must be saved as `ObjectId` values — not strings — for `.populate()` to resolve correctly.
