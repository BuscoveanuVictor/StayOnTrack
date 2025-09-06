const express = require('express');
const passport = require('passport');
const ensureAuth = require('../middlewares/ensureAuth');
const { googleCallback, logout, check, passwordStatus, testLogin } = require('../controllers/authController');

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), googleCallback);
router.get('/google/logout', ensureAuth, logout);
router.get('/check', check);
router.get('/password-status', ensureAuth, passwordStatus);

// Testare e2e - login 
router.post('/test-login', testLogin);

module.exports = router;
