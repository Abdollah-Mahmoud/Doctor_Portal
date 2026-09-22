# 🏥 Doctor Portal - Patient Management System

A simple, clean, and efficient web application built with **React**, **React Router**, **Bootstrap**, **Node.js**, **Express**, and **MongoDB** designed for private doctors to manage their practice. This portal streamlines patient tracking, appointment scheduling, and record management in a user-friendly interface.

---

## 🚀 Features

### 🔐 Authentication
- **Doctor Sign Up**: Register with Doctor Name, Email, Phone Number, Doctor Category / Specialty, and Password.
- **Secure Sign In**: Simple login via Email and Password, with a 1-click **"Fill Demo Credentials"** button for quick testing.
- **Protected Routes**: Redirects verified doctors to their personalized dashboard.

### 📊 Dashboard
- **Doctor Overview**: Displays greeting with Doctor Name, Specialty badge, and live metric cards.
- **Search Patient**: Real-time lookup to quickly find patients by name or phone number with instant result preview.
- **Add Patient**: A streamlined form to register new patients into the system.
- **View Patients**: A clean, tabular view of all registered patients.
- **Add Appointment**: Create and schedule appointments linked to specific patients.
- **Upcoming Appointments**: An organized view of scheduled visits to keep track of the daily agenda with status controls.

### 👤 Patient Management
Each patient record includes comprehensive details:
- Full Name
- Age
- Phone Number
- Gender (Male / Female / Other)
- Medical History
- Clinical Notes
- Full CRUD: Add, View Details, Edit (inline & modal), and Delete patients.

### 📅 Appointments Management
- Appointment fields: Patient Name (or pick from registered patients), Date, Time, Reason / Notes, Status.
- Filter by status: *All Visits*, *Scheduled*, *Completed*, *Cancelled*.
- Inline status updating and deletion.

### 🩺 Doctor Profile
- Dedicated profile page displaying credentials, contact details, specialty, and practice security information.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), React Router DOM, Bootstrap 5, Bootstrap Icons, Axios
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, BcryptJS, CORS, Dotenv
- **Database**: MongoDB (Local or Atlas)

---

## 📁 Project Structure

```text
doctor/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Doctor registration, login, profile
│   │   ├── patientController.js  # Patient CRUD + search by name/phone
│   │   └── appointmentController.js # Appointment CRUD, upcoming visits, stats
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification middleware
│   ├── models/
│   │   ├── Doctor.js             # Doctor schema
│   │   ├── Patient.js            # Patient schema
│   │   └── Appointment.js        # Appointment schema
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── patientRoutes.js      # /api/patients routes
│   │   └── appointmentRoutes.js  # /api/appointments routes
│   ├── seed.js                   # Pre-populates realistic dummy data
│   ├── test-api.js               # Automated end-to-end API test suite
│   ├── .env.example              # Environment variables template
│   ├── package.json
│   └── server.js                 # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar with branding & doctor badge
│   │   │   ├── DashboardCards.jsx# Summary metrics cards
│   │   │   ├── SearchBar.jsx     # Reusable search bar with clear button
│   │   │   ├── PatientTable.jsx  # Reusable patients table
│   │   │   ├── AppointmentTable.jsx # Reusable appointments table
│   │   │   ├── PatientForm.jsx   # Add & edit patient form
│   │   │   ├── AppointmentForm.jsx # Schedule & edit appointment form
│   │   │   └── ProtectedRoute.jsx# Auth route guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Doctor authentication context
│   │   ├── pages/
│   │   │   ├── SignUp.jsx        # Doctor registration page
│   │   │   ├── SignIn.jsx        # Doctor login page
│   │   │   ├── Dashboard.jsx     # Homepage / Dashboard
│   │   │   ├── Patients.jsx      # All patients table + search
│   │   │   ├── AddPatient.jsx    # Add patient page
│   │   │   ├── PatientDetails.jsx# Detailed patient view & history
│   │   │   ├── Appointments.jsx  # Appointments list & filters
│   │   │   ├── AddAppointment.jsx# Schedule appointment page
│   │   │   └── Profile.jsx       # Doctor profile & specialty
│   │   ├── services/
│   │   │   ├── api.js            # Axios client with JWT interceptor
│   │   │   ├── authService.js    # Auth API methods
│   │   │   ├── patientService.js # Patient API methods
│   │   │   └── appointmentService.js # Appointment API methods
│   │   ├── App.css               # Medical styling & responsive rules
│   │   ├── App.jsx               # React Router configuration
│   │   └── main.jsx              # React app entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js** (v18+ or v20+)
- **MongoDB** running locally on port 27017 (or configured via `MONGO_URI` in `backend/.env`)

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed     # Seeds realistic dummy doctor, patients, and appointments
npm start        # Starts backend API on http://localhost:5050
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:3000
```

Open `http://localhost:3000` in your browser.

---

## 🔑 Demo Login

For instant testing, a demo doctor account is pre-seeded:
- **Email**: `dr.sarah@clinic.com`
- **Password**: `password123`
- **Doctor Name**: Dr. Sarah Jenkins, MD
- **Specialty**: Internal Medicine & Cardiology

*(You can also use the **"Fill Demo Credentials"** button on the Sign In page or create a new account via **Sign Up**.)*

---

## 🧪 Testing

Run the automated backend test suite:
```bash
cd backend
node test-api.js
```
All API tests will execute and verify authentication, patient CRUD, search queries, and appointment scheduling.
