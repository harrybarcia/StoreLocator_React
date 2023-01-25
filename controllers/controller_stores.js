const Store=require('../models/model_Store')
const mongodb=require('mongodb');
// const { json } = require('body-parser');
const ObjectId = require('mongodb').ObjectId; 





exports.getStore = async (req, res, next) => {
  console.log('dans get store de controller_stores, req.user:', req.user);
  const storeId = (req.params.storeId).trim();
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated.' });
  } else {
    try {
      const data = await Store.findById(storeId);
      console.log('data in controller try', data);
      
      return (
        res.status(200).json({ message: 'Success!', data: data })
      );
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

};


// @desc Create a store
// @route POST /api-stores
// @access Public
exports.addStore = async (req, res, next)=>{
  
  console.log("user in controller stores", req.user);
  const address=req.body.address;
  const image = req.file.filename;
  const storeId = new mongodb.ObjectId();
  const userId = req.user.userId;
  const city = req.body.city;
  const price = req.body.price;
  
        const store=await new Store({
          storeId:storeId,
          address, image, userId, city, price});
        store
        .save()
        .then(results => {
          console.log("results in controlle stores")
          console.log(results);
          console.log('Created Store');
          res.status(200).json({ message: 'Success!', data: results });

        })
          .catch (err=>{
            console.error(err);
            if (err.code===11000){
                return res.status(400).json({error:'this store already exist'})
            }
            res.status(500).json({error:"Server error"})
    })
}


exports.updateStore = (req, res, next) => {
  
  console.log('in update controller');
  
  const storeId =req.params.id;
  const updatedCity = req.body.city;
  const updatedAddress = req.body.address;
  const updatedImage = req.file.filename;
  const price = req.body.price;
  const userId = req.user.userId?req.user.userId:null;
  Store.findById(storeId, userId)
    .then(store => {
      console.log('store', store);
      store.address = updatedAddress;
      store.image = updatedImage;
      store.city = updatedCity;
      store.price = price;
      return store.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Store updated!', data: result });
    })
    .catch(err => console.log(err));
};

  



exports.deleteStore = (req, res, next) => {
  
  console.log('delete body store', req.params.id);
  
  const storeId = req.params.id;
  Store.deleteOne({ _id: storeId })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.status(200).json({ message: 'Success!' });
    })
    .catch(err => console.log(err));
};

exports.getStores = async (req, res, next) => {
  console.log('in controller stores', req.user);
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }
    const userId = req.user.userId;
    const data = await Store.find({userId:req.user.userId});

    
    // console.log('data in controller', data);
    
    return res.status(200).json(data)

  };