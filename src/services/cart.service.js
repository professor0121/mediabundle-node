import Cart from "../models/cart.model.js";
import Project from "../models/project.model.js";
import ApiError from "../utils/ApiError.js";

export const getCartByUserId = async (userId) => {
    let cart = await Cart.findOne({ user: userId }).populate("items.project", "title price imageUrl type");
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [], totalPrice: 0 });
    }
    return cart;
};

export const addItemToCart = async (userId, projectId) => {
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = new Cart({ user: userId, items: [] });
    }

    // Check if item already exists in cart
    const isItemInCart = cart.items.find(
        (item) => item.project.toString() === projectId.toString()
    );

    if (isItemInCart) {
        throw new ApiError(400, "Item already exists in the cart");
    }

    cart.items.push({
        project: projectId,
        price: project.price
    });

    await cart.save();
    return getCartByUserId(userId);
};

export const removeItemFromCart = async (userId, projectId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const itemIndex = cart.items.findIndex(
        (item) => item.project.toString() === projectId.toString()
    );

    if (itemIndex === -1) {
        throw new ApiError(404, "Item not found in cart");
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    return getCartByUserId(userId);
};

export const clearCart = async (userId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    return cart;
};

export const checkoutCart = async (userId) => {
    const cart = await getCartByUserId(userId);
    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cannot checkout: your cart is empty");
    }

    // Simulate order creation logic
    const orderDetails = {
        orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        items: cart.items.map(item => ({
            projectId: item.project._id,
            title: item.project.title,
            price: item.price
        })),
        totalPrice: cart.totalPrice,
        status: "Completed",
        paymentStatus: "Paid",
        purchasedAt: new Date()
    };

    // Clear cart after checkout
    await clearCart(userId);

    return orderDetails;
};
