import * as passport from "passport"; 
import { hostname } from "os"; 

// Import Google OAuth strategy
let GoogleStrategy =
  require("passport-google-oauth20-with-people-api").Strategy;

// Creates a Passport configuration for Google
class GooglePassport {
  clientId: string; 
  secretId: string; 

  constructor() {
    // Initialize clientId and secretId from environment variables
    this.clientId = process.env.OAUTH_ID;
    this.secretId = process.env.OAUTH_SECRET;

    // Configure Passport to use Google OAuth strategy
    passport.use(
      new GoogleStrategy(
        {
          clientID: this.clientId, 
          clientSecret: this.secretId, 
          callbackURL: process.env.AZURE
            ? "https://surveysage.azurewebsites.net/auth/login/callback" //  Azure callback URL if in Azure environment
            : "/auth/login/callback", // local callback URL 
        },
        (accessToken, refreshToken, profile, done) => {
          console.log("inside new password google strategy");
          process.nextTick(() => {
            // Asynchronously process the user profile
            console.log("userId:" + profile.id); 
            console.log("displayName: " + profile.displayName); 
            console.log("retrieve all of the profile info needed");
            return done(null, profile); 
          });
        }
      )
    );

    // Serialize user information into the session
    passport.serializeUser(function (user, done) {
      done(null, user); 
    });

    // Deserialize user information from the session
    passport.deserializeUser(function (user, done) {
      done(null, user); 
    });
  }
}

export default GooglePassport; 
