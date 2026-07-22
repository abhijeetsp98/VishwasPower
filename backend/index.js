import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import AutoCompanyRoute from "./routes/autoCompanyRoutes.js";
import AutoDataRoute from "./routes/autoDataRoutes.js";
import VConnectCompanyRoute from "./routes/vConnectCompanyRoutes.js"
import VConnectDataRoute from "./routes/vConnectDataRoutes.js"
import TractionCompanyRoute from "./routes/tractionCompanyRoutes.js"
import TractionDataRoute from "./routes/tractionDataRoutes.js"

// Testing department routes
import TestAutoCompanyRoute from "./routes/testAutoCompanyRoutes.js";
import TestAutoDataRoute from "./routes/autoDataRoutes.js";
import TestAutoTransformerDataRoute from "./routes/testAutoDataRoutes.js";
import TestTractionCompanyRoute from "./routes/testTractionCompanyRoutes.js";
import TestTractionDataRoute from "./routes/tractionDataRoutes.js";
import TestVConnectCompanyRoute from "./routes/testVConnectCompanyRoutes.js";
import TestVConnectDataRoute from "./routes/vConnectDataRoutes.js";
import voltTrackRoutes from "./routes/voltTrackRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for large payloads
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded bodies

// ✅ Ensure uploads folder exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// ✅ Serve static files from uploads
app.use("/uploads", express.static(uploadsPath));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/autocompany", AutoCompanyRoute);
app.use("/api/autoData/", AutoDataRoute);
app.use("/api/vconnectcompany", VConnectCompanyRoute);
app.use("/api/vconnectData/", VConnectDataRoute);
app.use("/api/tractioncompany", TractionCompanyRoute);
app.use("/api/tractionData/", TractionDataRoute);

// Testing department routes
app.use("/api/test_autocompany", TestAutoCompanyRoute);
app.use("/api/test_autoData/", TestAutoDataRoute);
app.use("/api/test_autoTransformerData/", TestAutoTransformerDataRoute);
app.use("/api/test_tractioncompany", TestTractionCompanyRoute);
app.use("/api/test_tractionData/", TestTractionDataRoute);
app.use("/api/test_vconnectcompany", TestVConnectCompanyRoute);
app.use("/api/test_vconnectData/", TestVConnectDataRoute);

// VoltTrack Testing Department routes
app.use("/api/volttrack", voltTrackRoutes);

// Serve VoltTrack Vite app as static files at /volttrack
const voltTrackPath = path.join(__dirname, "public", "volttrack");
app.use("/volttrack", express.static(voltTrackPath));
// SPA catch-all: any /volttrack/* route serves index.html (Express v5 uses /*splat)
app.get("/volttrack/*splat", (req, res) => {
  res.sendFile(path.join(voltTrackPath, "index.html"));
});

const PORT = process.env.PORT || 7000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

// Fix for net::ERR_CONNECTION_RESET on VPS with Nginx reverse proxy.
// Node.js default keepAliveTimeout is 5s, but Nginx's keepalive_timeout is 75s.
// When Nginx reuses a keep-alive connection that Node.js has already closed,
// Node.js resets it → ERR_CONNECTION_RESET. Setting these values higher than
// Nginx's keepalive_timeout prevents the mismatch.
server.keepAliveTimeout = 120 * 1000; // 120 seconds (must be > Nginx keepalive_timeout of 75s)
server.headersTimeout = 125 * 1000;   // 125 seconds (must be > keepAliveTimeout)
