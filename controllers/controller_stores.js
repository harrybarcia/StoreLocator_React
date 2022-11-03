const Store=require('../models/model_Store')
const mongodb=require('mongodb');
// const { json } = require('body-parser');
const User = require('../models/model_User');



exports.getStoresList = (req, res, next) => {
  // Store.find({userId: req.user._id})
  Store.find({})

    .then(stores => {
    
      res.render('stores/stores-list', {
        prods: stores,
        pageTitle: 'All stores',
        path: '/stores-list',
      });
      
    })
    .catch(err => {
      console.log(err);
    });
};



exports.getStore = async (req, res, next) => {
  console.log('in Get Store');
  console.log(req.params);
  const storeId = (req.params.storeId).trim();
  console.log(storeId)
  const data = await Store.findById(storeId)
  console.log(data);
  return (
    res.status(200).json({ message: 'Success!', data: data })
  )

};


// @desc Create a store
// @route POST /api-stores
// @access Public
exports.addStore = async (req, res, next)=>{
  console.log('session addstores', req.body);
  console.log("req.file", req.file);
  const address=req.body.address;
  const image = req.file.filename;
  const storeId = new mongodb.ObjectId();
  const userId = req.body.userId;
  const city = req.body.city;
  
        const store=await new Store({
          storeId:storeId,
          address, image, userId, city});
        store
        .save()
        .then(results => {
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
  Store.findById(storeId)
    .then(store => {
      console.log('store', store);
      store.address = updatedAddress;
      store.image = updatedImage;
      store.city = updatedCity;
      return store.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Store updated!', data: result });
    })
    .catch(err => console.log(err));
};

  
exports.getUsers = async (req, res, next) => {
  console.log('in Get Users');
  const users = await User.find();
  users.forEach(user => {
    console.log(user);
  });
  
  console.log(users);
  res.status(200).json({ message: 'Success!', data: users });
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
  
  try{
  const re = new RegExp("[a-zA-Z0-9]");
  const city = req.query.city?req.query.city:re;
  const user = req.user?req.user:null;
  if (!city){
    const stores = await Store.find({userId: req.user._id});
    res.render('pages/index', {
      pageTitle: 'Store Locator | Home',
      path: '/',
      prods: stores,
      csrfToken:req.csrfToken()
    });
  }

   else{
  const stores = await Store.find({ city: city, userId: user});
    res.render('pages/index', {
    pageTitle: 'Store Locator | Home',
    path: '/api-store',
    prods: stores,
    csrfToken:req.csrfToken()

  });
}

  }catch(err){
    console.log(err);
  }
};

