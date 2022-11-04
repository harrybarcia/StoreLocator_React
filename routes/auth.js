const express = require('express');

const path = require('path');
const authController = require('../controllers/controller_auth');
const User = require('../models/model_User');
const jwt = require('jsonwebtoken')
const Store = require('../models/model_Store');
const app = express.Router();
app.post('/register', authController.signUp);




app.get('/api/users', async (req, res) => {
    const results = await User.find()
    return res.json(results);
    });

app.post('/login', authController.login);

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.get('/stores', authenticateToken, async (req, res) => {
    const stores = await Store.find();
    res.json(stores);
});




module.exports = app;