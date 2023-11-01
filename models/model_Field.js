const mongoose = require('mongoose');

const dynamicSchema = new mongoose.Schema(
  {
    type: {
      type: mongoose.Schema.Types.Mixed, // Mixed type can represent various data types
    },
    flagVisibility:{
      type:Boolean, 
      default:false, 
      required:true}
  }
);

const DynamicModel = mongoose.model('Field', dynamicSchema);
module.exports = DynamicModel;
