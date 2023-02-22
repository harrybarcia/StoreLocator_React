const mongoose=require('mongoose');
const geocoder=require('../utils/geocoder');

const Schema=mongoose.Schema;

const ratingSchema=new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'model_User'},
  rating:{type:Number, required:[true, 'Please add a rating']},
});

const StoreSchema=new Schema(
  {storeId:{type: Schema.Types.ObjectId},
    address:{type:String,required:[true, 'Please add an address']},
    location: {type: {type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
          type: [Number],
          index:'2dsphere' //2dsphere support queries that calculates geometries on an earth like sphere

        },
        formattedAddress:String
      },
      createdAt:{
          type:Date,
          default:Date.now
      },
      image:String,
      userId: {type: Schema.Types.ObjectId, ref: 'User'},
      city:String,
      price:{type:Number, required:[true, 'Please add a price']},
      rating:{type:Number, required:[true, 'Please add a rating']},
      reviews:[ratingSchema]
    });

    

// Geocode & create locat
// we awnt to save before it is sent to the db
StoreSchema.pre('save', async function(next) {
  const   loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress
  };
  console.log("location in model", this.location);
  // Do not save address
  this.address=undefined;
  next(); 
})
module.exports=mongoose.model('Store', StoreSchema)