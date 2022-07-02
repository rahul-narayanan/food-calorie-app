import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/users.js";

export const isCurrentUserAdmin = async (userId) => {
    const user = await User.findById(userId);
    return user && user.isAdmin;
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        return res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const isAdmin = await isCurrentUserAdmin(req.user);
        if (!isAdmin) {
            return res.status(400)
                .json({ msg: "Access denied. Only admins can fetch all users" });
        }

        const users = await User.find({});
        return res.json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        let { displayName } = req.body;

        if (!displayName || !email || !password || !confirmPassword) {
            return res.status(400)
                .json({ msg: "All fields are mandatory" });
        }

        if (password.length < 5) {
            return res.status(400)
                .json({ msg: "Password should be least 5 characters" });
        }

        if (password !== confirmPassword) {
            return res.status(400)
                .json({ msg: "Confirm password does not match with password" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ msg: "Email address already exists." });
        }

        if (!displayName) displayName = email;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        const user = new User({
            email,
            password: passwordHash,
            displayName
        });
        const newUser = await user.save();
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Email or password is missing" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ msg: "No account found for this email address" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                id: user._id,
                displayName: user.displayName,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const checkIfTokenIsValid = async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
