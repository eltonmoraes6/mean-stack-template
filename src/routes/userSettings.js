const router = require('express').Router();
const UserSettings = require('../controllers/userSettings');
const Auth = require('../middleware/auth');

router.get('/:id', Auth.ensureAuthorized, UserSettings.get_user_by_id);
router.delete('/delete/:id', Auth.ensureAuthorized, UserSettings.remove_user_account);
router.patch('/update/:id', Auth.ensureAuthorized, UserSettings.update_user);
router.patch('/first/password', Auth.ensureAuthorized, UserSettings.resetPassword);

module.exports = router;