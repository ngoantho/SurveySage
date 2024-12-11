import * as passport from "passport";
import { hostname } from "os";

//let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
let GoogleStrategy =
  require("passport-google-oauth20-with-people-api").Strategy;

// Creates a Passport configuration for Google
class GooglePassport {
  clientId: string;
  secretId: string;

  constructor() {
    this.clientId = process.env.OAUTH_ID;
    this.secretId = process.env.OAUTH_SECRET;

    passport.use(
      new GoogleStrategy(
        {
          clientID: this.clientId,
          clientSecret: this.secretId,
          callbackURL: process.env.AZURE ? "https://surveysage.azurewebsites.net/auth/login/callback" : "/auth/login/callback",
        },
        (accessToken, refreshToken, profile, done) => {
          console.log("inside new password google strategy");
          process.nextTick(() => {
            console.log("userId:" + profile.id);
            console.log("displayName: " + profile.displayName);
            console.log("retrieve all of the profile info needed");
            return done(null, profile);
          });
        }
      )
    );

    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function (user, done) {
      done(null, user);
    });
  }
}
export default GooglePassport;
