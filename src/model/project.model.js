import mongoose from "mongoose";

export const projectType = ["Theme", "website", "wordpress", "shopify", "template", "plugin", "script", "app", "software", "other", "canva", "ui&ux"];

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Project title is required"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "Project description is required"]
        },
        type: {
            type: String,
            required: [true, "Project type is required"],
            enum: {
                values: projectType,
                message: "Project type is not valid. Choose from: " + projectType.join(", ")
            }
        },
        price: {
            type: Number,
            required: [true, "Project price is required"],
            min: [0, "Price cannot be negative"],
            default: 0
        },
        features: {
            type: [String],
            default: []
        },
        demoUrl: {
            type: String,
            trim: true
        },
        downloadUrl: {
            type: String,
            trim: true
        },
        imageUrl: {
            type: String,
            trim: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Project owner is required"]
        },
        isFeatured: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Create indexes for efficient searching/filtering
projectSchema.index({ type: 1 });
projectSchema.index({ price: 1 });
projectSchema.index({ isFeatured: 1 });

const Project = mongoose.model("Project", projectSchema);

export default Project;