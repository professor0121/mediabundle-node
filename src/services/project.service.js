import Project from "../models/project.model.js";
import ApiError from "../utils/ApiError.js";

export const getProjects = async (query = {}) => {
    const { type, isFeatured, minPrice, maxPrice, search, page = 1, limit = 12 } = query;
    const filter = {};

    if (type) {
        filter.type = type;
    }

    if (isFeatured !== undefined) {
        filter.isFeatured = isFeatured === "true" || isFeatured === true;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        filter.price = {};
        if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
        if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

    const skipIndex = (page - 1) * limit;
    const projects = await Project.find(filter)
        .populate("owner", "username email avatar")
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(skipIndex);

    const totalProjects = await Project.countDocuments(filter);

    return {
        projects,
        totalPages: Math.ceil(totalProjects / limit),
        currentPage: Number(page),
        totalProjects
    };
};

export const getProjectById = async (id) => {
    const project = await Project.findById(id).populate("owner", "username email avatar");
    if (!project) {
        throw new ApiError(404, "Project not found");
    }
    return project;
};

export const createProject = async (projectData, ownerId) => {
    const project = await Project.create({
        ...projectData,
        owner: ownerId
    });
    return project;
};

export const updateProject = async (id, updateData, requester) => {
    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Owner or admin/editor roles can update
    if (project.owner.toString() !== requester._id.toString() && requester.role === "user") {
        throw new ApiError(403, "Forbidden: You are not the owner of this project");
    }

    Object.assign(project, updateData);
    await project.save();
    return project;
};

export const deleteProject = async (id, requester) => {
    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    if (project.owner.toString() !== requester._id.toString() && requester.role === "user") {
        throw new ApiError(403, "Forbidden: You are not authorized to delete this project");
    }

    await Project.deleteOne({ _id: project._id });
    return { success: true, message: "Project deleted successfully" };
};
