const router = require('express').Router();
const Admin = require('../controllers/admin');
const Auth = require('../middleware/auth');

router.get('/users', Auth.ensureAuthorized, Admin.find_all_users);
router.get('/user/:id', Auth.ensureAuthorized, Admin.get_user_by_id);
router.delete('/delete/user/:id', Auth.ensureAuthorized, Admin.remove_user_account);
router.patch('/update/user/:id', Auth.ensureAuthorized, Admin.update_user);

module.exports = router;