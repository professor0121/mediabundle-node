import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: [true, "Project selection is required for cart item"]
        },
        price: {
            type: Number,
            required: [true, "Price is required at addition time"],
            min: [0, "Price cannot be negative"]
        }
    },
    {
        _id: false // Disable _id for cart items sub-documents to keep it clean
    }
);

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Cart must be owned by a user"],
            unique: true // One cart per user
        },
        items: [cartItemSchema],
        totalPrice: {
            type: Number,
            default: 0,
            min: [0, "Total price cannot be negative"]
        }
    },
    {
        timestamps: true
    }
);

// Pre-save middleware to automatically calculate total price
cartSchema.pre("save", function () {
    if (this.items && this.items.length > 0) {
        this.totalPrice = this.items.reduce((total, item) => total + item.price, 0);
    } else {
        this.totalPrice = 0;
    }
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
