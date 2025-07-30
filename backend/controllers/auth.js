const UserSchema = require("../models/UserModel");
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '30d'
    });
};

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await UserSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create new user
        const user = new UserSchema({
            name,
            email,
            password
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Return user data (without password) and token
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        };

        res.status(201).json({
            message: 'User created successfully',
            user: userResponse,
            token
        });

    } catch (error) {
        console.error('Signup Error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await UserSchema.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user._id);

        // Return user data (without password) and token
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        };

        res.status(200).json({
            message: 'Login successful',
            user: userResponse,
            token
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Middleware to verify token
exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}; 