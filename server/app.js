// ****** BIBLIOTECI ******
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')
const crypto = require('crypto');

// ****** APLICATIE EXPRESS ******
const app = express();

// ****** VARIABILE DE ENV ******

// NODE ENV se seteaza in package.json 
// la sectiunea scripts
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

const CLIENT_ID = process.env.CLIENT_ID; 
const CLIENT_SECRET = process.env.CLIENT_SECRET;

//
const DB_SERVER_URL = process.env.DB_SERVER_URL; 
const WEB_SERVER_URL = process.env.WEB_SERVER_URL;
const API_SERVER_URL = process.env.API_SERVER_URL;

// ****** MODULE UTILIZATE ******
app.use(cors({
  origin: WEB_SERVER_URL,  
  credentials: true   
}));
// Aici folosesti modulul json 
// din biblioteca express 
// pentru a putea procesa JSON
app.use(express.json());

// Configurare sesiuni
app.use(session({
  secret: 'secretulmeu',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: DB_SERVER_URL }),
  cookie: {
    httpOnly: true,
    secure: false,  // true doar pe HTTPS
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// ****** BAZA DE DATE ******
mongoose.connect(DB_SERVER_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { MongoClient } = require('mongodb');
const uri = DB_SERVER_URL;
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


// ****** CONFIGURARE Google OAuth2 ******

passport.use(new GoogleStrategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: `${API_SERVER_URL}/auth/google/callback`,
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

app.get('/test', (req, res) => {
  res.send('Serverul de backend este pornit');
});

// Auth cu google
app.get('/auth/google',  
  // aici se incarca pagina de autentificare cu Google(alegere cont)
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback dupa autentificare
app.get('/auth/google/callback',
  // aici foloseste passport.user(new GoogleStrategy) cand se 
  // intoarce raspunsul de la Google cu datele userului
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log("User authenticated:", req.user);
    res.redirect(`${WEB_SERVER_URL}/`);
  }
);

app.get('/auth/google/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect(WEB_SERVER_URL); 
    });
  });
});

app.get('/auth/check', (req, res) => {
    res.json({
      auth: req.isAuthenticated()
    });
});

// Helperi parola/rules
function hashPassword(raw) {
  return require('crypto').createHash('sha256').update(String(raw)).digest('hex');
}

const PASSWORD_WINDOW_MS = 5 * 60 * 1000; // 5 minute

async function ensurePasswordValidated(req, res, next) {
  try {
    const user = await db.collection('users').findOne({ _id: req.user._id });
    const rules = user && user.rules ? user.rules : {};
    if (rules.passwordEnabled) {
      const validated = req.session && req.session.passwordValidated;
      const validatedAt = req.session && req.session.passwordValidatedAt;
      const stillValid = validated && typeof validatedAt === 'number' && (Date.now() - validatedAt) <= PASSWORD_WINDOW_MS;
      if (!stillValid) {
        if (req.session) {
          req.session.passwordValidated = false;
          req.session.passwordValidatedAt = null;
        }
        return res.status(403).json({ message: 'Parola necesara', needsPassword: true });
      }
    }
    next();
  } catch (e) {
    return res.status(500).json({ message: 'Eroare server' });
  }
}

app.get('/rules', async (req, res) => {
  try {
    const user = await db.collection('users').findOne({ _id: req.user._id }, { projection: { rules: 1 } });
    const rules = user && user.rules ? user.rules : {};
    res.json({
      breakEnabled: !!rules.breakEnabled,
      breakCount: rules.breakCount || 1,
      breakTime: rules.breakTime || 5,
      passwordEnabled: !!rules.passwordEnabled,
      passwordValidated: !!(req.session && req.session.passwordValidated)
    });
  } catch (e) {
    res.status(500).json({ message: 'Eroare server' });
  }
});

app.post('/rules', async (req, res) => {
  try {
    const { breakEnabled, breakCount, breakTime, passwordEnabled, password } = req.body || {};

    const toSet = {
      'rules.breakEnabled': !!breakEnabled,
      'rules.breakCount': Number(breakCount) || 1,
      'rules.breakTime': Number(breakTime) || 5,
      'rules.passwordEnabled': !!passwordEnabled,
    };

    if (passwordEnabled && password) {
      toSet['rules.passwordHash'] = hashPassword(password);
      if (req.session) req.session.passwordValidated = false;
    }

    if (!passwordEnabled) {
      toSet['rules.passwordHash'] = null;
      if (req.session) req.session.passwordValidated = false;
    }

    await db.collection('users').updateOne(
      { _id: req.user._id },
      { $set: toSet }
    );
    res.json({ message: 'Rules updated successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Eroare server' });
  }
});

