const fs=require('fs');
const path=require('path');
const express=require('express');
const jwt = require('jsonwebtoken')
require('dotenv').config()

const cors=require('cors');
const multer=require('multer');
const mongoose = require('mongoose');
// const session=require('express-session');
const csrf=require('csurf');

require ('dotenv').config();
const mongodb=require('mongodb');

const flash = require('connect-flash');
// const MongoDBStore = require('connect-mongodb-session')(session);
const User = require('./models/model_User');

const compression = require('compression');
const https = require('https');
// load env vars
const morgan = require('morgan');

const bodyParser=require('body-parser');
const cookieParser = require("cookie-parser");

const MONGODB_URI =
  
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.iaepn.mongodb.net/${process.env.MONGO_DATABASE}`;

  
const app=express();



app.use(cors());

// Set static folder

app.use(express.static(path.join(__dirname, 'public')));
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const storesRoutes = require('./routes/stores'); 
const authRoutes = require('./routes/auth');
const pollenRoutes = require('./routes/pollen');



app.use(authRoutes);
app.use(storesRoutes);
app.use(pollenRoutes);


app.use(cookieParser());


mongoose
  .connect(MONGODB_URI)
  .then(result => {

  console.log('connected to db on port 3000');
  app.listen(3001);
  })
  .catch(err => {
    console.log(err);
  });