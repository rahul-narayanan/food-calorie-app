import mongoose from "mongoose";

const foodSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    caloriesCount: { type: Number, default: 0 },
    takenAt: { type: Date, default: Date.now },
    isCheatMeal: { type: Boolean, default: false }
}, { timestamps: true });

const Food = mongoose.model("Food", foodSchema);

export default Food;
