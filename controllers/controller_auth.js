
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

  const accessToken = jwt.sign({ email, password }, '5b61290199fd4349e9b299bcbf0c81628fa0b47c67fe697f5a0192a1126d07b406f20c298143a70e1e9aa4fcdcdba730369213d5c6a5a81a94c9cd0d7c299911');
  res.json({ accessToken: accessToken });
  
  
};
  