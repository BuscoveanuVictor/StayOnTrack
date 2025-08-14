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

const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

let db;
client.connect().then(() => {
    db = client.db("StayOnTrack");
});


// ****** SCHEMA ******
const userSchema = new mongoose.Schema({
  googleId: String,
  displayName: String,
  email: String,
  photo: String,
  block_list: { type: [String], default: [] },
  task_list: { type: [Object], default: [] },
  // habbits: [{
  //   name: String,
  //   frequency: Number, // numarul de zile intre care se repeta
  //   last_completed: Date, // data ultimei completari
  //   streak: Number // numarul de zile consecutive in care a fost completat
  // }]
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
)

app.get('/auth/check', (req, res) => {
  //console.log(req.isAuthenticated())
  res.json({
    authentificated: req.isAuthenticated()
  });
});

app.get('/block-list/block-list.json', async (req, res) => {

  const user = await db.collection('users').findOne({ _id: req.user._id });
  res.json({block_list: user.block_list || []});

});

app.post('/block-list/add-domain', async (req, res) => {

    console.log("User is authenticated:", req.user);
    const { domain } = req.body; // extrage domain din body

    console.log("Received request to add domain:", domain);
    await db.collection('users').updateOne(
        { _id : req.user._id }, // folosim _id-ul userului autentificat
        { 
          $push: { "block_list": domain } 
        }
    );
    res.json({ message: "Domain added successfully" });

});

app.delete('/block-list/remove/:domain', async (req, res) => {
  const domain = req.params.domain;
  console.log("Received request to remove domain:", domain);
  await db.collection('users').updateOne(
      { _id : req.user._id }, // folosim _id-ul userului autentificat
      {
        $pull: { "block_list" : domain }
      }
  );
  res.status(200).send(); // trimite un raspuns de succes
});

app.get('/task-list/task-list.json', async (req, res) => {
  const user = await db.collection('users').findOne({ _id: req.user._id });
    res.json({task_list : user.task_list || []}
  );
})

app.post('/task-list/update', async (req, res) => {
    const { task_list } = req.body; // extrage task din body
    console.log("Received request to update task_list:", task_list);
    await db.collection('users').updateOne(
        { _id : req.user._id }, // folosim _id-ul userului autentificat
        { 
          $set: { "task_list": task_list } 
        }
    );
    res.json({ message: "Task list updated successfully" });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});