app.post('/auth/validate-password', async (req, res) => {
  try {
    const { password } = req.body || {};
    if (!password) return res.status(400).json({ message: 'Parola lipsa' });

    const user = await db.collection('users').findOne({ _id: req.user._id });
    const rules = user && user.rules ? user.rules : {};
    if (!rules.passwordEnabled || !rules.passwordHash) {
      return res.status(400).json({ message: 'Parola nu este activata' });
    }

    const isOk = hashPassword(password) === rules.passwordHash;
    if (!isOk) return res.status(401).json({ message: 'Parola incorecta' });

    req.session.passwordValidated = true;
    req.session.passwordValidatedAt = Date.now();
    res.json({ message: 'Parola valida', passwordValidated: true, validForMs: PASSWORD_WINDOW_MS });
  } catch (e) {
    res.status(500).json({ message: 'Eroare server' });
  }
});

app.get('/auth/password-status', (req, res) => {
  const validated = !!(req.session && req.session.passwordValidated);
  const validatedAt = req.session && req.session.passwordValidatedAt;
  let remainingMs = 0;
  if (validated && typeof validatedAt === 'number') {
    remainingMs = Math.max(0, PASSWORD_WINDOW_MS - (Date.now() - validatedAt));
  }
  res.json({ passwordValidated: validated && remainingMs > 0, remainingMs });
});

app.get('/block-list.json', async (req, res) => {
    const user = await db.collection('users').findOne({ _id: req.user._id });
    res.json({list: user.block_list || []});
});

app.post('/block-list/update', ensurePasswordValidated, async (req, res) => {

    const { list } = req.body; 
    await db.collection('users').updateOne(
        { _id : req.user._id }, // folosim _id-ul userului autentificat
        { 
          $set: { "block_list": list } 
        }
    );
    res.json({ message: "List updated successfully" });
});

app.post('/block-list/add-domain', ensurePasswordValidated, async (req, res) => {

    const { domain } = req.body; 
    await db.collection('users').updateOne(
        { _id : req.user._id }, // folosim _id-ul userului autentificat
        { 
          $push: { "block_list": domain } 
        }
    );
    res.json({ message: "List updated successfully" });
});


app.get('/allow-list.json', async (req, res) => {
    const user = await db.collection('users').findOne({ _id: req.user._id });
    res.json({list: user.allow_list || []});
});

app.post('/allow-list/add-domain', ensurePasswordValidated, async (req, res) => {

    const { domain } = req.body; 
    await db.collection('users').updateOne(
        { _id : req.user._id }, // folosim _id-ul userului autentificat
        { 
          $push: { "allow_list": domain } 
        }
    );
    res.json({ message: "List updated successfully" });
});

app.post('/allow-list/update', ensurePasswordValidated, async (req, res) => {

    const { list } = req.body; 
    await db.collection('users').updateOne(
        { _id : req.user._id }, // folosim _id-ul userului autentificat
        { 
          $set: { "allow_list": list } 
        }
    );
    res.json({ message: "List updated successfully" });
});


app.get('/task-list.json', async (req, res) => {
  const user = await db.collection('users').findOne({ _id: req.user._id });
    res.json({list : user.task_list || []}
  );
})

app.post('/task-list/update', async (req, res) => {
    const { list } = req.body; // extrage task din body
    console.log("Received request to update task_list:", list);
    await db.collection('users').updateOne(
        { _id : req.user._id }, // folosim _id-ul userului autentificat
        { 
          $set: { "task_list": list } 
        }
    );
    res.json({ message: "Task list updated successfully" });
});


app.post('/rules/update', async (req, res) => {
    const { rules } = req.body;
    await db.collection('users').updateOne(
        { _id: req.user._id },
        {
            $set: { "rules": rules }
        }
    );
    res.json({ message: "Rules updated successfully" });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});