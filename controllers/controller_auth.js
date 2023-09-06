
const bcrypt = require('bcrypt');
const mongodb = require('mongodb');
const Store = require('../models/model_Store');
const User = require('../models/model_User');
const dotenv = require('dotenv');

dotenv.config({path:'./config/config.env' });

const jwt = require('jsonwebtoken');


// exports.getUsers = async (req, res, next) => {
//   User.find()
//   const users = await User.find({});
//   res.send(users);
// };
  
exports.signUp = async (req, res, next)=>{
  const email = req.body.email;
  console.log('session addstores', req.body);
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;


  const hashedPassword = await bcrypt.hash(password, 12);
  const userId = new mongodb.ObjectId();
  const user = new User({
    userId: userId,
    email: email,
    password: hashedPassword,
  });
  user
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({ message: 'User created!' });
    }
    )
    .catch(err => {
      console.log(err);
    });
};

exports.login = async (req, res, next)=>{
  
  const { email, password } = req.body;

  console.log('login', req.body);
  const user = await User.findOne({ email: email });
  if (!user) {
      return res.status(401).json({ message: 'User not found' });
  }
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
      return res.status(401).json({ message: 'Password is incorrect' });
  }

  const token = jwt.sign(
      {
          email: user.email,
          userId: user._id.toString()
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '240m' }
  );
  console.log("token", token)
  res.cookie('access-token', token, { httpOnly: true });
  res.json({ token: token, userId: user._id.toString() });
  return user;


};

exports.logout = async (req, res, next)=>{
  
  res.cookie('access-token', '', { maxAge: 1 });
  res.redirect('/');
};

