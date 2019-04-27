const router = require('express').Router();
const User = require('../controllers/userCtrl');
const Auth = require('../middleware/auth');

router.post('/signin', User.user_signin);
router.post('/signup', User.user_signup);
router.post('/me', Auth.ensureAuthorized, User.user_profile);
router.patch('/update/avatar', Auth.ensureAuthorized, User.update_user_avatar)
router.patch('/activation/:token', User.activationToken);
router.post('/resend/', User.resendToken);
router.get('/newtoken/:email', Auth.ensureAuthorized, User.renewToken);
router.post('/resetpassword/', User.resetPassword);
router.patch('/resetpassword/:token', User.checkResetPassword);

module.exports = router;