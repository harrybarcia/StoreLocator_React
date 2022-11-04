const express = require('express');

const path = require('path');
const authController = require('../controllers/controller_auth');
const User = require('../models/model_User');
const jwt = require('jsonwebtoken')
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



function authenticateToken(req, res, next) {
  console.log('req.headers', req.headers);
  console.log('req.headers', req.headers['cookie'].split('=')[1]);

  const authHeader = req.headers['cookie']
  const token = authHeader && authHeader.split('=')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(token)
    console.log(process.env.ACCESS_TOKEN_SECRET)
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}





module.exports = app;