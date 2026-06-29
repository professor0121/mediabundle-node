import Team from "../models/team.model.js";
import ApiError from "../utils/ApiError.js";

export const getTeam = async () => {
    return await Team.find().sort({ order: 1 });
};

export const createTeamMember = async (memberData) => {
    return await Team.create(memberData);
};

export const updateTeamMember = async (id, updateData) => {
    const member = await Team.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );
    if (!member) {
        throw new ApiError(404, "Team member not found");
    }
    return member;
};

export const deleteTeamMember = async (id) => {
    const member = await Team.findByIdAndDelete(id);
    if (!member) {
        throw new ApiError(404, "Team member not found");
    }
    return { success: true, message: "Team member removed successfully" };
};
