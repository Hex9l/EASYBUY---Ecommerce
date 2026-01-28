import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.headers?.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Access token is missing",
                error: true,
                success: false,
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.SECRET_KEY_ACCESS_TOKEN
        );

        req.userId = decoded.Id;
        req.Userid = decoded.Id; // Keep for backward compatibility 

        next();
    } catch (error) {
        console.error("Error in auth middleware:", error);
        return res.status(401).json({
            message: "Invalid or expired token",
            error: true,
            success: false,
        });
    }
};

export default auth;
