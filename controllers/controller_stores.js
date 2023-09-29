const Store=require('../models/model_Store')
const mongodb=require('mongodb');
// const { json } = require('body-parser');
const ObjectId = require('mongodb').ObjectId; 

exports.getStore = async (req, res, next) => {
  const storeId = req.params.id;
  const data = await Store.findById(storeId);
  return (
    res.status(200).json(data )
  );
}

exports.getStoresByCity = async (req, res, next) => {
  
  const city = (req.params.city).trim();
  console.log('city in controller', city);
  if (!city) {
     const result = await Store.find();
    return res.status(401).json({ message: 'All cities', data: result });
  } else {
    try {
      const result = await Store.find({city});
      console.log('result in controller try', result);
      return (
        res.status(200).json({ message: 'Success!', data: result })
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
  const rating = req.body.rating;
  
        const store=await new Store({
          storeId:storeId,
          address, image, userId, city, price, rating});
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

exports.addStoreFromClick = async (req, res) => {
  const pinData = req.body; // Assuming req.body contains the data for the new pin
  const storeId = new mongodb.ObjectId();
  const userId = req.user.userId;
  const image = req.file.filename;
  const newPinData = {
    ...pinData, // Include properties from pinData
    storeId: storeId, // Add the storeId property
    userId: userId, // Add the userId property
    skipGeocoding: true, // Set this flag to skip geocoding
    image:image
  };
  try {
    const savedPin = await Store.createPinWithoutGeocoding(newPinData);
    res.status(200).json(savedPin);
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.updateStore = (req, res, next) => {
  console.log('in update controller');
  const storeId =req.params.id;
  const updatedCity = req.body.city;
  const updatedAddress = req.body.address;
  const updatedImage = req.file.filename;
  const price = req.body.price;
  const rating = req.body.rating;
  const userId = req.user.userId?req.user.userId:null;
  if (req.bypassGeocode) {
    console.log(req.bypassGeocode)
    Store.findById(storeId, userId)
    .then(store => {
      console.log('store', store);
      store.skipGeocoding = true, // Set this flag to skip geocoding
      store.address = updatedAddress;
      store.image = updatedImage;
      store.city = updatedCity;
      store.price = price;
      store.rating = rating;
      return store.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Store updated!', data: result });
    })
    .catch(err => console.log(err));
  } else {
    Store.findById(storeId, userId)
    .then(store => {
      console.log('store', store);
      store.address = updatedAddress;
      store.image = updatedImage;
      store.city = updatedCity;
      store.price = price;
      store.rating = rating;

      return store.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Store updated!', data: result });
    })
    .catch(err => console.log(err));
  }
};

exports.deleteStore = (req, res, next) => {
  
  console.log('delete body store', req.params.id);
  console.log('req.user in controller stores', req.user);
  
  const storeId = req.params.id;
  const userId = req.user.userId?req.user.userId:null;
  Store.deleteOne({ _id: storeId, userId: userId })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.status(200).json({ message: 'Success!' });
    })
    .catch(err => console.log(err));
};

exports.getStores = async (req, res, next) => {

    const data = await Store.find();
      return res.status(200).json(data)
  };

exports.getMyStores = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }
  console.log("here")
  const userId = req.user.userId;
  const data = await Store.find(
    {userId: userId}
  );
  return res.status(200).json(data)
};


  exports.rateStore = async (req, res, next) => {
    console.log('in controller stores', req.user);
    
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }
    // I retrieve the rating from the request body
    const {rating} = req.body;
    // I retrieve the store from the database
    const store = await Store.findById(req.params.id);
    // I check if the store has been rated by the user
    if (store) {
      const alreadyReviewed = store.reviews.find(
        (r) => r.user.toString() === req.user.userId.toString()
      );
      console.log('alreadyReviewed', alreadyReviewed); // returns the review object { rating: 5, user: 5f9f9f9f9f9f9f9f9f9f9f9f, _id: 5f9f9f9f9f9f9f9f9f9f9f9f}
      const review = {
        rating: Number(rating),
        user: req.user.userId,
      }

      if (alreadyReviewed) {
      // if the user has already rated the store, I delete the old review and add the new one
        var index = store.reviews.indexOf(alreadyReviewed);
        if (index > -1) {
          store.reviews.splice(index, 1);
        }
      }

      // if the user has not rated the store, I add the new review
      store.reviews.push(review)

      store.numReviews = store.reviews.length
      store.rating = store.reviews.reduce((acc, item) => item.rating + acc, 0) / store.reviews.length
      Store.findByIdAndUpdate(store, {rating: store.rating, reviews: store.reviews, numReviews: store.numReviews})
      .then(result => {
        res.status(200).json({ message: 'Store updated!', data: result });
      })
    } else {
      res.status(404)
      throw new Error('Store not found')
    }
    console.log('reviews', store.reviews.length);
};
    