const Store=require('../models/model_Store')
const mongodb=require('mongodb');
// const { json } = require('body-parser');




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
exports.getStoresTest = (req, res, next) => {
  // Store.find({userId: req.user._id})
  Store.find({})

    .then(stores => {
    
      res.status(200).json({
        message: 'Success',
        stores: stores
      });
      
    })
    .catch(err => {
      console.log(err);
    });
};




exports.getStore = (req, res, next) => {
  console.log('heree');
  console.log(req.params);
  const storeId = (req.params.storeId).trim();
  console.log(storeId)
  Store.findById(storeId)
    .then(store => {
      console.log(store);
      res.render('stores/store-details', {
        prods: store,
        path: '/stores/:storeId',
      });
    })
    .catch(err => console.log(err));
};

  exports.getAddStore= (req, res, next)=>{
    console.log("add store", req.user);
      res.render('pages/add',{
          path:'/add-store',
          pageTitle:'Add Store',
          editing:false
      })
      }
// @desc Create a store
// @route POST /api-stores
// @access Public
exports.addStore = async (req, res, next)=>{
  console.log('session addstores', req.body);
  const address=req.body.address;
  const image = "";
  const storeId = new mongodb.ObjectId();
  const userId = req.body.userId;
  const city = req.body.city;
  
  console.log("req", req.body);
        const store=await new Store({
          storeId:storeId,
          address, image, userId, city});
        store
        .save()
        .then(results => {
          console.log(results);
          console.log('Created Store');
          res.redirect('/');
        })
          .catch (err=>{
            console.error(err);
            if (err.code===11000){
                return res.status(400).json({error:'this store already exist'})
            }
            res.status(500).json({error:"Server error"})
    })
}


exports.getEditStore = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const storeId = req.params.storeId;
  Store.findById(storeId)
    .then(store => {
      if (!store) {
        return res.redirect('/');
      }
      res.render('pages/add',{
        path:'/add',
        pageTitle:'Add Store',
        editing: editMode,
        store: store,
        csrfToken:req.csrfToken()      

      });
    })
    .catch(err => console.log(err));
};

exports.postEditStore = (req, res, next) => {
  const storeId = req.body.storeId;
  const updatedAddress = req.body.address;
  const updatedImage = req.file.filename;
  const updatedCity = req.body.city;


  Store.findById(storeId)
    .then(store => {
      // if (store.userId.toString() !== req.user._id.toString()) {
      //   return res.redirect('/');
      // }
      store.address = updatedAddress;
      store.image = updatedImage;
      store.city = updatedCity;
      return store.save()
    .then(result => {
      console.log('UPDATED PRODUCT!');
      // res.redirect('/stores/' + storeId);
      res.redirect('/');
    });
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

