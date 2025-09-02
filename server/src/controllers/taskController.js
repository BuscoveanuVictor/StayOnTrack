const userRepo = require('../repositories/userRepository');

exports.getTasks = async (req, res) => {
  const user = await userRepo.findById(req.user._id);
  res.json({ list: user.task_list || [] });
};

exports.updateTasks = async (req, res) => {
  const { list } = req.body;
  await userRepo.updateById(req.user._id, { task_list: list });
  res.json({ message: 'Task list updated successfully' });
};
