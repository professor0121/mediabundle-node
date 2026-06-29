import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

export const registerUser = async ({ username, email, password, role }) => {
    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        throw new ApiError(409, "User with this username or email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role: role || "user"
    });

    const userResponse = await User.findById(newUser._id).select("-password");
    return userResponse;
};

export const loginUser = async ({ email, username, password }) => {
    if (!email && !username) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [
            username ? { username } : null,
            email ? { email } : null
        ].filter(Boolean)
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const loggedInUser = await User.findById(user._id).select("-password");

    return { user: loggedInUser, accessToken, refreshToken };
};
