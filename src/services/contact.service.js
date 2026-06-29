import Contact from "../models/contact.model.js";
import ApiError from "../utils/ApiError.js";

export const createInquiry = async (inquiryData) => {
    const { name, email, subject, message } = inquiryData;
    if (!name || !email || !subject || !message) {
        throw new ApiError(400, "All fields (name, email, subject, message) are required");
    }
    return await Contact.create({ name, email, subject, message });
};

export const getInquiries = async () => {
    return await Contact.find().sort({ createdAt: -1 });
};

export const updateInquiryStatus = async (id, status) => {
    const inquiry = await Contact.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true, runValidators: true }
    );
    if (!inquiry) {
        throw new ApiError(404, "Inquiry not found");
    }
    return inquiry;
};
