import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protect = async (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ msg: 'Not authorized - no token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({ msg: 'Not authorized - token failed' });
        }
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Token error:', error);
        return res.status(401).json({ msg: 'Not authorized - token failed' });
    }
}