import * as cartService from "../services/cart.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getCart = asyncHandler(async (req, res) => {
    const cart = await cartService.getCartByUserId(req.user._id);
    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

export const addItemToCart = asyncHandler(async (req, res) => {
    const { projectId } = req.body;
    if (!projectId) {
        return res.status(400).json(new ApiResponse(400, null, "projectId is required"));
    }
    const cart = await cartService.addItemToCart(req.user._id, projectId);
    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Item added to cart successfully"));
});

export const removeItemFromCart = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const cart = await cartService.removeItemFromCart(req.user._id, projectId);
    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Item removed from cart successfully"));
});

export const clearCart = asyncHandler(async (req, res) => {
    const cart = await cartService.clearCart(req.user._id);
    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart cleared successfully"));
});

export const checkout = asyncHandler(async (req, res) => {
    const orderDetails = await cartService.checkoutCart(req.user._id);
    return res
        .status(200)
        .json(new ApiResponse(200, orderDetails, "Checkout completed successfully"));
});
