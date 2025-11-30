import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import passport from '../config/passport';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// JWT authentication middleware
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.header('Authorization');
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Authorization header missing or malformed' });
	}
	const token = authHeader.replace('Bearer ', '');
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string; email: string };
		(req as any).user = {
			id: decoded.id,
			username: decoded.username,
			email: decoded.email
		};
		next(); 
	} catch (err) {
		next(err);
	}
};
