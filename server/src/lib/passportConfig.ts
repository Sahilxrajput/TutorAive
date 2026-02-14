import { Request } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import User from "../models/user.model";

const ALLOWED_ROLES = ["student", "instructor" ] as const;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.SERVER_URL}/auth/callback/google`,
      passReqToCallback: true, // Required to access the state
    },
    async (req: Request, _authToken, _refreshToken, profile: Profile, done) => {
      try {
        const state = req.query.state;
        const roleFromState =
          typeof state === "string" ? state : Array.isArray(state) ? state[0] : undefined;
        const assignedRole =
          roleFromState && ALLOWED_ROLES.includes(roleFromState as (typeof ALLOWED_ROLES)[number])
            ? (roleFromState as (typeof ALLOWED_ROLES)[number])
            : "student";

        let user = await User.findOne({ oauthId: profile.id });

        if (!user) {
          user = await User.create({
            firstName: profile.name?.givenName || "",
            lastName: profile.name?.familyName || "",
            oauthProvider: "google",
            oauthId: profile.id,
            profilePicture: profile.photos?.[0].value,
            email: profile.emails?.[0].value,
            role: assignedRole,
          });
        }
        done(null, user);
      } catch (err) {
        done(err as Error, false);
      }
    },
  ),
);
