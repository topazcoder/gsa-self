import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { UserModel, User } from '../models/user';

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        // Check if user already exists
        let user = await UserModel.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }

        // Check if email already exists (for linking accounts)
        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await UserModel.findOne({ email });
          
          if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
          }
        }

        // Create new user
        const newUser = await UserModel.create({
          googleId: profile.id,
          username: profile.displayName || profile.emails?.[0]?.value?.split('@')[0],
          email: email,
          authProvider: 'google',
        });
        done(null, newUser);
      } catch (error) {
        done(error as Error, undefined);
      }
    }
  )
);

export default passport;
