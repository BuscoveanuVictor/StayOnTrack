const userRepo = require('../repositories/userRepository');
const { hashPassword, PASSWORD_WINDOW_MS } = require('../utils/security');

exports.getRules = async (req, res) => {
  try {
    const user = await userRepo.findById(req.user._id);
    const rules = user?.rules || {};
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
};

exports.updateRules = async (req, res) => {
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

    await userRepo.updateById(req.user._id, toSet);
    res.json({ message: 'Rules updated successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Eroare server' });
  }
};

exports.replaceRules = async (req, res) => {
  try {
    const { rules } = req.body || {};
    await userRepo.updateById(req.user._id, { rules });
    res.json({ message: 'Rules updated successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Eroare server' });
  }
};

exports.validatePassword = async (req, res) => {
  try {
    const { password } = req.body || {};
    if (!password) return res.status(400).json({ message: 'Parola lipsa' });

    const user = await userRepo.findById(req.user._id);
    const rules = user?.rules || {};
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
};
