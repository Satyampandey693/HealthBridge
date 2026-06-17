import mongoose from "mongoose";

// Single source of truth for the connection URI.
export const getMongoURI = () =>
  process.env.NODE_ENV === "PRODUCTION"
    ? process.env.DB_URI
    : process.env.DB_LOCAL_URI;

export const connectDatabase = async () => {
  const DB_URI = getMongoURI();

  if (!DB_URI) {
    console.error(
      "❌ No database URI configured. Set DB_LOCAL_URI / DB_URI in config.env"
    );
    process.exit(1);
  }

  try {
    const con = await mongoose.connect(DB_URI);
    console.log(`MongoDB connected with HOST: ${con.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
