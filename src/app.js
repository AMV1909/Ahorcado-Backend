import express from "express";
import cors from "cors";

import { games } from "./routes/games.routes.js";

const app = express();

// Settings
app.set("port", process.env.PORT || 3000);

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", games);

export { app };
