const userRepo = require('../repositories/userRepository');

exports.getBlockList = async (req, res) => {
  const user = await userRepo.findById(req.user._id);
  res.json({ list: user.block_list || [] });
};

exports.updateBlockList = async (req, res) => {
  const { list } = req.body;
  await userRepo.updateById(req.user._id, { block_list: list });
  res.json({ message: 'List updated successfully' });
};

exports.addBlockDomain = async (req, res) => {
  const { domain } = req.body;
  const user = await userRepo.findById(req.user._id);
  const next = Array.from(new Set([...(user.block_list || []), domain]));
  await userRepo.updateById(req.user._id, { block_list: next });
  res.json({ message: 'List updated successfully' });
};

exports.getAllowList = async (req, res) => {
  const user = await userRepo.findById(req.user._id);
  res.json({ list: user.allow_list || [] });
};

exports.updateAllowList = async (req, res) => {
  const { list } = req.body;
  await userRepo.updateById(req.user._id, { allow_list: list });
  res.json({ message: 'List updated successfully' });
};

exports.addAllowDomain = async (req, res) => {
  const { domain } = req.body;
  const user = await userRepo.findById(req.user._id);
  const next = Array.from(new Set([...(user.allow_list || []), domain]));
  await userRepo.updateById(req.user._id, { allow_list: next });
  res.json({ message: 'List updated successfully' });
};


exports.setMode = async (req, res) => {
  const { mode } = req.body;
  await userRepo.updateById(req.user._id, { mode : mode });
  res.json({ message: 'Mode updated successfully' });
};