import * as teamService from "../services/team.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getTeam = asyncHandler(async (req, res) => {
    const team = await teamService.getTeam();
    return res
        .status(200)
        .json(new ApiResponse(200, team, "Team members fetched successfully"));
});

export const createTeamMember = asyncHandler(async (req, res) => {
    const member = await teamService.createTeamMember(req.body);
    return res
        .status(201)
        .json(new ApiResponse(201, member, "Team member added successfully"));
});

export const updateTeamMember = asyncHandler(async (req, res) => {
    const member = await teamService.updateTeamMember(req.params.id, req.body);
    return res
        .status(200)
        .json(new ApiResponse(200, member, "Team member details updated successfully"));
});

export const deleteTeamMember = asyncHandler(async (req, res) => {
    const result = await teamService.deleteTeamMember(req.params.id);
    return res
        .status(200)
        .json(new ApiResponse(200, result, "Team member removed successfully"));
});
