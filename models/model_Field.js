const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema(
  {
    type: {
      type: mongoose.Schema.Types.Mixed, // Mixed type can represent various data types
    },

    visibility:{
      type:Boolean, 
      default:false, 
      required:true},

    isFilter:{
      type:Boolean, 
      default:false, 
      required:true},

    order:{
      type:Number
    },

    colors: {
      type: Object,
      ref: 'colors',
    },
  },
);

module.exports = mongoose.model('Field', fieldSchema);
