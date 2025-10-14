import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import User, { IUser } from "../models/user.model";

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}


passport.serializeUser((user: IUser, done) => done(null, user._id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    console.log(user);
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
      callbackURL: "http://localhost:3000/api/auth/callback/google",
    },
    async (accessToken, refreshToken, profile: Profile, done) => {
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
        console.log("user:" + user);
        done(null, user);
      } catch (err) {
        done(err as Error, false);
      }
    }
  )
);
