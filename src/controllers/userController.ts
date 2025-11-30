import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user';
import logger from 'src/utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const signup = async (req: Request, res: Response) => {
	try {
		const { username, email, password } = req.body;
		if (!username || !email || !password) {
			return res.status(400).json({ message: 'All fields are required' });
		}
		const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
		if (existingUser) {
			return res.status(409).json({ message: 'User already exists' });
		}
		const user = new UserModel({ username, email, password });
		await user.save();
		return res.status(201).json({ message: 'User registered successfully' });
	} catch (err) {
		return res.status(500).json({ message: 'Server error', error: err });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body;
		if (!username || !password) {
			return res.status(400).json({ message: 'Username and password are required' });
		}
		const user = await UserModel.findOne({ username });
		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}
		const token = jwt.sign(
			{ id: user._id, username: user.username, email: user.email },
			JWT_SECRET,
			{ expiresIn: '1h' }
		);
		return res.status(200).json({ token });
	} catch (err) {
        logger.error('Login error:', err);
		return res.status(500).json({ message: 'Server error', error: err });
	}
};


export const logout = async (req: Request, res: Response) => {
    // Since JWTs are stateless, logout can be handled on the client side by deleting the token.
    return res.status(200).json({ message: 'Logout successful on client side. Please delete the token.' });
}

// Google OAuth login callback handler
export const googleLogin = (req: Request, res: Response) => {
	// User is attached to req.user by Passport after successful Google OAuth
	if (!req.user) {
		return res.status(401).json({ message: 'Google authentication failed' });
	}
	// Optionally, issue a JWT for the user for frontend use
	const user = req.user as any;
	const token = jwt.sign(
		{ id: user._id, username: user.username, email: user.email },
		JWT_SECRET,
		{ expiresIn: '1h' }
	);
	// You can redirect or respond with the token and user info
	// For API:
	return res.status(200).json({ token, user });
};

// Google OAuth logout handler
export const googleLogout = (req: Request, res: Response) => {
	req.logout((err) => {
		if (err) {
			return res.status(500).json({ error: 'Logout failed' });
		}
		res.status(200).json({ message: 'Logged out from Google session' });
	});
};