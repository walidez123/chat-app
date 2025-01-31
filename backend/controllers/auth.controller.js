import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

const register = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input fields
    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save the user to the database
        await user.save();

        // Generate a token for the user
        const token = generateToken(user._id,res);

        // Return success response with token and user details
        return res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            token,
            msg: 'User registered successfully'
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate a token for the user
        const token = generateToken(user._id,res);

        // Return success response with token and user details
        return res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            token,
            msg: 'User logged in successfully'
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};
const updateProfile = async (req, res) => {
    try {
        const { profilePic, name, email, password } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: "User not found" });

        const updateFields = {};
        if (profilePic) {
            const cloudinaryRes = await cloudinary.uploader.upload(profilePic);
            updateFields.profilePic = cloudinaryRes.secure_url;
        }
        if (name) updateFields.name = name;
        if (email) updateFields.email = email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 12);
            updateFields.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });

        res.status(200).json({
            msg: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                profilePic: updatedUser.profilePic,
            },
        });

    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
};

const checkAuth =async (req,res)=>{
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}
const logout = (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ msg: 'User logged out successfully' });
    } catch (error) {
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

export { register, login, logout,updateProfile,checkAuth };