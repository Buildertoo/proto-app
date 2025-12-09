const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const { findOrCreateOAuthUser, findUserById } = require('../services/userService');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.userId);
});

// Deserialize user from session
passport.deserializeUser(async (userId, done) => {
  try {
    const user = await findUserById(userId);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Create user object from Google profile
        const userProfile = {
          email: profile.emails[0].value,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          provider: 'google',
          photo: profile.photos[0]?.value,
        };
        
        const user = await findOrCreateOAuthUser(userProfile);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Microsoft OAuth Strategy (only if credentials are provided)
if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET && 
    process.env.MICROSOFT_CLIENT_ID !== 'your-microsoft-client-id-here') {
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: process.env.MICROSOFT_CALLBACK_URL,
        scope: ['user.read'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Create user object from Microsoft profile
          const userProfile = {
            email: profile.emails?.[0]?.value || profile.userPrincipalName,
            displayName: profile.displayName,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            provider: 'microsoft',
            photo: null,
          };
          
          const user = await findOrCreateOAuthUser(userProfile);
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

module.exports = passport;
