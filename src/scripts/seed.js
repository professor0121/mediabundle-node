import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/user.model.js";
import Blog from "../models/blog.model.js";
import Project from "../models/project.model.js";
import Team from "../models/team.model.js";
import Contact from "../models/contact.model.js";
import Cart from "../models/cart.model.js";

const seedDatabase = async () => {
    try {
        console.log("Connecting to database for seeding...");
        await connectDB();

        // Clear existing data
        console.log("Clearing existing data...");
        await User.deleteMany({});
        await Blog.deleteMany({});
        await Project.deleteMany({});
        await Team.deleteMany({});
        await Contact.deleteMany({});
        await Cart.deleteMany({});

        console.log("Seeding Users...");
        const adminPassword = await bcrypt.hash("admin123", 10);
        const userPassword = await bcrypt.hash("user123", 10);

        const admin = await User.create({
            username: "admin",
            email: "admin@mediabundle.io",
            password: adminPassword,
            role: "admin",
            avatar: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=admin",
            isVerified: true
        });

        const testuser = await User.create({
            username: "testuser",
            email: "user@gmail.com",
            password: userPassword,
            role: "user",
            avatar: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=testuser",
            isVerified: true
        });

        console.log("Seeding Projects...");
        const projectsData = [
            {
                title: "Basic Package",
                description: "Perfect package for starter sites or personal branding websites.",
                type: "template",
                price: 49,
                features: ["3 Pages Design", "Mobile Responsive", "Basic SEO Setup", "1 Month Support"],
                imageUrl: "https://cdn.prod.website-files.com/65129f2d60f024bc29b6a85a/6544e77c542043fb0ef703bc_about-hero-image.jpg",
                demoUrl: "https://mediabundle.io/demo/basic",
                downloadUrl: "https://mediabundle.io/download/basic",
                owner: admin._id,
                isFeatured: false
            },
            {
                title: "Standard Package",
                description: "Best suited for small businesses looking to grow their digital presence.",
                type: "website",
                price: 99,
                features: ["7 Pages Design", "Mobile Responsive", "Advanced SEO Setup", "Contact Form Setup", "3 Months Support"],
                imageUrl: "https://cdn.prod.website-files.com/65129f2d60f024bc29b6a85a/6544e794542043fb0ef70fcb_about-hero-image-right.jpg",
                demoUrl: "https://mediabundle.io/demo/standard",
                downloadUrl: "https://mediabundle.io/download/standard",
                owner: admin._id,
                isFeatured: true
            },
            {
                title: "Pro Package",
                description: "A comprehensive solution for medium-to-large businesses seeking bespoke integrations.",
                type: "app",
                price: 199,
                features: ["Unlimited Pages", "Custom UI/UX Design", "E-commerce Integration", "Premium SEO Bundle", "Priority 24/7 Support", "Database Integration"],
                imageUrl: "https://cdn.prod.website-files.com/65129f2d60f024bc29b6a85a/6544ed3dd3b4ca9cace347e4_ceo-image.jpg",
                demoUrl: "https://mediabundle.io/demo/pro",
                downloadUrl: "https://mediabundle.io/download/pro",
                owner: admin._id,
                isFeatured: true
            },
            {
                title: "AI Automation Dashboard",
                description: "A clean dashboard application tracking complex machine learning workloads.",
                type: "app",
                price: 299,
                features: ["React Integration", "Tailwind CSS styling", "Live WebSocket stats"],
                imageUrl: "https://cdn.prod.website-files.com/65438e658397c735408007ce/6545db4a4278e4f6d5d5b981_team-01.jpg",
                demoUrl: "https://mediabundle.io/projects/ai-dashboard",
                owner: admin._id,
                isFeatured: true
            },
            {
                title: "Minimal Portfolio Showcase",
                description: "A gorgeous template designed to demonstrate photography or design works.",
                type: "template",
                price: 29,
                features: ["Framer Motion animations", "Grid layouts", "Custom typography"],
                imageUrl: "https://cdn.prod.website-files.com/65438e658397c735408007ce/6545db546fa16d731391f913_team-02.jpg",
                demoUrl: "https://mediabundle.io/projects/minimal-portfolio",
                owner: admin._id,
                isFeatured: false
            }
        ];

        const seededProjects = await Project.create(projectsData);

        console.log("Seeding Blogs...");
        const blogsData = [
            {
                title: "10 Tips for Remote Work Productivity",
                content: "Remote work is here to stay. In this post, we discuss the top 10 actionable strategies to maintain a healthy work-life balance and double your output while working from home. Establishing dedicated workspaces, structuring your calendar, and minimizing online distractions are key components...",
                excerpt: "Actionable tips to supercharge your remote work routine and maintain balance.",
                tags: ["Productivity", "Remote Work", "Workplace"],
                coverImage: "https://cdn.prod.website-files.com/65129f2d60f024bc29b6a85a/6544e77c542043fb0ef703bc_about-hero-image.jpg",
                status: "published",
                author: admin._id
            },
            {
                title: "5 Key Trends Shaping E-commerce in 2026",
                content: "E-commerce is evolving faster than ever. As we look at 2026, AI-driven personalizations, voice shopping, augmented reality previews, social commerce integrations, and hyper-local supply chains are redefining how consumers interact with digital stores. Business owners must adapt to survive...",
                excerpt: "Explore the cutting-edge trends changing e-commerce operations this year.",
                tags: ["E-commerce", "Trends", "Business"],
                coverImage: "https://cdn.prod.website-files.com/65129f2d60f024bc29b6a85a/6544e794542043fb0ef70fcb_about-hero-image-right.jpg",
                status: "published",
                author: admin._id
            },
            {
                title: "Designing Engaging User Experiences: The Essentials",
                content: "UX design is not just about aesthetics; it's about solving user problems. We look into accessibility rules (WCAG), layout flows, visual hierarchy, micro-animations, and psychological triggers that turn random visitors into loyal active customers. Discover the basic principles today...",
                excerpt: "Deep dive into visual hierarchy, accessibility, and interactive design.",
                tags: ["UX Design", "Product Design", "Aesthetics"],
                coverImage: "https://cdn.prod.website-files.com/65438e658397c735408007ce/6545db4a4278e4f6d5d5b981_team-01.jpg",
                status: "published",
                author: admin._id
            },
            {
                title: "Drafting the Next Big Idea",
                content: "This is a draft post containing internal details about our agency expansion strategy. It should only be visible to administrators and editors...",
                excerpt: "Internal review post for team expansion.",
                tags: ["Internal", "Growth"],
                coverImage: "https://cdn.prod.website-files.com/65438e658397c735408007ce/6545db5f056349385e13f273_team-03.jpg",
                status: "draft",
                author: admin._id
            }
        ];

        await Blog.create(blogsData);

        console.log("Seeding Team Members...");
        const teamData = [
            {
                name: "Abram Culhane",
                role: "Founder & CEO",
                avatar: "https://cdn.prod.website-files.com/65438e658397c735408007ce/6545db4a4278e4f6d5d5b981_team-01.jpg",
                bio: "Over 15 years leading digital agency products and consulting Fortune 500 brands.",
                socialLinks: { twitter: "@abramc", github: "abram-ceo", linkedin: "abram-culhane" },
                order: 1
            },
            {
                name: "Abram Kenter",
                role: "Creative Director",
                avatar: "https://cdn.prod.website-files.com/65438e658397c735408007ce/6545db546fa16d731391f913_team-02.jpg",
                bio: "Award-winning designer responsible for branding, aesthetics, and premium UI concepts.",
                socialLinks: { twitter: "@kenterdesign", linkedin: "abram-kenter" },
                order: 2
            },
            {
                name: "Justin Philips",
                role: "Marketing Manager",
                avatar: "https://cdn.prod.website-files.com/65438e658397c735408007ce/6545db5f056349385e13f273_team-03.jpg",
                bio: "Expert growth marketer driving customer acquisition and conversion optimization campaigns.",
                socialLinks: { twitter: "@justinpmkt", github: "justinp-code" },
                order: 3
            },
            {
                name: "Madelyn Kenter",
                role: "Content Writer",
                avatar: "https://cdn.prod.website-files.com/65438e658397c735408007ce/6545db82bdc91ab0bde9ff1a_team-07.jpg",
                bio: "Storyteller focused on copy, technical documentations, and SEO-optimized blogs.",
                socialLinks: { linkedin: "madelyn-kenter" },
                order: 4
            }
        ];

        await Team.create(teamData);

        console.log("Seeding Contacts...");
        await Contact.create({
            name: "John Doe",
            email: "john@example.com",
            subject: "Partnership Proposal",
            message: "Hello MediaBundle team, we would love to partner with you for our upcoming product launch. Let us know when you are free to discuss.",
            status: "unread"
        });

        console.log("Seeding User Cart...");
        const cart = await Cart.create({
            user: testuser._id,
            items: [
                {
                    project: seededProjects[0]._id, // Basic Package
                    price: seededProjects[0].price
                },
                {
                    project: seededProjects[1]._id, // Standard Package
                    price: seededProjects[1].price
                }
            ],
            totalPrice: seededProjects[0].price + seededProjects[1].price
        });

        console.log("Database seeded successfully!");
        mongoose.connection.close();
    } catch (error) {
        console.error("Database seeding failed:", error);
        process.exit(1);
    }
};

seedDatabase();
