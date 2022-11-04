const express = require('express');
const path = require('path');
const adminController = require('../controllers/controller_stores');
const multer = require('multer');
const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'public/images');
    },
    filename:(req,file,cb)=>{
      console.log('file in server.js', file);
        cb(null, file.originalname);
    }
  });
const upload=multer({storage:fileStorage}).single('image');
const Store = require('../models/model_Store');
const app = express.Router();
app.get('/api', async (req, res) => {
    const stores = await Store.find();
    return res.json(stores);  
  });
app.get('/api/:storeId', adminController.getStore);
app.post('/add-store', upload, adminController.addStore)
app.delete('/api/:id',adminController.deleteStore)
app.put('/edit-store/:id',upload, adminController.updateStore)

module.exports = app;