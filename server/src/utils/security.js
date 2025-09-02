const crypto = require('crypto');

function hashPassword(raw) {
  return crypto.createHash('sha256').update(String(raw)).digest('hex');
}

const PASSWORD_WINDOW_MS = 5 * 60 * 1000; // 5 minute

module.exports = { hashPassword, PASSWORD_WINDOW_MS };
