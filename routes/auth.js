const express = require('express');
const path = require('path');
const authController = require('../controllers/controller_auth');


const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
router.post('/logout', authController.postLogout);

module.exports = router;