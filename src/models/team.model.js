import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Team member name is required"],
            trim: true
        },
        role: {
            type: String,
            required: [true, "Team member role is required"],
            trim: true
        },
        avatar: {
            type: String,
            default: "https://api.dicebear.com/7.x/initials/svg"
        },
        bio: {
            type: String,
            trim: true
        },
        socialLinks: {
            twitter: {
                type: String,
                trim: true
            },
            github: {
                type: String,
                trim: true
            },
            linkedin: {
                type: String,
                trim: true
            }
        },
        order: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

// Index on order for display sorting efficiency
teamSchema.index({ order: 1 });

const Team = mongoose.model("Team", teamSchema);

export default Team;
