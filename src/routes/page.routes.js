import { Router } from "express";
import {
    renderHome,
    renderAbout,
    renderPricing,
    renderBlogList,
    renderSingleBlog,
    renderProjects,
    renderCheckout,
    renderContact,
    renderServices,
    renderCareer,
    renderPrivacyPolicy,
    renderTermsConditions
} from "../controllers/page.controller.js";

const router = Router();

// Home page
router.get("/", renderHome);
router.get("/index", renderHome);
router.get("/index.html", renderHome);

// About page
router.get("/about", renderAbout);
router.get("/about.html", renderAbout);

// Pricing page
router.get("/pricing", renderPricing);
router.get("/pricing.html", renderPricing);

// Blog pages
router.get("/blog", renderBlogList);
router.get("/blog.html", renderBlogList);
router.get("/blog/:slug", renderSingleBlog);

// Projects portfolio page
router.get("/project", renderProjects);
router.get("/project.html", renderProjects);

// Checkout page
router.get("/checkout", renderCheckout);
router.get("/checkout.html", renderCheckout);

// Contact page
router.get("/contact", renderContact);
router.get("/contact.html", renderContact);

// Service page
router.get("/service", renderServices);
router.get("/service.html", renderServices);

// Career page
router.get("/career", renderCareer);
router.get("/career.html", renderCareer);

// Privacy Policy page
router.get("/privacy-policy", renderPrivacyPolicy);
router.get("/privacy-policy.html", renderPrivacyPolicy);

// Terms and Conditions page
router.get("/terms-conditions", renderTermsConditions);
router.get("/terms-conditions.html", renderTermsConditions);

export default router;
