import mongoose from "mongoose";
import Food from "../models/foods.js";
import { isCurrentUserAdmin } from "./users.js";

export const getFoods = async (req, res) => {
    try {
        const isAdmin = await isCurrentUserAdmin(req.user);

        const {
            index, limit, fromDate, toDate
        } = req.query;

        const findParams = {};

        if (!isAdmin) {
            findParams.userId = req.user;
        }

        if (fromDate && toDate) {
            const from = fromDate.split("/");
            const to = toDate.split("/");
            findParams.takenAt = {
                $gte: new Date(from[0], from[1] - 1, from[2]),
                $lte: new Date(new Date(to[0], to[1] - 1, to[2]).setHours(23, 59, 59))
            };
        }

        const sortingParams = { createdAt: -1 };
        if (findParams.takenAt) {
            sortingParams.takenAt = -1;
        }

        const foods = await Food.find(findParams)
            .sort(sortingParams)
            .limit(limit)
            .skip(index);

        const totalCount = await Food.find(findParams).count();
        res.status(200).json({
            foods,
            totalCount
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const addFood = async (req, res) => {
    const { body } = req;
    if (!body.userId) {
        body.userId = req.user;
    }
    const newFood = new Food(body);
    try {
        await newFood.save();
        res.status(201).json(newFood);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateFood = async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No entry found with id: ${id}`);

        await Food.findByIdAndUpdate(id, body, { new: true });
        res.json(body);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteFoods = async (req, res) => {
    const { body } = req;
    try {
        await Food.deleteMany({ _id: { $in: body } });
        res.json({ message: "Foods deleted successfully." });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
