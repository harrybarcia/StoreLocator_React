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
  if (!city) {
     const result = await Store.find();
    return res.status(401).json({ message: 'All cities', data: result });
  } else {
    try {
      const result = await Store.find({ city});
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
  const rating = null;
  
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


exports.updateStore = (req, res, next) => {
  
  console.log('in update controller');
  
  const storeId =req.params.id;
  console.log('store id', storeId);
  const updatedCity = req.body.city;
  const updatedAddress = req.body.address;
  const updatedImage = req.file.filename;
  const price = 250000;
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
  const userId = req.user.userId?req.user.userId:null;
  Store.deleteOne({ _id: storeId, userId: userId })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.status(200).json({ message: 'Success!' });
    })
    .catch(err => console.log(err));
};

exports.getStores = async (req, res, next) => {
  
  console.log("loggedin?:", req.user?"yes":"no");

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
        (r) => r.userId.toString() === req.user.userId.toString()
      );
      console.log('alreadyReviewed', alreadyReviewed);
      if (alreadyReviewed) {
        res.status(400)
        throw new Error('Product already reviewed')
      }

      const review = {
        rating: Number(rating),
        user: req.user.userId,
    }

    store.reviews.push(review)
    store.numReviews = store.reviews.length
    store.rating = store.reviews.reduce((acc, item) => item.rating + acc, 0) / store.reviews.length

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }    
    Store.findByIdAndUpdate(store, {reviews: store.reviews, numReviews: store.numReviews, rating: store.rating})
    .then(result => {
      res.status(200).json({ message: 'Store updated!', data: result });
    })
  } else {
    res.status(404)
    throw new Error('Store not found')
  }
};
    