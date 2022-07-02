import express from "express";
import {
    getFoods, addFood, deleteFoods, updateFood
} from "../controllers/foods.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getFoods);

router.post("/", auth, addFood);

router.post("/delete", auth, deleteFoods);

router.patch("/:id", auth, updateFood);

export default router;
