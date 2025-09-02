const User = require('../models/User');

module.exports = {
  findById: (id) => User.findById(id),
  findByGoogleId: (gid) => User.findOne({ googleId: gid }),
  findByEmail: (email) => User.findOne({ email }),
  create: (data) => new User(data).save(),
  updateById: (id, data) => User.updateOne({ _id: id }, { $set: data }),
  getRules: (id) => User.findById(id, { rules: 1 }),
};
