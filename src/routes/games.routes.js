import { Router } from "express";
import { getGames, createGame } from "../controllers/games.controller.js";

const router = Router();

router.get("/games", getGames);
router.post("/games", createGame);

export { router as games };
