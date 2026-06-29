import Blog from "../models/blog.model.js";
import Project from "../models/project.model.js";
import Team from "../models/team.model.js";
import asyncHandler from "../utils/asyncHandler.js";

// Render Homepage
export const renderHome = asyncHandler(async (req, res) => {
    const projects = await Project.find().sort({ createdAt: -1 }).limit(4);
    const blogs = await Blog.find({ status: "published" }).sort({ createdAt: -1 }).limit(2);
    res.render("index", { projects, blogs });
});

// Render About Us (Dynamic Team List)
export const renderAbout = asyncHandler(async (req, res) => {
    const teamMembers = await Team.find().sort({ order: 1 });
    res.render("about", { teamMembers });
});

// Render Pricing Package grid
export const renderPricing = asyncHandler(async (req, res) => {
    res.render("pricing");
});

// Render Blog List page
export const renderBlogList = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({ status: "published" }).sort({ createdAt: -1 });
    res.render("blog", { blogs });
});

// Render Single Blog post details
export const renderSingleBlog = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug }).populate("author", "username avatar");
    
    if (!blog) {
        return res.status(404).render("404");
    }
    
    // Fetch 2 other related blogs to show in the footer
    const relatedBlogs = await Blog.find({ slug: { $ne: slug }, status: "published" }).limit(2);
    
    res.render("blog-detail", { blog, relatedBlogs });
});

// Render Projects portfolio page
export const renderProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.render("project", { projects });
});

// Render Checkout page
export const renderCheckout = asyncHandler(async (req, res) => {
    res.render("checkout");
});

// Render Contact page
export const renderContact = asyncHandler(async (req, res) => {
    res.render("contact");
});

// Render other simple static pages
export const renderServices = asyncHandler(async (req, res) => {
    res.render("service");
});

export const renderCareer = asyncHandler(async (req, res) => {
    res.render("career");
});

export const renderPrivacyPolicy = asyncHandler(async (req, res) => {
    res.render("privacy-policy");
});

export const renderTermsConditions = asyncHandler(async (req, res) => {
    res.render("terms-conditions");
});
