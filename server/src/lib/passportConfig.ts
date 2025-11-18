import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import User from "../models/user.model";
import { IUser } from "../types/type";

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

passport.serializeUser((user: IUser, done) => done(null, user._id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user || null);
  } catch (err) {
    console.log(err);
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: `${process.env.SERVER_URL}/api/auth/callback/google`,
    },
    async (authToken, refreshToken, profile: Profile, done) => {
      try {
        let user = await User.findOne({ oauthId: profile.id });
        if (!user) {
          user = await User.create({
            firstName: profile.name?.givenName || "",
            lastName: profile.name?.familyName || "",
            oauthProvider: "google",
            oauthId: profile.id,
            profilePicture: profile.photos?.[0].value,
            email: profile.emails?.[0].value,
          });
        }
        done(null, user);
      } catch (err) {
        done(err as Error, false);
      }
    }
  )
);
