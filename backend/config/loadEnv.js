// Loaded as the very first import in server.js so that environment variables
// are available before any other module (db, payment client, etc.) is evaluated.
// ES module imports are hoisted and run before the importing file's body, so
// calling dotenv.config() here — at import time — guarantees correct ordering.
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "config.env") });
