const userRepo = require('../repositories/userRepository');
const { PASSWORD_WINDOW_MS } = require('../utils/security');

async function ensurePasswordValidated(req, res, next) {
  try {
    const user = await userRepo.findById(req.user._id);
    const rules = user?.rules || {};

    if (rules.passwordEnabled) {
      const validated = req.session?.passwordValidated;
      const validatedAt = req.session?.passwordValidatedAt;
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
    console.error(e);
    res.status(500).json({ message: 'Eroare server' });
  }
}

module.exports = ensurePasswordValidated;
