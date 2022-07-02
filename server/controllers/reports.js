/* eslint-disable no-plusplus */
import lodash from "lodash";
import Food from "../models/foods.js";
import User from "../models/users.js";
import { isCurrentUserAdmin } from "./users.js";

export const getReportsForAdmin = async (req, res) => {
    try {
        const dateBefore7Days = new Date();
        dateBefore7Days.setDate(dateBefore7Days.getDate() - 6);
        dateBefore7Days.setHours(0, 0, 0);

        const last7DaysEntries = await Food.find({ createdAt: { $gt: dateBefore7Days } });

        const dateBefore14Days = new Date();
        dateBefore14Days.setDate(dateBefore14Days.getDate() - 13);
        dateBefore14Days.setHours(0, 0, 0);

        const aWeekBefore7DaysCount = await Food.find({
            createdAt: { $lte: dateBefore7Days, $gt: dateBefore14Days }
        }).count();

        const totalUsersCount = await User.countDocuments();

        const caloriesAddedForLast7Days = [];

        let entries;
        for (let i = 0; i < 7; i++) {
            entries = last7DaysEntries.filter(
                ({ createdAt }) => new Date(createdAt).getDate() === dateBefore7Days.getDate()
            ) || [];

            let total = 0;
            entries.forEach((entry) => {
                total += entry.caloriesCount;
            });

            caloriesAddedForLast7Days[i] = total;
            dateBefore7Days.setDate(dateBefore7Days.getDate() + 1);
        }

        return {
            last7DaysCount: last7DaysEntries.length,
            aWeekBefore7DaysCount,
            totalUsersCount,
            caloriesAddedForLast7Days
        };
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getReportsForUser = async (req, res) => {
    try {
        const foods = await Food.find({ userId: req.user }).sort({ takenAt: -1 });

        for (let i = 0; i < foods.length; i++) {
            const date = new Date(foods[i].takenAt);
            date.setHours(0, 0, 0, 0);
            foods[i].takenAtDate = date.getTime();
        }

        const userObj = await User.findById(req.user);
        const groupedFoods = lodash.groupBy(foods, "takenAtDate");

        const limitExceededData = [];
        Object.keys(groupedFoods).forEach((key) => {
            const totalCalories = groupedFoods[key].reduce((total, food) => {
                if (food.isCheatMeal) {
                    return total;
                }

                return total + food.caloriesCount;
            }, 0);

            if (totalCalories > userObj.dailyCalorieLimit) {
                limitExceededData.push({
                    date: key,
                    totalCalories
                });
            }
        });

        return {
            totalEntries: foods.length,
            limitExceededData: limitExceededData.reverse(),
            dailyCalorieLimit: userObj.dailyCalorieLimit
        };
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getReports = async (req, res) => {
    try {
        const isAdmin = await isCurrentUserAdmin(req.user);
        let adminReports = {};
        if (isAdmin) {
            adminReports = await getReportsForAdmin(req, res);
        }

        const userReports = await getReportsForUser(req, res);

        res.json({
            ...adminReports,
            ...userReports
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
