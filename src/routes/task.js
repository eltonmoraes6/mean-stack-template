const router = require('express').Router();
const Task = require('../controllers/taskCtrl');
const Auth = require('../middleware/auth');

router.post('/', Auth.ensureAuthorized, Task.create_task);
router.get('/', Auth.ensureAuthorized, Task.get_all_task);
router.get('/:id', Auth.ensureAuthorized, Task.get_task_by_id);
router.delete('/:id', Auth.ensureAuthorized, Task.remove_task);
router.patch('/update/:id', Auth.ensureAuthorized, Task.update_task);
router.patch('/update/avatar/:id', Auth.ensureAuthorized, Task.update_task_avatar);

module.exports = router;