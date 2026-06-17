// Load environment variables before anything else imports them.
import "./config/loadEnv.js";

import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { Server } from "socket.io";

import errorMiddleware from "./src/middlewares/errors.js";
import { connectDatabase } from "./config/dbConnect.js";
import { getCardsData } from "./src/constants.js";
import { getStats } from "./src/controllers/statsController.js";

// Routes
import userAuthRoutes from "./src/routes/userAuth.js";
import doctorRoutes from "./src/routes/doctorRoutes.js";
import doctors from "./src/routes/Doctors.js";
import reportRoutes from "./src/routes/reportRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import labRoutes from "./src/routes/labRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

connectDatabase();

// ----- Core security & parsing middleware -----
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize()); // strip $ / . from request payloads → blocks NoSQL injection
app.use(compression());

if (process.env.NODE_ENV !== "PRODUCTION") {
  app.use(morgan("dev"));
}

// Throttle abusive clients (e.g. brute-force on auth endpoints).
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." },
  })
);

// Static doctor/specialization images + user-uploaded avatars
app.use("/photos", express.static(path.join(__dirname, "photos")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ----- Routes -----
app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));

app.get("/api/cards", (req, res) => res.json(getCardsData()));

app.get("/api/stats", getStats);

app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

app.use("/api/doctor", doctorRoutes);
app.use("/api/doctors", doctors);
app.use("/api/reports", reportRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/lab", labRoutes);
app.use("/api", userAuthRoutes);

app.use(errorMiddleware);

// ----- HTTP + WebSocket server -----
const server = app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT} in ${process.env.NODE_ENV} mode.`);
});

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (user) => {
    socket.join(user._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat?.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (`${user.userId}` === `${newMessageReceived.sender._id}`) return;
      socket.to(user.userId).emit("message recieved", newMessageReceived);
    });
  });

  socket.on("delete chat", (data) => {
    const userId = data.user?.[0]?._id;
    const chatId = data.chatid;
    if (!userId) return console.log("user id not defined");
    socket.to(userId).emit("end chat", chatId);
  });
});

// Handle unhandled promise rejections gracefully.
process.on("unhandledRejection", (err) => {
  console.error(`ERROR: ${err}`);
  console.log("Shutting down server due to unhandled promise rejection");
  server.close(() => process.exit(1));
});
