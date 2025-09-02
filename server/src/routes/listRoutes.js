const express = require('express');
const ensureAuth = require('../middlewares/ensureAuth');
const ensurePasswordValidated = require('../middlewares/ensurePasswordValidated');
const {
  getBlockList,
  updateBlockList,
  addBlockDomain,
  getAllowList,
  updateAllowList,
  addAllowDomain,
  setMode,
} = require('../controllers/listController');

const router = express.Router();

// Block list
router.get('/block-list.json', ensureAuth, getBlockList);
router.post('/block-list/update', ensureAuth, ensurePasswordValidated, updateBlockList);
router.post('/block-list/add-domain', ensureAuth, ensurePasswordValidated, addBlockDomain);

// Allow list
router.get('/allow-list.json', ensureAuth, getAllowList);
router.post('/allow-list/update', ensureAuth, ensurePasswordValidated, updateAllowList);
router.post('/allow-list/add-domain', ensureAuth, ensurePasswordValidated, addAllowDomain);

// Mode
router.post('/set-mode', ensureAuth, setMode);

module.exports = router;
