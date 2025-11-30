import { Router } from 'express';
import { signup, login, logout, googleLogin, googleLogout } from '../controllers/userController';
import express, { Request, Response, NextFunction } from 'express';
import passport from '../config/passport';

const authRoutes = Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);

// Google OAuth login
authRoutes.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback (calls controller logic to issue JWT)
authRoutes.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleLogin
);

// Google OAuth logout
authRoutes.get('/google/logout', googleLogout);

// Get current user
authRoutes.get('/current-user', (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

export default authRoutes;
