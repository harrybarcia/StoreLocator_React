const express = require('express');

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
app.get('/allStores', adminController.getStores);
app.get('/myStores', authenticateToken, adminController.getMyStores);
app.delete('/api/:id',adminController.deleteStore)
app.get('/search/:city',  adminController.getStoresByCity);
app.get('/api/:id', adminController.getStore);
app.post('/add-store', authenticateToken,  upload, adminController.addStore)
app.put('/edit-store/:id',authenticateToken, upload, adminController.updateStore)
app.post('/rate/:id',authenticateToken, adminController.rateStore)

module.exports = app;