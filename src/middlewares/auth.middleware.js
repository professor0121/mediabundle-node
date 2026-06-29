import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyToken } from "../utils/jwt.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized: No token provided");
        }

        const decodedToken = verifyToken(token, "access");

        const user = await User.findById(decodedToken._id).select("-password");

        if (!user) {
            throw new ApiError(401, "Unauthorized: Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized: Invalid Access Token");
    }
});

export const requireRole = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized: User not authenticated");
        }
        if (!roles.includes(req.user.role)) {
            throw new ApiError(
                403,
                `Forbidden: You do not have permission to perform this action. Required: ${roles.join(", ")}`
            );
        }
        next();
    };
};

export const optionalJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (token) {
            const decodedToken = verifyToken(token, "access");
            const user = await User.findById(decodedToken._id).select("-password");
            if (user) {
                req.user = user;
            }
        }
    } catch (error) {
        // Proceed silently as a guest
    }
    next();
});
