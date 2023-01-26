const express = require('express');
const path = require('path');
const adminController = require('../controllers/controller_stores');
const multer = require('multer');
const authenticateToken = require('../utils/JWT');
const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'public/images');
    },
    filename:(req,file,cb)=>{
      console.log('file in stores.js', file);
        cb(null, file.originalname);
    }
  });
const upload=multer({storage:fileStorage}).single('image');
const Store = require('../models/model_Store');
const app = express.Router();
app.get('/api', authenticateToken, adminController.getStores);
app.get('/api/search/:city', authenticateToken, adminController.getStoresByCity);
app.get('/api/:storeId',authenticateToken, adminController.getStore);
app.post('/add-store', authenticateToken, upload, adminController.addStore)
app.delete('/api/:id',adminController.deleteStore)
app.put('/edit-store/:id',authenticateToken, upload, adminController.updateStore)

module.exports = app;