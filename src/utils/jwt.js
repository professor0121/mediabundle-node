import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            username: user.username,
            role: user.role
        },
        process.env.ACCESS_TOKEN_SECRET || "access_secret_12345",
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d"
        }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            _id: user._id
        },
        process.env.REFRESH_TOKEN_SECRET || "refresh_secret_12345",
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d"
        }
    );
};

export const verifyToken = (token, secretType = "access") => {
    const secret = secretType === "access" 
        ? (process.env.ACCESS_TOKEN_SECRET || "access_secret_12345")
        : (process.env.REFRESH_TOKEN_SECRET || "refresh_secret_12345");
    return jwt.verify(token, secret);
};
