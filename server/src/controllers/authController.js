exports.test = (req, res) => {
  res.send('Serverul de backend este pornit');
};

exports.googleCallback = (req, res) => {
  console.log('User authenticated:', req.user);
  res.redirect(process.env.WEB_SERVER_URL + '/');
};

exports.logout = (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Logout error' });
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect(process.env.WEB_SERVER_URL);
    });
  });
};

exports.check = (req, res) => {
  res.json({ auth: req.isAuthenticated() });
};

exports.passwordStatus = (req, res) => {
  const PASSWORD_WINDOW_MS = 5 * 60 * 1000;
  const validated = !!(req.session && req.session.passwordValidated);
  const validatedAt = req.session && req.session.passwordValidatedAt;
  let remainingMs = 0;
  if (validated && typeof validatedAt === 'number') {
    remainingMs = Math.max(0, PASSWORD_WINDOW_MS - (Date.now() - validatedAt));
  }
  res.json({ passwordValidated: validated && remainingMs > 0, remainingMs });
};

// Dev-only: programmatic login for e2e
const userRepo = require('../repositories/userRepository');
exports.testLogin = async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'Not allowed in production' });
    }
    const email = req.body?.email || 'test.user@example.com';
    let user = await userRepo.findByEmail(email);
    if (!user) {
      user = await userRepo.create({
        googleId: 'e2e-mock-' + Date.now(),
        displayName: 'E2E User',
        email,
        photo: ''
      });
    }
    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: 'Login failed' });
      return res.json({ message: 'Logged in', userId: user._id });
    });
  } catch (e) {
    res.status(500).json({ message: 'Eroare server' });
  }
};
