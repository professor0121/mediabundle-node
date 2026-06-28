import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Blog title is required"],
            trim: true
        },
        slug: {
            type: String,
            required: [true, "Blog slug is required"],
            unique: true,
            lowercase: true,
            trim: true
        },
        content: {
            type: String,
            required: [true, "Blog content is required"]
        },
        excerpt: {
            type: String,
            trim: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Blog author is required"]
        },
        tags: {
            type: [String],
            default: []
        },
        coverImage: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft"
        }
    },
    {
        timestamps: true
    }
);

// Pre-validate hook to generate slugs from the title automatically
blogSchema.pre("validate", function (next) {
    if (this.title && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    }
    next();
});

// Indexes for slug, author, status, and tags
blogSchema.index({ slug: 1 });
blogSchema.index({ author: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ tags: 1 });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
