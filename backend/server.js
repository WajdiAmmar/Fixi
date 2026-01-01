import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/mongo.js";
import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import artisanProfileRoutes from "./routes/artisanProfileRoutes.js";
import requestRoutes from "./routes/RequestRoutes.js";
import responseRoutes from "./routes/ResponseRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

connectDB();

app.get("/", (req, res) => {
  res.send("Fixi backend is running successfully");
});

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/artisan-profiles", artisanProfileRoutes);
app.use("/api/request",requestRoutes);
app.use("/api/response",responseRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
