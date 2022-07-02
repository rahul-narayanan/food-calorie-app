import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import { connectToDB } from "./utils.js";
import foodRoutes from "./routes/foods.js";
import userRoutes from "./routes/user.js";
import usersRoutes from "./routes/users.js";
import reportsRoutes from "./routes/reports.js";

const PORT = process.env.API_PORT || 8000;

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/reports", reportsRoutes);

(async function init() {
    try {
        await connectToDB();
        app.listen(PORT, () => console.log(`Express is listening at http://localhost:${PORT}`));
    } catch (err) {
        console.warn(err);
    }
}());
