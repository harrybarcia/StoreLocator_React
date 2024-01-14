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
    image:{type:String, required:false},
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    city:String,
    price:{type:Number, required:[false, 'Please add a price']},
    rating:{type:Number},
    reviews:[ratingSchema],
    skipGeocoding:{
      type: Boolean,
      required: false,
      default: false
    },
    fields: [{ type: Schema.Types.ObjectId, ref: 'Field' }],
    typeObject: {
      type: [Object], // Use an array of objects to allow dynamic properties
      default: [],
      required:false
    },   
    });



  StoreSchema.pre('save', async function(next){
    self = this
    if (!self.skipGeocoding) {
      const loc = await geocoder.geocode(this.address);
      this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
      };
      next();
    } 
  })

// Create a static method for adding pins without geocoding
StoreSchema.statics.createPinWithoutGeocoding = async function (pinData) {
  const { address, formattedAddress, longitude, latitude, ...rest } = pinData;
  console.log('longitude', longitude);
  // Construct the location object
  const location = {
    type: 'Point',
    coordinates: [longitude, latitude],
    formattedAddress: address,
  };
  // Create a new document with the missing fields
  const store = new this({
    address: address,
    location: location,
    ...rest, // Include any other fields from pinData
  });

  // Save the document
  await store.save();
  return store;
};

module.exports=mongoose.model('Store', StoreSchema)