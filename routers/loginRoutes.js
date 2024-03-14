const express = require('express');
const passport = require('passport');
const router = express.Router();
const { loginUser } = require('../controllers/loginController');

router.post('/login', passport.authenticate('local', { session: true
 }), loginUser);

module.exports = router;