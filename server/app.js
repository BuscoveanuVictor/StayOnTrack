// ****** BIBLIOTECI ******
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');


// ****** APLICATIE EXPRESS ******
const app = express();

// ****** CONSTANATE ******
const { CLIENT_ID, CLIENT_SECRET } = require('./config'); 
const REDIRECT_URI = 'http://localhost:5000/auth/google/callback'; // URL-ul de redirect după autentificare

// ****** MODULE UTILIZATE ******
app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true   
}));
// Aici folosesti modulul json din biblioteca express pentru a putea procesa JSON
app.use(express.json());

// Configurare sesiuni
app.use(session({
  secret: 'secretulmeu',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/StayOnTrack' }),
  cookie: {
    httpOnly: true,
    secure: false,  // true doar pe HTTPS
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// ****** BAZA DE DATE ******
mongoose.connect('mongodb://localhost:27017/StayOnTrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ****** SCHEMA ******
const userSchema = new mongoose.Schema({
  googleId: String,
  displayName: String,
  email: String,
  photo: String,
});

// ****** MODELE ******

// Aici pentru ca am pus User el automat cauta in baza de date 
// o colectie numita users  daca nu exista o creeaza automat 
const User = mongoose.model('User', userSchema);

// ****** Configurare Google OAuth2 ******
passport.use(new GoogleStrategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: REDIRECT_URI,
}, async (accessToken, refreshToken, profile, done) => {

  // Aici verificam daca userul exista deja in baza noastra de date
  const existingUser = await User.findOne({ googleId: profile.id });
  if (existingUser) {
    return done(null, existingUser);
  }

  // Daca userul nu exista in baza noastra de date
  // il cream cu datele primite de la Google din profile
  const newUser = await new User({
    googleId: profile.id,
    displayName: profile.displayName,
    email: profile.emails[0].value,
    photo: profile.photos[0].value,
  }).save();

  // aici functia done salveaza in sesiune userul
  done(null, newUser);
}));

// ****** Passport serialize/deserialize ******

// apelata o singura data dupa autentificarea userului cu succes
// aceasta salveaza in sesiunea curenta, minimul de informatie 
// necesar al userului  ( id ul acestuia )
passport.serializeUser((user, done) => done(null, user.id));
// dupa care functia asta folosind id ul userului din sesiune
// incarca din baza de date tot userul si il pune in req.user
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});


// ****** RUTE ******
app.get('/', (req, res) => { 
  res.redirect('http://localhost:3000/');
})

// Auth cu google
app.get('/auth/google',  
  // aici se incarca pagina de autentificare cu Google(aleger cont)
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback dupa autentificare
app.get('/auth/google/callback',
  // aici foloseste passport.user(new GoogleStrategy) cand se 
  // intoarce raspunsul de la Google cu datele userului
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log("User authenticated:", req.user);
    res.redirect('/');
  }
);

// Logout
// app.get('/logout', (req, res) => {
//   req.logout(() => {
//     res.redirect('http://localhost:3000/');
//   });
// });


// Database connection
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

let db;
client.connect().then(() => {
    db = client.db("StayOnTrack");
});

app.post('/block-list/add-domain', async (req, res) => {
    console.log("User is authenticated:", req.user);
    
    const { domain } = req.body; // extrage domain din body
    console.log("Received request to add domain:", domain);
    await db.collection('users').updateOne(
        { nume: "Victor" },
        { 
          $set: { "block_list.last_updated": Date.now()},
          $push: { "block_list.domains": domain } 
        }
    );
    res.json({ message: "Domain added successfully" });
});

app.get('/block-list/blocked-sites.json', async (req, res) => {
    try {
        await db.collection('users').findOne({ nume: "Victor" }).then((user) => {
          res.json(
            {
              block_list: user.block_list.domains || [],
              last_updated: user.block_list.last_updated || Date.now()
            });
        });
    } catch (error) {
        console.error("Error fetching blocked sites:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/block-list/remove-domain', async (req, res) => {
    const { domain } = req.body; // extrage domain din body
    console.log("Received request to remove domain:", domain);
    await db.collection('users').updateOne(
        { nume: "Victor" },
        { 
          $set: { "block_list.last_updated": Date.now()},
          $pull: { "block_list.domains": domain } 
        }
    );
    res.json({ message: "Domain removed successfully" });
});

app.get('/blocked-sites.json/last-updated', async (req, res) => {
    try {
        const user = await db.collection('users').findOne({ nume: "Victor" });
        if (user) {
            res.json({ last_updated: user.block_list.last_updated || Date.now() });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error("Error fetching last updated time:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});