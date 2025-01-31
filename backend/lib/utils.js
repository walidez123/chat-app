import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
    try {
        // Create the JWT token
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set the token as an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            sameSite: 'strict', // Prevents CSRF attacks
            secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only sent over HTTPS in production
        });

        // Optionally, you can return the token if needed
        return token;

    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Failed to generate token');
    }
};

export { generateToken };