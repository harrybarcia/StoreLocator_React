const fs=require('fs');
const path=require('path');
const express=require('express');
const jwt = require('jsonwebtoken')
require('dotenv').config(
  {path: path.join(__dirname, '../.env')}
)
const PORT = process.env.PORT || 3001;
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
console.log(process.env.MONGO_USER);
console.log(process.env.MONGO_PASSWORD);
console.log(process.env.MONGO_DATABASE);
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

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('public/build'));
// } 
mongoose
  .connect(MONGODB_URI || 'mongodb://localhost:27017/storelocatordb', 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
},)
  .then(result => {
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);  
    })
  })
  .catch(err => {
    console.log(err);
  });