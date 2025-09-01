import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req?.headers?.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Access token is missing',
                error: true,
                success: false,
            });
        }

        const decoded = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);


        if (!decoded) {
            return res.status(401).json({
                message: 'Invalid access token',
                error: true,
                success: false,
            });
        }

        console.log('Decoded token:', decoded);

        req.Userid = decoded.Id; 
        
        next();

    } catch (error) {
        console.error('Error in auth middleware:', error);
        return res.status(500).json({
            message: 'Error in auth middleware: ' + error.message || error,
            error: true,
            success: false,
        });
    }
}

export default auth;    