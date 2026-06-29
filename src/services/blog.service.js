import Blog from "../models/blog.model.js";
import ApiError from "../utils/ApiError.js";

export const getBlogs = async (query = {}, requesterRole = "user") => {
    const { page = 1, limit = 10, search, tag, status } = query;
    const filter = {};

    // Standard user can only view published blogs
    if (requesterRole === "user") {
        filter.status = "published";
    } else if (status) {
        filter.status = status; // admin/editor can filter by status
    }

    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } }
        ];
    }

    if (tag) {
        filter.tags = tag;
    }

    const skipIndex = (page - 1) * limit;
    const blogs = await Blog.find(filter)
        .populate("author", "username email avatar")
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(skipIndex);

    const totalBlogs = await Blog.countDocuments(filter);

    return {
        blogs,
        totalPages: Math.ceil(totalBlogs / limit),
        currentPage: Number(page),
        totalBlogs
    };
};

export const getBlogBySlug = async (slug, requesterRole = "user") => {
    const blog = await Blog.findOne({ slug }).populate("author", "username email avatar");
    if (!blog) {
        throw new ApiError(404, "Blog post not found");
    }

    if (blog.status === "draft" && requesterRole === "user") {
        throw new ApiError(403, "Access forbidden: this blog is a draft");
    }

    return blog;
};

export const createBlog = async (blogData, authorId) => {
    const blog = await Blog.create({
        ...blogData,
        author: authorId
    });
    return blog;
};

export const updateBlog = async (slug, updateData, requester) => {
    const blog = await Blog.findOne({ slug });
    if (!blog) {
        throw new ApiError(404, "Blog post not found");
    }

    // Only author or admin/editor can update
    if (blog.author.toString() !== requester._id.toString() && requester.role === "user") {
        throw new ApiError(403, "Forbidden: You are not the author of this post");
    }

    Object.assign(blog, updateData);
    await blog.save();
    return blog;
};

export const deleteBlog = async (slug, requester) => {
    const blog = await Blog.findOne({ slug });
    if (!blog) {
        throw new ApiError(404, "Blog post not found");
    }

    if (blog.author.toString() !== requester._id.toString() && requester.role === "user") {
        throw new ApiError(403, "Forbidden: You are not authorized to delete this post");
    }

    await Blog.deleteOne({ _id: blog._id });
    return { success: true, message: "Blog post deleted successfully" };
};
