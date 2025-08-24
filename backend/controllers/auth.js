const UserSchema = require("../models/UserModel");
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '30d'
    });
};

exports.signup = async (req, res) => {
    const { username, name, email, password } = req.body;

    try {
        // Check if user already exists with email
        const existingUser = await UserSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Check if username already exists
        const existingUsername = await UserSchema.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Create new user
        const user = new UserSchema({
            username,
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
            username: user.username,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
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
            return res.status(400).json({ message: 'Email or username already exists' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.login = async (req, res) => {
    const { emailOrUsername, password } = req.body;

    try {
        // Check if user exists by email or username
        const user = await UserSchema.findOne({
            $or: [
                { email: emailOrUsername },
                { username: emailOrUsername }
            ]
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email/username or password' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email/username or password' });
        }

        // Generate token
        const token = generateToken(user._id);

        // Return user data (without password) and token
        const userResponse = {
            _id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
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

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await UserSchema.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update profile (username, name, email)
exports.updateProfile = async (req, res) => {
    const { username, name, email } = req.body;

    try {
        const user = await UserSchema.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if username is already taken by another user
        if (username && username !== user.username) {
            const existingUsername = await UserSchema.findOne({ username });
            if (existingUsername) {
                return res.status(400).json({ message: 'Username already taken' });
            }
        }

        // Check if email is already taken by another user
        if (email && email !== user.email) {
            const existingEmail = await UserSchema.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already taken' });
            }
        }

        // Update fields
        if (username) user.username = username;
        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        // Return updated user data (without password)
        const userResponse = {
            _id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            createdAt: user.createdAt
        };

        res.status(200).json({
            message: 'Profile updated successfully',
            user: userResponse
        });

    } catch (error) {
        console.error('Update Profile Error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update password
exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await UserSchema.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error('Update Password Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update profile picture
exports.updateProfilePicture = async (req, res) => {
    const { profilePicture } = req.body;

    try {
        const user = await UserSchema.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.profilePicture = profilePicture;
        await user.save();

        const userResponse = {
            _id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            createdAt: user.createdAt
        };

        res.status(200).json({
            message: 'Profile picture updated successfully',
            user: userResponse
        });

    } catch (error) {
        console.error('Update Profile Picture Error:', error);
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