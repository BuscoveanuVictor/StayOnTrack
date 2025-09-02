const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const connectDB  = require('./config/db');

const passport = require('./config/passport');
const authRoutes = require('./routes/authRoutes');
const rulesRoutes = require('./routes/rulesRoutes');
const listRoutes = require('./routes/listRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// DB
connectDB().catch(err => {
  console.error('❌ MongoDB connection error', err);
  process.exit(1);
});


// Middlewares ==============================================
// sunt functii care primește (req, res, next) și
// se execută între request și răspuns

// permite cereri CORS de la front-end
app.use(cors({ origin: process.env.WEB_SERVER_URL, credentials: true })); 
 // pentru a parsa JSON în body
app.use(express.json());

// sesiuni stocate in MongoDB
const isProd = process.env.NODE_ENV === 'production';
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.DB_SERVER_URL }),
  cookie: {
    httpOnly: true,
    secure: isProd,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// ii permit lui passport sa intercepteze request-urile
// si sa foloseasca regulile folosite in config/passport.js
app.use(passport.initialize());
// ia ID-ul din sesiune, îl deserializă (folosind passport.deserializeUser) 
// și pune user-ul complet în req.user.
app.use(passport.session());

// Routes
app.use('/test', (req, res) => {
  res.json({ message: 'API is working' });
});
app.use('/auth', authRoutes);
app.use('/rules', rulesRoutes);
app.use('/', listRoutes); // păstrează compatibilitatea cu rutele existente
app.use('/', taskRoutes); // idem

module.exports = app;
