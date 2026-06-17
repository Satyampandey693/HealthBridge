# HealthBridge

A full-stack telemedicine platform where patients browse doctors by specialization,
book and pay for consultation slots (Razorpay), chat with their doctor in real time
(Socket.io), and manage lab tests and medical reports. Doctors manage their slots,
patients, and notifications; an admin panel oversees users and doctors.

## Tech stack

| Layer    | Technology                                                        |
| -------- | ----------------------------------------------------------------- |
| Frontend | React 18, Vite, React Router 7, Chakra UI + Tailwind, Axios, Socket.io-client |
| Backend  | Node.js, Express 4, MongoDB + Mongoose, Socket.io                 |
| Auth     | JWT (Bearer tokens)                                               |
| Payments | Razorpay                                                          |
| Files    | GridFS (medical reports)                                          |

## Project structure

```
HealthBridge/
├── backend/
│   ├── config/          # env loader, DB connection, Razorpay client
│   ├── photos/          # static specialization images
│   └── src/
│       ├── controllers/ # route handlers
│       ├── middlewares/  # auth, error handling, file upload
│       ├── models/      # Mongoose schemas
│       └── routes/      # Express routers
└── frontend/
    └── src/
        ├── pages/       # route screens (doctors, chat, payment, admin, lab…)
        ├── components/  # layout + shared UI
        ├── store/       # auth context
        └── config.js    # API/socket base URLs (env-driven)
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (or a connection string to Atlas)

## Setup

### 1. Backend

```bash
cd backend
npm install
cp config/config.env.example config/config.env   # then fill in real values
npm run dev                                        # starts on http://localhost:5001
```

Generate a strong `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Set your Razorpay test keys (`RAZORPAY_API_KEY`, `RAZORPAY_API_SECRET`) from the
[Razorpay dashboard](https://dashboard.razorpay.com/).

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env        # defaults work for local development
npm run dev                 # starts on http://localhost:5173
```

In development the Vite dev server proxies `/api` to the backend (see
`vite.config.js`), so you don't need to set `VITE_API_URL`. For production, point
`VITE_API_URL` / `VITE_SOCKET_URL` at your deployed backend.

## Environment variables (backend `config/config.env`)

| Variable              | Description                                       |
| --------------------- | ------------------------------------------------- |
| `PORT`                | Backend port (default 5000)                       |
| `NODE_ENV`            | `DEVELOPMENT` or `PRODUCTION`                      |
| `DB_LOCAL_URI`        | MongoDB URI used in development                   |
| `DB_URI`              | MongoDB URI used in production                     |
| `FRONTEND_URL`        | Allowed CORS origin                               |
| `BACKEND_URL`         | Public backend origin (used to build photo URLs)  |
| `JWT_SECRET`          | Secret for signing JWTs                           |
| `JWT_EXPIRE_TIME`     | Token lifetime (e.g. `7d`)                         |
| `RAZORPAY_API_KEY`    | Razorpay key id                                   |
| `RAZORPAY_API_SECRET` | Razorpay key secret                               |

> **Never commit `config/config.env`.** It is gitignored. Only the
> `.example` template belongs in version control.

## Security notes

- All payment and medical-report endpoints require authentication.
- Consultation amounts are computed **server-side** from the doctor's fee — the
  client cannot dictate the amount charged.
- Payment records are written only after the Razorpay signature is verified, and
  are tied to the authenticated user (not a client-supplied id).
- `helmet`, rate limiting, and NoSQL-injection sanitizing are applied globally.

## Key API routes

| Method | Path                          | Description                       |
| ------ | ----------------------------- | --------------------------------- |
| GET    | `/api/health`                 | Health check                      |
| GET    | `/api/cards`                  | Specialization catalogue          |
| POST   | `/api/registerUser` / `loginUser` | Patient auth                  |
| POST   | `/api/doctor/signup` / `login`    | Doctor auth                   |
| GET    | `/api/doctors`                | List/search doctors               |
| POST   | `/api/payment/checkout`       | Create Razorpay order (auth)      |
| POST   | `/api/payment/verification`   | Verify payment + grant access     |
| POST   | `/api/chat`, `/api/message`   | Chat (auth)                       |
| GET    | `/api/admin/users` / `doctors`| Admin views (admin only)          |
