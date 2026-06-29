import * as blogService from "../services/blog.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAllBlogs = asyncHandler(async (req, res) => {
    const requesterRole = req.user?.role || "user";
    const result = await blogService.getBlogs(req.query, requesterRole);
    return res
        .status(200)
        .json(new ApiResponse(200, result, "Blogs fetched successfully"));
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
    const requesterRole = req.user?.role || "user";
    const blog = await blogService.getBlogBySlug(req.params.slug, requesterRole);
    return res
        .status(200)
        .json(new ApiResponse(200, blog, "Blog fetched successfully"));
});

export const createBlog = asyncHandler(async (req, res) => {
    const blog = await blogService.createBlog(req.body, req.user._id);
    return res
        .status(201)
        .json(new ApiResponse(201, blog, "Blog post created successfully"));
});

export const updateBlog = asyncHandler(async (req, res) => {
    const blog = await blogService.updateBlog(req.params.slug, req.body, req.user);
    return res
        .status(200)
        .json(new ApiResponse(200, blog, "Blog post updated successfully"));
});

export const deleteBlog = asyncHandler(async (req, res) => {
    const result = await blogService.deleteBlog(req.params.slug, req.user);
    return res
        .status(200)
        .json(new ApiResponse(200, result, "Blog post deleted successfully"));
});
