# 🏋️ FitZone Gym & Class Booking System

> **ITUE301: Advanced Web Development Frameworks — Practical Examination (Set B)**  
> *Chandubhai S. Patel Institute of Technology (CSPIT), CHARUSAT University*  
> **Student Roll No**: `24CE089` | **Batch**: `D1`  
> **GitHub Repository**: [itue301-exam-24ce089-d1](https://github.com/Nilay-Patel-5/itue301-exam-24ce089-d1)

---

## 📌 About the Project

**FitZone** is a full-stack MERN web application built to solve gym class scheduling and trainer management challenges. It replaces informal scheduling methods with a centralized platform where members can discover trainer-led fitness classes, reserve session spots, trainers can view and manage their class rosters, and administrators have full system oversight.

The application features a modern **dark glassmorphism design system**, client-side state management, JWT authentication, and full 3-role access control.

---

## ✨ Core Features

### 👤 Member Portal
- **Browse Certified Trainers**: View trainer profiles, specializations, and real-time availability.
- **Specialization Search**: Filter trainers instantly by expertise (e.g. CrossFit, Yoga, Pilates, Weightlifting).
- **Class Reservation**: Reserve spots in trainer-led classes with customizable date and time slots.
- **Membership Tier Badges**: Visual indicator of member tier (**Platinum 👑**, **Premium ⭐**, **Basic 🏷️**).
- **My Bookings Management**: View active reservations, mark attendance, or cancel bookings.

### 🏋️ Trainer Portal
- **Dedicated Trainer Dashboard**: Personalized view for logged-in certified trainers.
- **Class Schedule Roster**: Track all member class reservations assigned to the trainer.
- **Session Attendance Tracking**: Mark member attendance or update class statuses.
- **Availability Toggle**: Real-time control to switch availability state (*Available* vs. *Unavailable*).

### 🛡️ Admin Control Panel
- **System Dashboard**: Key performance metrics (Total Members, Trainers, Total & Active Bookings).
- **Member Management**: Roster of all registered gym members with membership tiers.
- **Class Bookings Overview**: System-wide view and status management for all booked sessions.
- **Roster & Availability Control**: Manage trainer profiles and override availability statuses.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|:---|:---|
| **Frontend** | React 18, React Router DOM (v6), Lucide React (Icons), Vite (Build Tool) |
| **Backend** | Node.js, Express.js (REST API framework) |
| **Database** | MongoDB with Mongoose ODM (Schema validations & ref populate) |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs (Password Hashing) |
| **Styling** | Modern Vanilla CSS3 with HSL colors, Glassmorphism, Responsive CSS Grid & Flexbox |
| **Middleware** | Custom `requestLogger` (logging `[METHOD] [PATH] [STATUS] [TIME ms]`), `authGuard`, `adminGuard`, `trainerGuard`, Global JSON `errorHandler` |

---

## 🚀 Quick Setup & Run Instructions

### Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017/fitzone`)

### 1. Database Seeding (One-Time Setup)
```bash
cd backend
npm install
npm run seed
```

### 2. Start Backend Server
```bash
cd backend
npm start
# Express REST API will start on http://localhost:5000
```

### 3. Start Frontend Development Server
```bash
cd frontend
npm install
npm run dev
# Vite Web App will start on http://localhost:3000
```

---

## 🔑 Test Credentials

*(Password for all accounts: **`123456`**)*

### 💎 Members
- `john@fitzone.com` *(Platinum Member)*
- `jane@fitzone.com` *(Premium Member)*
- `charlie@fitzone.com` *(Basic Member)*

### 🏋️ Trainers
- `alex@fitzone.com` *(Alex Vance — CrossFit & HIIT)*
- `sarah@fitzone.com` *(Sarah Connor — Yoga & Pilates)*
- `marcus@fitzone.com` *(Marcus Brody — Weightlifting)*
- `elena@fitzone.com` *(Elena Rostova — Cardio)*

### 🛡️ Admin
- `admin@fitzone.com` *(System Admin)*

---

## 📄 License & Academic Attribution
Developed as part of the ITUE301 Advanced Web Development Frameworks course at CSPIT, CHARUSAT University.
