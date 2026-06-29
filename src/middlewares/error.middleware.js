import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {
    let error = err;

    // Check if the error is an instance of ApiError, if not wrap it
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || (error instanceof mongoose.Error ? 400 : 500);
        const message = error.message || "Internal Server Error";
        error = new ApiError(statusCode, message, error.errors || [], err.stack);
    }

    const response = {
        ...error,
        message: error.message,
        ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {})
    };

    return res.status(error.statusCode).json(response);
};

export default errorMiddleware;
