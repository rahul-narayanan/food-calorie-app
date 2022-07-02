import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 5 },
    displayName: { type: String },
    isAdmin: { type: Boolean, default: false },
    dailyCalorieLimit: { type: Number, default: 2100 }
});

const User = mongoose.model("User", userSchema);

export default User;
