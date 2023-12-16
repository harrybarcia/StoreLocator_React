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
  const regex = new RegExp(city, 'i');

  console.log('city in controller', city);
  if (!city) {
     const result = await Store.find();
    return res.status(401).json({ message: 'All cities', data: result });
  } else {
    try {
      const result = await Store.find({ city: { $regex: regex } });
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
  

exports.getFilteredFields = async (req, res) => {
  try {
    const filteredFields = await Store.find({ isFiltered: true }).exec();
    // Extract the field names from the filtered fields
    const fieldNames = Object.keys(filteredFields[0].toObject());
    res.json(fieldNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
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
  const typeObject = JSON.parse(req.body.typeObject);
  console.log("typeObjzdfcqect:", typeObject)
  const fieldId = typeObject.id;
  const store=await new Store({
    storeId:storeId,
    fields: [fieldId], // Add the Field reference to the fields array
    address, image, userId, city, price, rating, typeObject});
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
  const userId = "64fa71d29df5a1f4b8cf582f";
  const image = req.file?.filename || "";

  let typeObject = req.body.typeObject ||[];
  console.log('typeObject', typeObject);
  console.log('typeObject', typeof(typeObject));

  if (typeof typeObject != "string"){
    typeObject = JSON.parse(req.body.typeObject);
  } else {
    typeObject = []
  }
  const newPinData = {
    ...pinData, // Include properties from pinData
    storeId: storeId, // Add the storeId property
    userId: userId, // Add the userId property
    skipGeocoding: true, // Set this flag to skip geocoding
    image:image,
    typeObject:typeObject,
    fields:typeObject?.map((item => item.id))
  };
  try {
    const savedPin = await Store.createPinWithoutGeocoding(newPinData);
    const field = await Store.findById(savedPin._id).populate('typeObject.colors');
    res.status(200).json([savedPin, field]);
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
  const location = req.body.location
  const typeObject = JSON.parse(req.body.typeObject);
  console.log("jsonparse", JSON.parse(location))
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
      store.location = JSON.parse(location)
      store.typeObject = typeObject
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
  // Find the store by _id
  Store.findById(storeId, (err, store) => {
    if (err) {
      console.error('Error finding store:', err);
      mongoose.connection.close(); // Close the database connection
      return;
    }
    if (store) {
      console.log('Found Store:', store);
    } else {
      console.log('Store not found');
    }
    })
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

