const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userRepo = require('../repositories/userRepository');

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});
console.log(process.env.CLIENT_ID);

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_SERVER_URL = process.env.API_SERVER_URL;


// configurez strategia de autentificare cu Google
// adica eu cand accesez /auth/google in browser
// ma duce la Google unde ma loghez
passport.use(new GoogleStrategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: `${API_SERVER_URL}/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // aici primesc raspunsul de la Google
    // vad daca am userul in baza de date
    let user = await userRepo.findByGoogleId(profile.id);

    // daca nu am, il creez
    if (!user) {
      user = await userRepo.create({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails?.[0]?.value,
        photo: profile.photos?.[0]?.value,
      });
    }

    // aici se semnaleaza ca inregistrarea
    // a fost cu succes, mai departe se duce
    // in serializeUser ca sa salveze userul in sesiune
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// salvez userul in sesiune prin ID-ul lui
passport.serializeUser((user, done) => done(null, user.id));

// vede daca userul are o sesiune valida
// daca da, ia ID-ul din sesiune si cauta userul in baza de date
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userRepo.findById(id);
    done(null, user);
  } catch (e) {
    done(e);
  }
});

module.exports = passport;
