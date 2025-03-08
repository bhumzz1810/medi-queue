# Medi-Queue

## 🚀 Project Overview
Medi-Queue is a web-based solution to reduce long wait times in hospitals and clinics. It enables patients to book appointments, track queue status in real-time, and receive updates through WebSockets. Clinics can efficiently manage their schedules, reducing waiting room congestion.

## 🌟 Features
- **Patient Registration & Login** (JWT Authentication)
- **Admin & Clinic Dashboards** (Role-based Access)
- **Live Queue Tracking** (Real-time updates with WebSockets)
- **Doctor & Appointment Management**
- **Secure Data Handling** (Password Hashing, JWT-based Auth, CORS restrictions)

## 🛠 Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, React Router
- **Backend:** Node.js, Express.js, MongoDB
- **Real-time:** Socket.io
- **Security:** bcrypt.js (Password Hashing), JWT Authentication

## 🏗 Setup Instructions

### 1️⃣ Backend Setup
```bash
cd backend
npm install
cp .env.example .env # Fill in MONGO_URI and JWT_SECRET
npm start
```

### 2️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3️⃣ Running the App
The frontend runs on `http://localhost:5173` and backend on `http://localhost:5000`.

## 📌 API Routes

### **Authentication**
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login

### **Appointments**
- `GET /api/appointments` - Fetch all appointments
- `POST /api/appointments` - Book an appointment

### **Doctors & Clinics**
- `GET /api/doctors` - Fetch doctor list
- `GET /api/clinics` - Fetch clinic details

## 🔐 Security Features
- **JWT Authentication** (Access control for protected routes)
- **Password Hashing** (`bcrypt.js` for secure storage)
- **CORS Restrictions** (Prevents unauthorized API access)
- **Rate Limiting** (Protection against brute-force attacks)

## 🚀 Future Improvements
- Implement automatic token refresh
- Add real-time chat between patients and clinics
- Improve UI/UX with animations and better accessibility

---
This project is built as part of a hackathon to tackle long hospital wait times efficiently. 🚑💡