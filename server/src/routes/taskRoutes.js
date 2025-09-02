const express = require('express');
const ensureAuth = require('../middlewares/ensureAuth');
const { getTasks, updateTasks } = require('../controllers/taskController');

const router = express.Router();

router.get('/task-list.json', ensureAuth, getTasks);
router.post('/task-list/update', ensureAuth, updateTasks);

module.exports = router;
