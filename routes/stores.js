const express = require('express');

const adminController = require('../controllers/controller_stores');
const multer = require('multer');
const authenticateToken = require('../utils/JWT');
const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'public/images');
    },
    filename:(req,file,cb)=>{
      // console.log('file in stores.js', file);
        cb(null, file.originalname);
    }
  });

      // Middleware function to check for the bypass tag
function bypassGeocoding(req, res, next) {
  // Check if the "bypassGeocode" query parameter is present and set to true
  if (req.query.bypassGeocode === 'true') {
    req.bypassGeocode = true;
  } else {
    req.bypassGeocode = false;
  }
  next();
}
  
const upload=multer({storage:fileStorage}).single('image');
const Store = require('../models/model_Store');
const app = express.Router();
app.get('/allStores', adminController.getStores);
app.get('/myStores', authenticateToken, adminController.getMyStores);
app.delete('/api/:id', authenticateToken, adminController.deleteStore)
app.get('/search/:city',  adminController.getStoresByCity);
app.get('/api/:id', adminController.getStore);
app.post('/add-store', authenticateToken,  upload, adminController.addStore)
app.post('/add-store-from-click', authenticateToken,  upload, adminController.addStoreFromClick)
app.put('/edit-store/:id',authenticateToken, bypassGeocoding, upload, adminController.updateStore)
app.post('/rate/:id',authenticateToken, adminController.rateStore)

module.exports = app;