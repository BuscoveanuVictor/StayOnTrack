const express = require('express');
const ensureAuth = require('../middlewares/ensureAuth');
// const ensurePasswordValidated = require('../middlewares/ensurePasswordValidated');
const { getRules, updateRules, replaceRules, validatePassword } = require('../controllers/rulesController');

const router = express.Router();

router.get('/', ensureAuth, getRules);
router.post('/', ensureAuth, updateRules);
router.post('/update', ensureAuth, replaceRules); // compat cu ruta veche
router.post('/validate-password', ensureAuth, validatePassword);

module.exports = router;
