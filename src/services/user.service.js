import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export const getUserById = async (id) => {
    const user = await User.findById(id).select("-password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return user;
};

export const updateUserProfile = async (id, updateData) => {
    // Avoid password updates in standard profile updates
    const sanitizedData = { ...updateData };
    delete sanitizedData.password;

    const user = await User.findByIdAndUpdate(
        id,
        { $set: sanitizedData },
        { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return user;
};
