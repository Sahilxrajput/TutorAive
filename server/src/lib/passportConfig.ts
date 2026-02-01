import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import User from "../models/user.model";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.SERVER_URL}/auth/callback/google`,
    },
    async (_authToken, _refreshToken, profile: Profile, done) => {
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
