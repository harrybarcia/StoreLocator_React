
const User = require('../models/model_User');
const bcrypt = require('bcryptjs');
const Store=require('../models/model_Store')


exports.getLogin = (req, res, next) => {
  console.log('session', req.session);
  console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login'
    });
  };


  exports.getSignup = (req, res, next) => {

    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: req.flash('error')[0]
  
    });
  };

  exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          req.flash('error', 'Invalid email or password.');
    
          return res.redirect('/login');
        }
        bcrypt.compare(password, user.password)
          .then(doMatch => {
            if (doMatch) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              return req.session.save(err => {
                console.log(err);
                res.redirect('/');
              });
            }
            res.redirect('/login');
          })
          .catch(err => {
            console.log(err);
          });
      })
    
    };

    exports.postSignup = (req, res, next) => {
      const email = req.body.email;
      const password = req.body.password;
      const confirmPassword = req.body.confirmPassword;
      User.findOne({ email: email })
        .then(userDoc => {
          if (userDoc) {
            req.flash('error', 'Email already exists!');
            return res.redirect('/signup');
          }
          return bcrypt
            .hash(password, 12)
            .then(hashedPassword => {
              const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
              });
              return user.save();
            })
            .then(result => {
              return res.redirect('/login');
               
            }).catch(err => {
              console.log(err);
            }
            );
        })
        .catch(err => {
          console.log(err);
        });
    };

    exports.postLogout = (req, res, next) => {
      req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
      });
    };

    // exports.postTest = async (req, res, next) => {
    //   console.log('session addstores', req.session);
    //   const storeId=req.body.storeId;
    //   const address=req.body.address;
    //         const store=await new Store({
    //           storeId:storeId, address: address, image:''});
    //         store
    //         .save()
    //         .then(results => {
    //           console.log(results);
    //           res.redirect('/')        })
    //           .catch (err=>{
    //             console.error(err);
    //             if (err.code===11000){
    //                 return res.status(400).json({error:'this store already exist'})
    //             }
    //             res.status(500).json({error:"Server error"})
    //     })
    // }
    