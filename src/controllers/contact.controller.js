import * as contactService from "../services/contact.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createInquiry = asyncHandler(async (req, res) => {
    const inquiry = await contactService.createInquiry(req.body);
    return res
        .status(201)
        .json(new ApiResponse(201, inquiry, "Message submitted successfully"));
});

export const getInquiries = asyncHandler(async (req, res) => {
    const inquiries = await contactService.getInquiries();
    return res
        .status(200)
        .json(new ApiResponse(200, inquiries, "Inquiries retrieved successfully"));
});

export const updateInquiryStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const inquiry = await contactService.updateInquiryStatus(req.params.id, status);
    return res
        .status(200)
        .json(new ApiResponse(200, inquiry, "Inquiry status updated successfully"));
});
