import express from "express";
import { getReports } from "../controllers/reports.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getReports);

export default router;
