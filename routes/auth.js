const express = require('express');

const path = require('path');
const authController = require('../controllers/controller_auth');
const User = require('../models/model_User');
const authenticateToken = require('../utils/JWT');
const Store = require('../models/model_Store');
const app = express.Router();

app.post('/register', authController.signUp);
app.use(express.json())


app.get('/stores2', authenticateToken, async (req, res) => {
    const stores = await Store.find();
    res.json(stores);
});


app.get('/api/users', async (req, res) => {
    const results = await User.find()
    return res.json(results);
    });

app.post('/login', authController.login);
app.get('/logout', authController.logout);









module.exports = app;