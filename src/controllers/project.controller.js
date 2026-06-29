import * as projectService from "../services/project.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAllProjects = asyncHandler(async (req, res) => {
    const result = await projectService.getProjects(req.query);
    return res
        .status(200)
        .json(new ApiResponse(200, result, "Projects fetched successfully"));
});

export const getProjectById = asyncHandler(async (req, res) => {
    const project = await projectService.getProjectById(req.params.id);
    return res
        .status(200)
        .json(new ApiResponse(200, project, "Project fetched successfully"));
});

export const createProject = asyncHandler(async (req, res) => {
    const project = await projectService.createProject(req.body, req.user._id);
    return res
        .status(201)
        .json(new ApiResponse(201, project, "Project created successfully"));
});

export const updateProject = asyncHandler(async (req, res) => {
    const project = await projectService.updateProject(req.params.id, req.body, req.user);
    return res
        .status(200)
        .json(new ApiResponse(200, project, "Project updated successfully"));
});

export const deleteProject = asyncHandler(async (req, res) => {
    const result = await projectService.deleteProject(req.params.id, req.user);
    return res
        .status(200)
        .json(new ApiResponse(200, result, "Project deleted successfully"));
});
