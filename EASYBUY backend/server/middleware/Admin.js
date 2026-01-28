import UserModel from "../model/user.model.js";

export const admin = async (request, response, next) => {
    try {
        const userId = request.userId;
        console.log("Admin Middleware - userId:", userId);

        const user = await UserModel.findById(userId);
        console.log("Admin Middleware - User Found:", user ? "Yes" : "No");
        console.log("Admin Middleware - User Role:", user?.role);

        if (!user || user.role !== "ADMIN") {
            return response.status(403).json({
                message: "Permission denied",
                error: true,
                success: false
            });
        }

        next();
    } catch (error) {
        return response.status(500).json({
            message: "Permission denied",
            error: true,
            success: false
        });
    }
};
